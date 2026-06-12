// ─── Imports (order matters!) ─────────────────────────────────────────────────
import dotenv from "dotenv";
dotenv.config(); // ← must be FIRST so process.env is ready

import express from "express";
import cors from "cors";
import { GoogleGenAI } from "@google/genai";
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import serviceAccount from "./serviceAccountKey.json" with { type: "json" };

// ─── Firebase Admin init ──────────────────────────────────────────────────────
initializeApp({ credential: cert(serviceAccount) });
const adminDb = getFirestore();

// ─── Express setup ────────────────────────────────────────────────────────────
const app = express();
app.use(cors());
app.use(express.json());

// ─── Gemini AI ────────────────────────────────────────────────────────────────
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// ─── Flag keyword lists ───────────────────────────────────────────────────────
const HIGH_SEVERITY_KEYWORDS = [
  "kill myself", "end my life", "want to die", "suicide", "hurt myself",
  "can't go on", "dont want to live", "don't want to live", "harm myself",
  "self harm", "self-harm", "not worth living", "better off dead",
  "end it all", "no reason to live",
];

const MEDIUM_SEVERITY_KEYWORDS = [
  "hopeless", "worthless", "nobody cares", "give up", "can't cope",
  "cant cope", "falling apart", "hate myself", "no point", "disappear",
  "exhausted and broken", "can't do this anymore", "cant do this anymore",
  "feel empty", "nothing matters", "so alone", "completely alone",
];

function detectFlags(message) {
  const lower = message.toLowerCase();
  const highHits   = HIGH_SEVERITY_KEYWORDS.filter((k) => lower.includes(k));
  const mediumHits = MEDIUM_SEVERITY_KEYWORDS.filter((k) => lower.includes(k));

  if (highHits.length > 0) {
    return { flagged: true, severity: "high",   keywords: highHits };
  }
  if (mediumHits.length > 0) {
    return { flagged: true, severity: "medium", keywords: mediumHits };
  }
  return { flagged: false };
}

// ─── POST /chat ───────────────────────────────────────────────────────────────
app.post("/chat", async (req, res) => {
  const {
    message,
    uid,
    userName,
    userEmail,
    emergencyContact,
    emergencyPhone,
  } = req.body;

  // ── Flag detection — runs before AI, writes to Firestore if triggered ──────
  const flagResult = detectFlags(message);
  if (flagResult.flagged) {
    try {
      await adminDb.collection("flags").add({
        uid:              uid              || "unknown",
        userName:         userName         || "Unknown User",
        userEmail:        userEmail        || "Unknown",
        emergencyContact: emergencyContact || "Not provided",
        emergencyPhone:   emergencyPhone   || "Not provided",
        triggerMessage:   message,
        keywords:         flagResult.keywords,
        severity:         flagResult.severity,
        resolved:         false,
        createdAt:        new Date(),
      });
      console.log(`🚩 Flag saved — severity: ${flagResult.severity} | user: ${userEmail}`);
    } catch (flagErr) {
      // Don't block the chat response if flag write fails
      console.error("Failed to save flag:", flagErr);
    }
  }

  // ── Send message to Gemini regardless ────────────────────────────────────
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: message,
      config: {
        systemInstruction: `
You are MaaMind, a warm, empathetic AI companion designed to support pregnant women and new mothers.

Your tone:
- Kind, gentle, and emotionally supportive
- Non-judgmental and comforting
- Like a caring friend, not a doctor

Your behavior:
- Understand the user's emotional state (stress, sadness, anxiety, happiness)
- Respond with empathy first, then gentle guidance
- Keep responses short (2 to 4 lines)
- Use simple, soothing language

Guidelines:
- DO NOT give strict medical advice or diagnosis
- DO NOT sound robotic or overly technical
- DO NOT dismiss feelings

Instead:
- Validate emotions ("That sounds really tough…")
- Reassure ("You are not alone in feeling this way")
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
    console.error("Chat ERROR:", err);
    res.status(500).json({ reply: "Something went wrong. Please try again." });
  }
});

// ─── POST /grandma-wisdom ─────────────────────────────────────────────────────
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
        systemInstruction:
          "You are a precise medical anthropologist and ethnobotanist. Always respond with valid JSON only. Never include markdown formatting or backticks.",
      },
    });

    const raw   = response.text.trim().replace(/```json|```/g, "").trim();
    const cards = JSON.parse(raw);
    res.json({ cards });
  } catch (err) {
    console.error("Grandma Wisdom Error:", err);
    res.status(500).json({ error: "Failed to generate wisdom tips." });
  }
});

// ─── Start server ─────────────────────────────────────────────────────────────
app.listen(5000, () => console.log("✅ Server running on port 5000"));