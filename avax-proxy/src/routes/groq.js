import express from "express";
import fetch from "node-fetch";
import PDFDocument from "pdfkit";
import stream from "stream";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { topic, category } = req.body;
    if (!topic || !category) {
      return res.status(400).json({ error: "Missing topic or category" });
    }

    // Construir el prompt práctico y digerible
    const prompt = `
Eres un experto en educación. Explica el tema "${topic}" de la categoría "${category}" de forma totalmente práctica, sencilla y digerible para cualquier persona. Evita teoría confusa, usa ejemplos de la vida real, analogías y pasos prácticos. El objetivo es que el usuario entienda el tema desde su raíz y sepa cómo aplicarlo en su vida diaria. Genera contenido suficiente para un documento de 10 páginas en PDF.
`;

    // Llamar a la API de Groq
    const groqRes = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Bearer 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",
        },
        body: JSON.stringify({
          model: "meta-llama/llama-4-scout-17b-16e-instruct",
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          max_tokens: 4096,
        }),
      }
    );

    if (!groqRes.ok) {
      return res.status(500).json({ error: "Error al consultar Groq" });
    }

    const groqData = await groqRes.json();
    const content =
      groqData.choices?.[0]?.message?.content ||
      "No se recibió contenido de Groq.";

    // Generar PDF
    const doc = new PDFDocument({ margin: 50 });
    const passThroughStream = new stream.PassThrough();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=\"${topic.replace(/\s+/g, "_")}.pdf\"`
    );
    doc.pipe(passThroughStream);

    // Dividir el contenido en páginas (aproximadamente)
    const lines = content.split("\n").filter(Boolean);
    let currentPage = 1;
    let linesPerPage = Math.ceil(lines.length / 10);
    let lineCount = 0;

    doc.fontSize(20).text(topic, { align: "center" });
    doc.moveDown();

    for (const line of lines) {
      if (lineCount > 0 && lineCount % linesPerPage === 0 && currentPage < 10) {
        doc.addPage();
        currentPage++;
      }
      doc.fontSize(12).text(line, { align: "left" });
      lineCount++;
    }

    doc.end();
    passThroughStream.pipe(res);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error interno al generar el PDF", details: err.message });
  }
});

export default router;
