import express from "express";
import fetch from "node-fetch";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const apiKey = process.env.CMC_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "API Key not configured" });
    }
    const url =
      "https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=AVAX&convert=COP";
    const response = await fetch(url, {
      headers: {
        "X-CMC_PRO_API_KEY": apiKey,
        Accept: "application/json",
      },
    });
    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: "Failed to fetch from CoinMarketCap" });
    }
    const data = await response.json();
    // Solo devolvemos el precio relevante para el frontend
    const price = data?.data?.AVAX?.quote?.COP?.price ?? null;
    res.json({ price });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal server error", details: err.message });
  }
});

export default router;
