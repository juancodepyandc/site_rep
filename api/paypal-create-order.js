export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const env = process.env.PAYPAL_ENV === "live" ? "live" : "sandbox";
  const baseUrl = env === "live" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com";

  const clientId = process.env.PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_CLIENT_SECRET;

  if (!clientId || !secret) {
    res.status(500).json({ error: "Missing credentials" });
    return;
  }

  const { amount, currency, summary } = req.body || {};
  const value = Number(amount);

  if (!value || value <= 0) {
    res.status(400).json({ error: "Invalid amount" });
    return;
  }

  const proto = req.headers["x-forwarded-proto"] || "https";
  const host = req.headers.host;
  const returnUrl = `${proto}://${host}/paypal-return.html`;
  const cancelUrl = `${proto}://${host}/paypal-cancel.html`;

  const auth = Buffer.from(`${clientId}:${secret}`).toString("base64");

  const tokenRes = await fetch(`${baseUrl}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: "grant_type=client_credentials"
  });

  const tokenData = await tokenRes.json();
  if (!tokenRes.ok) {
    res.status(500).json(tokenData);
    return;
  }

  const description = summary
    ? `PC sur mesure - ${summary.cpu} / ${summary.gpu} / ${summary.ram}`
    : "PC sur mesure";

  const orderRes = await fetch(`${baseUrl}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${tokenData.access_token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [{
        description: description.slice(0, 127),
        amount: {
          currency_code: currency || "EUR",
          value: value.toFixed(2)
        }
      }],
      application_context: {
        return_url: returnUrl,
        cancel_url: cancelUrl,
        user_action: "PAY_NOW"
      }
    })
  });

  const orderData = await orderRes.json();
  if (!orderRes.ok) {
    res.status(500).json(orderData);
    return;
  }

  const approve = (orderData.links || []).find(l => l.rel === "approve");
  res.status(200).json({ approveUrl: approve ? approve.href : null });
}
