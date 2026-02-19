export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const env = process.env.PAYPAL_ENV === "live" ? "live" : "sandbox";
    const baseUrl =
      env === "live"
        ? "https://api-m.paypal.com"
        : "https://api-m.sandbox.paypal.com";

    const clientId = process.env.PAYPAL_CLIENT_ID;
    const secret = process.env.PAYPAL_CLIENT_SECRET;

    if (!clientId || !secret) {
      return res.status(500).json({ error: "Missing PayPal credentials" });
    }

    const { amount, currency = "EUR", summary } = req.body || {};
    const value = Number(amount);

    if (!value || value <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    const proto = req.headers["x-forwarded-proto"] || "https";
    const host = req.headers.host;

    const returnUrl = `${proto}://${host}/paypal-return.html`;
    const cancelUrl = `${proto}://${host}/paypal-cancel.html`;

    const auth = Buffer.from(`${clientId}:${secret}`).toString("base64");

    // 1️⃣ Token
    const tokenRes = await fetch(`${baseUrl}/v1/oauth2/token`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: "grant_type=client_credentials"
    });

    const tokenData = await tokenRes.json();
    if (!tokenRes.ok) return res.status(500).json(tokenData);

    const description = summary
      ? `PC sur mesure - ${summary.cpu} / ${summary.gpu} / ${summary.ram}${summary.quoteCode ? ` / ${summary.quoteCode}` : ""}`
      : "PC sur mesure";

    // 2️⃣ Création commande
    const orderRes = await fetch(`${baseUrl}/v2/checkout/orders`, {
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
            amount: {
              currency_code: currency,
              value: value.toFixed(2)
            }
          }
        ],
        application_context: {
          return_url: returnUrl,
          cancel_url: cancelUrl,
          user_action: "PAY_NOW"
        }
      })
    });

    const orderData = await orderRes.json();
    if (!orderRes.ok) return res.status(500).json(orderData);

    const approve = orderData.links.find(l => l.rel === "approve");

    res.status(200).json({
      orderID: orderData.id,
      approveUrl: approve?.href || null
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "PayPal create order failed" });
  }
}
