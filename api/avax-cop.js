import fetch from "node-fetch";

export default async function handler(req, res) {
  const apiKey = process.env.CMC_API_KEY;
  const url =
    "https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=AVAX&convert=COP";
  const response = await fetch(url, {
    headers: {
      "X-CMC_PRO_API_KEY": apiKey,
      Accept: "application/json",
    },
  });
  const data = await response.json();
  const price = data?.data?.AVAX?.quote?.COP?.price ?? null;
  res.status(200).json({ price });
}
