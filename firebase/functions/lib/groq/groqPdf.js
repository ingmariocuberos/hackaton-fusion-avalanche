"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.groqPdf = void 0;
const https_1 = require("firebase-functions/v2/https");
const node_fetch_1 = __importDefault(require("node-fetch"));
exports.groqPdf = (0, https_1.onRequest)(async (req, res) => {
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
        const prompt = `\nEres un experto en educación. El nombre del estudiante que vamos a motivar y a explicarle el tema es \\u201cJonathan Alejandro\\u201d. Explica el tema \"${topic}\" de la categoría \"${category}\" de forma totalmente práctica, sencilla y digerible para cualquier persona. Evita teoría confusa, usa ejemplos de la vida real, analogías y pasos prácticos. Intenta que sea de la forma más motivadora posible para un estudiante de bachillerato. El objetivo es que el usuario entienda el tema desde su raíz y sepa cómo aplicarlo en su vida diaria. Intenta no quedarte en la superficie del tema sino trata de más a fondo en el tema. Utiliza todo lo que puedas el nombre del estudiante, si encuentras oportunidad de usar videojuegos, historietas o personajes famosos con su nombre hazlo (Ejemplo: Super Mario (si su nombre es Mario), Batman (si su nombre es Bruce), Max Stell (si su nombre es Max)) Haz importante al estudiante para que pueda digerir mucho más facil el tema. Por último, le vas a responder directamente al usuario (que no tiene ni idea qué dice este prompt) entonces no respondas con un \"Claro que sí\" ni nada de eso. Tampoco intentes generar actividades que continuen con la interacción, esta interacción será única para el usuario y no te va a responder. Responde directamente lo que te estoy pidiendo. Ten en cuenta que si te proveo Nombres y Apellidos, solo escoge uno de sus nombres (el que más te parezca adecuado)`;
        const groqRes = await (0, node_fetch_1.default)("https://api.groq.com/openai/v1/chat/completions", {
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
        });
        const groqData = await groqRes.json();
        if (groqData.choices[0].message.content) {
            res.json({ data: { pdfContent: groqData.choices[0].message.content } });
        }
        else {
            res.status(500).json({ error: "No se pudo generar el PDF" });
        }
        return;
    }
    catch (err) {
        res.status(500).json({ error: "Internal server error", details: err.message });
    }
});
//# sourceMappingURL=groqPdf.js.map