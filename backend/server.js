import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: userMessage,  
      config: {
        systemInstruction: `
You are MaaMind, a warm, empathetic AI companion designed to support pregnant women and new mothers.

Your tone:
- Kind, gentle, and emotionally supportive
- Non-judgmental and comforting
- Like a caring friend, not a doctor

Your behavior:
- Understand the user’s emotional state (stress, sadness, anxiety, happiness)
- Respond with empathy first, then gentle guidance
- Keep responses short (2 to 4 lines)
- Use simple, soothing language

Guidelines:
- DO NOT give strict medical advice or diagnosis
- DO NOT sound robotic or overly technical
- DO NOT dismiss feelings

Instead:
- Validate emotions (“That sounds really tough…”)
- Reassure (“You are not alone in feeling this way”)
- Offer light suggestions (rest, breathing, talking to someone)

If user is:
- Stressed → calm and reassure
- Sad → show empathy and support
- Anxious → gently ground them
- Happy → celebrate with them

End responses with warmth when appropriate (💛 optional but not overused)`,
      },
    });
    res.json({ reply: response.text });
  } catch (err) {
    console.error("ERROR:", err);
    res.status(500).json({ reply: "Something went wrong. Please try again." });
  }
});
app.post("/grandma-wisdom", async (req, res) => {
  const { region, stage, category, count = 6 } = req.body;

  const prompt = `You are an expert in Indian traditional maternal and childcare practices with deep knowledge of Ayurveda, regional folk medicine, and modern biomedical research.

Generate ${count} authentic traditional wellness tips for mothers. Be HIGHLY SPECIFIC to the region, not generic Pan-India advice.

Parameters:
- Region: ${region}
- Motherhood Stage: ${stage}  
- Category: ${category}

For each tip, respond ONLY with a valid JSON array. No markdown, no backticks, no preamble. Example format:
[
  {
    "title": "Specific practice name (include local language name if applicable)",
    "traditional": "Detailed description of the practice as elders would explain it, including local ingredients/methods, 2-3 sentences",
    "scientific": "Specific scientific explanation citing actual compounds, mechanisms, and peer-reviewed findings where possible, 2-3 sentences",
    "region": "${region}",
    "stage": "${stage}",
    "category": "${category}",
    "localName": "Name in local language/script if applicable",
    "caution": "Any safety note or contraindication if relevant, else empty string"
  }
]

Be extremely specific — mention actual plant/spice compounds (e.g. gingerol, thymol, diosgenin), cite mechanisms of action, and reference regional specificity (e.g. coastal Karnataka vs. Malnad belt practices differ). Avoid vague or generic claims.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are a precise medical anthropologist and ethnobotanist. Always respond with valid JSON only. Never include markdown formatting or backticks.",
      },
    });

    const raw = response.text.trim().replace(/```json|```/g, "").trim();
    const cards = JSON.parse(raw);
    res.json({ cards });
  } catch (err) {
    console.error("Grandma Wisdom Error:", err);
    res.status(500).json({ error: "Failed to generate wisdom tips." });
  }
});
app.listen(5000, () => console.log("Server running on port 5000"));