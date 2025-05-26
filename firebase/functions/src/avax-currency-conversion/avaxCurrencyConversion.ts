import { onRequest } from "firebase-functions/v2/https";
import fetch from "node-fetch";

export const avaxCurrencyConversion = onRequest(async (req, res) => {
  try {
    const apiKey = process.env.CMC_API_KEY;

    const baseUrl = process.env.CONVERSION_BASE_URL;

    if (!apiKey) {
      res.status(500).json({ error: "API Key not configured" });
      return;
    }

    if (!baseUrl) {
      res.status(500).json({ error: "Base URL not configured" });
      return;
    }
  
    const response = await fetch(baseUrl, {
      headers: {
        "X-CMC_PRO_API_KEY": apiKey,
        Accept: "application/json",
      },
    });
    if (!response.ok) {
      res.status(response.status).json({ error: "Failed to fetch from CoinMarketCap" });
      return;
    }
    const data = await response.json();
    const price = data?.data?.AVAX?.quote?.COP?.price ?? null;
    res.json({ price });
  } catch (err: any) {
    res.status(500).json({ error: "Internal server error", details: err.message });
  }
}); 