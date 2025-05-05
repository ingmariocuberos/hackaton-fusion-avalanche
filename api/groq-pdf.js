import fetch from "node-fetch";
import PDFDocument from "pdfkit";
import { Readable } from "stream";

async function getGroqContent(prompt, maxTokens = 4096) {
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
        messages: [{ role: "user", content: prompt }],
        max_tokens: maxTokens,
      }),
    }
  );
  const groqData = await groqRes.json();
  return groqData.choices?.[0]?.message?.content || "";
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }
  try {
    const { topic, category } = req.body;
    if (!topic || !category) {
      res.status(400).json({ error: "Missing topic or category" });
      return;
    }
    let prompt = `Eres un experto en educación. Explica el tema "${topic}" de la categoría "${category}" de forma totalmente práctica, sencilla y digerible para cualquier persona. Evita teoría confusa, usa ejemplos de la vida real, analogías, ejercicios prácticos y casos de uso. El objetivo es que el usuario entienda el tema desde su raíz y sepa cómo aplicarlo en su vida diaria. Genera contenido extenso, sin repeticiones, suficiente para un documento de 10 páginas en PDF (al menos 21000 caracteres). Cada sección debe ser diferente y aportar valor práctico.`;
    let content = "";
    let totalChars = 0;
    const maxChars = 21000;
    const maxIterations = 10;
    let iteration = 0;
    let lastChunk = "";
    while (totalChars < maxChars && iteration < maxIterations) {
      let chunk = await getGroqContent(prompt);
      if (chunk.length < 4000) {
        prompt = `Expande mucho más el tema "${topic}" de la categoría "${category}". Agrega más ejemplos, ejercicios, analogías, casos prácticos y explicaciones sencillas. No repitas información anterior. Hazlo muy extenso y práctico.`;
        chunk = await getGroqContent(prompt);
      }
      if (lastChunk && chunk.startsWith(lastChunk.slice(-100))) {
        chunk = chunk.slice(100);
      }
      content += chunk + "\n";
      totalChars = content.length;
      prompt = `Continúa explicando el tema anterior de forma aún más práctica, con nuevos ejemplos, ejercicios, analogías y casos de uso. No repitas información. Hazlo extenso y fácil de entender.`;
      iteration++;
      lastChunk = chunk;
      if (chunk.length < 1000) break;
    }
    content = content.replace(/\n{3,}/g, "\n\n");
    const doc = new PDFDocument({ margin: 50 });
    let buffers = [];
    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => {
      const pdfData = Buffer.concat(buffers);
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${topic.replace(/\s+/g, "_")}.pdf"`
      );
      res.status(200).end(pdfData);
    });
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
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error interno al generar el PDF", details: err.message });
  }
}
