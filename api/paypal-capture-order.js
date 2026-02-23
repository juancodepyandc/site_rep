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

    const { orderID } = req.body || {};
    const order = String(orderID || "").trim();
    if (!order) {
      return res.status(400).json({ error: "Missing orderID" });
    }
    if (!/^[A-Z0-9\-]{10,64}$/i.test(order)) {
      return res.status(400).json({ error: "Invalid orderID" });
    }

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
    if (!tokenRes.ok || !tokenData?.access_token) {
      return res.status(502).json({ error: "PAYPAL_AUTH_FAILED" });
    }

    // 2️⃣ Capture
    const captureRes = await fetch(
      `${baseUrl}/v2/checkout/orders/${encodeURIComponent(order)}/capture`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
          "Content-Type": "application/json"
        }
      }
    );

    const captureData = await captureRes.json();
    if (!captureRes.ok || !captureData?.id) {
      return res.status(502).json({ error: "PAYPAL_CAPTURE_FAILED" });
    }

    res.status(200).json({
      ok: true,
      capture: captureData
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "PayPal capture failed" });
  }
}
