import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import avaxRouter from "./routes/avax.js";
import groqRouter from "./routes/groq.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Permitir CORS solo desde tu frontend
app.use(
  cors({
    origin: "http://localhost:3000", // Cambia esto si tu frontend está en otro dominio
  })
);

app.use(express.json());

app.use("/api/avax-cop", avaxRouter);
app.use("/api/groq-pdf", groqRouter);

app.get("/", (req, res) => {
  res.send("AVAX Proxy API is running");
});

app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});
