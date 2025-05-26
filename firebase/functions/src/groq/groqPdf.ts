import { onRequest } from "firebase-functions/v2/https";
import fetch from "node-fetch";

export const groqPdf = onRequest(async (req, res) => {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      res.status(500).json({ error: "GROQ API Key not configured" });
      return;
    }
    const { topic, category } = req.body;
    if (!topic || !category) {
      res.status(400).json({ error: "Missing topic or category" });
      return;
    }
    const prompt = `\nEres un experto en educación. El nombre del estudiante que vamos a motivar y a explicarle el tema es \\u201cJonathan Alejandro\\u201d. Explica el tema \"${topic}\" de la categoría \"${category}\" de forma totalmente práctica, sencilla y digerible para cualquier persona. Evita teoría confusa, usa ejemplos de la vida real, analogías y pasos prácticos. Intenta que sea de la forma más motivadora posible para un estudiante de bachillerato. El objetivo es que el usuario entienda el tema desde su raíz y sepa cómo aplicarlo en su vida diaria. Intenta no quedarte en la superficie del tema sino trata de más a fondo en el tema. Utiliza todo lo que puedas el nombre del estudiante, si encuentras oportunidad de usar videojuegos, historietas o personajes famosos con su nombre hazlo (Ejemplo: Super Mario (si su nombre es Mario), Batman (si su nombre es Bruce), Max Stell (si su nombre es Max)) Haz importante al estudiante para que pueda digerir mucho más facil el tema. Por último, le vas a responder directamente al usuario (que no tiene ni idea qué dice este prompt) entonces no respondas con un \"Claro que sí\" ni nada de eso. Responde directamente lo que te estoy pidiendo. Ten en cuenta que si te proveo Nombres y Apellidos, solo escoge uno de sus nombres (el que más te parezca adecuado)`;

    const groqRes = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + apiKey,
        },
        body: JSON.stringify({
          model: "meta-llama/llama-4-scout-17b-16e-instruct",
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          max_tokens: 8192,
        }),
      }
    );

    const groqData = await groqRes.json();
    res.json(groqData);
    return;
  } catch (err: any) {
    res.status(500).json({ error: "Internal server error", details: err.message });
  }
}); 