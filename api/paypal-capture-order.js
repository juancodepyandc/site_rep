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

  const { orderID } = req.body || {};
  if (!orderID) {
    res.status(400).json({ error: "Missing orderID" });
    return;
  }

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

  const captureRes = await fetch(`${baseUrl}/v2/checkout/orders/${orderID}/capture`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${tokenData.access_token}`,
      "Content-Type": "application/json"
    }
  });

  const captureData = await captureRes.json();
  if (!captureRes.ok) {
    res.status(500).json(captureData);
    return;
  }

  res.status(200).json({ ok: true });
}
