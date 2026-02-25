import { getRedisClient } from "./_redis.js";

const PAYPAL_CLIENT_ID_LIVE = String(process.env.PAYPAL_CLIENT_ID || "").trim();
const PAYPAL_CLIENT_SECRET_LIVE = String(process.env.PAYPAL_CLIENT_SECRET || "").trim();
const PAYPAL_CLIENT_ID_SANDBOX = String(process.env.PAYPAL_SANDBOX_CLIENT_ID || process.env.PAYPAL_CLIENT_ID_SANDBOX || "").trim();
const PAYPAL_CLIENT_SECRET_SANDBOX = String(process.env.PAYPAL_SANDBOX_CLIENT_SECRET || process.env.PAYPAL_CLIENT_SECRET_SANDBOX || "").trim();
const PAYPAL_SANDBOX_ENABLED = String(process.env.PAYPAL_SANDBOX_ENABLED || "0").trim() === "1";
const ATELIER_COMPANY_NAME = String(process.env.ATELIER_COMPANY_NAME || "Atelier Electronique").trim();
const PAYPAL_ORDER_LINK_TTL_SECONDS = 7 * 24 * 60 * 60;

function normalizePayPalMode(value) {
  const mode = String(value || "").trim().toLowerCase();
  if (mode === "live" || mode === "sandbox") return mode;
  return "";
}

function resolvePayPalConfig({ requestedMode }) {
  const defaultMode = process.env.PAYPAL_ENV === "sandbox" ? "sandbox" : "live";
  const mode = requestedMode || defaultMode;

  if (mode === "sandbox") {
    if (!PAYPAL_SANDBOX_ENABLED) {
      return { error: "PAYPAL_SANDBOX_DISABLED" };
    }
    if (!PAYPAL_CLIENT_ID_SANDBOX || !PAYPAL_CLIENT_SECRET_SANDBOX) {
      return { error: "PAYPAL_SANDBOX_MISSING_CREDENTIALS" };
    }
    return {
      mode,
      baseUrl: "https://api-m.sandbox.paypal.com",
      clientId: PAYPAL_CLIENT_ID_SANDBOX,
      secret: PAYPAL_CLIENT_SECRET_SANDBOX
    };
  }

  if (!PAYPAL_CLIENT_ID_LIVE || !PAYPAL_CLIENT_SECRET_LIVE) {
    return { error: "PAYPAL_LIVE_MISSING_CREDENTIALS" };
  }
  return {
    mode: "live",
    baseUrl: "https://api-m.paypal.com",
    clientId: PAYPAL_CLIENT_ID_LIVE,
    secret: PAYPAL_CLIENT_SECRET_LIVE
  };
}

async function persistOrderQuoteLink({ orderID, quoteCode, summary, paypalMode, amount, currency }) {
  if (!orderID || !quoteCode) return;
  try {
    const redis = await getRedisClient();
    await redis.set(
      `paypal:order:${orderID}`,
      JSON.stringify({
        quoteCode,
        summary: summary && typeof summary === "object" ? summary : {},
        paypalMode,
        amount,
        currency,
        createdAt: new Date().toISOString()
      }),
      { EX: PAYPAL_ORDER_LINK_TTL_SECONDS }
    );
  } catch (err) {
    console.error("Unable to persist PayPal order link:", err);
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const requestedMode = normalizePayPalMode(req.body?.paypalMode || req.body?.paypal_mode || "");
    if (!requestedMode && (req.body?.paypalMode || req.body?.paypal_mode)) {
      return res.status(400).json({ error: "INVALID_PAYPAL_MODE" });
    }
    const paypal = resolvePayPalConfig({ requestedMode });
    if (paypal.error === "PAYPAL_SANDBOX_DISABLED") return res.status(403).json({ error: paypal.error });
    if (paypal.error) return res.status(500).json({ error: paypal.error });

    const { amount, currency = "EUR", summary } = req.body || {};
    const value = Number(amount);
    const curr = String(currency || "EUR").trim().toUpperCase();

    if (!Number.isFinite(value) || value <= 0 || value > 50000) {
      return res.status(400).json({ error: "Invalid amount" });
    }
    if (!["EUR", "USD", "GBP"].includes(curr)) {
      return res.status(400).json({ error: "Invalid currency" });
    }

    const proto = req.headers["x-forwarded-proto"] || "https";
    const host = req.headers.host;

    const origin = `${proto}://${host}`;
    const returnUrl = new URL("/paypal-return.html", origin);
    returnUrl.searchParams.set("pp_mode", paypal.mode);
    const cancelUrl = new URL("/paypal-cancel.html", origin);
    cancelUrl.searchParams.set("pp_mode", paypal.mode);

    const auth = Buffer.from(`${paypal.clientId}:${paypal.secret}`).toString("base64");

    // 1️⃣ Token
    const tokenRes = await fetch(`${paypal.baseUrl}/v1/oauth2/token`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: "grant_type=client_credentials"
    });

    const tokenData = await tokenRes.json();
    if (!tokenRes.ok || !tokenData?.access_token) {
      return res.status(502).json({ error: "PAYPAL_AUTH_FAILED" });
    }

    const safeSummary = summary && typeof summary === "object" ? summary : null;
    const quoteCode = String(safeSummary?.quoteCode || "").trim().toUpperCase();
    const quoteCodeOk = /^DV-[A-Z0-9]{6,14}$/.test(quoteCode);
    const clean = (v, max = 64) => String(v || "").replace(/\s+/g, " ").trim().slice(0, max);
    const description = safeSummary
      ? `PC sur mesure - ${clean(safeSummary.cpu)} / ${clean(safeSummary.gpu)} / ${clean(safeSummary.ram)}${clean(safeSummary.quoteCode, 24) ? ` / ${clean(safeSummary.quoteCode, 24)}` : ""}`
      : "PC sur mesure";
    const invoiceId = quoteCodeOk
      ? `AE-${quoteCode}-${Date.now().toString(36).toUpperCase().slice(-6)}`
      : `AE-${Date.now().toString(36).toUpperCase().slice(-10)}`;

    // 2️⃣ Création commande
    const orderRes = await fetch(`${paypal.baseUrl}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            description: description.slice(0, 127),
            custom_id: quoteCodeOk ? quoteCode : undefined,
            invoice_id: invoiceId.slice(0, 127),
            amount: {
              currency_code: curr,
              value: value.toFixed(2)
            }
          }
        ],
        payment_source: {
          paypal: {
            experience_context: {
              brand_name: ATELIER_COMPANY_NAME.slice(0, 127),
              return_url: returnUrl.toString(),
              cancel_url: cancelUrl.toString(),
              user_action: "PAY_NOW"
            }
          }
        },
        application_context: {
          brand_name: ATELIER_COMPANY_NAME.slice(0, 127),
          return_url: returnUrl.toString(),
          cancel_url: cancelUrl.toString(),
          user_action: "PAY_NOW"
        }
      })
    });

    const orderData = await orderRes.json();
    if (!orderRes.ok || !orderData?.id) {
      return res.status(502).json({ error: "PAYPAL_ORDER_CREATE_FAILED" });
    }
    await persistOrderQuoteLink({
      orderID: String(orderData.id || "").trim(),
      quoteCode: quoteCodeOk ? quoteCode : "",
      summary: safeSummary,
      paypalMode: paypal.mode,
      amount: value.toFixed(2),
      currency: curr
    });

    const approve = orderData.links.find(l => l.rel === "approve");

    res.status(200).json({
      orderID: orderData.id,
      approveUrl: approve?.href || null,
      paypalMode: paypal.mode
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "PayPal create order failed" });
  }
}
