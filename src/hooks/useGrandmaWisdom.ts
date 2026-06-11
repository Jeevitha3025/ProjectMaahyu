import { useState, useCallback } from "react";

export interface WisdomCard {
  id: string;
  title: string;
  traditional: string;
  scientific: string;
  region: string;
  stage: string;
  category: string;
  localName?: string;
  caution?: string;
}

interface FetchParams {
  region: string;
  stage: string;
  category: string;
  count?: number;
}

const cache: Record<string, WisdomCard[]> = {};

export const useGrandmaWisdom = () => {
  const [cards, setCards] = useState<WisdomCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWisdom = useCallback(async (params: FetchParams) => {
    const { region, stage, category, count = 6 } = params;
    const cacheKey = `${region}|${stage}|${category}`;

    if (cache[cacheKey]) {
      setCards(cache[cacheKey]);
      return;
    }

    setLoading(true);
    setError(null);

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      setError("Gemini API key not configured.");
      setLoading(false);
      return;
    }

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

Be extremely specific — mention actual plant/spice compounds (e.g. gingerol, thymol, diosgenin), cite mechanisms of action, and reference regional specificity. Avoid vague or generic claims.`;

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            systemInstruction: {
              parts: [{ text: "You are a precise medical anthropologist and ethnobotanist. Always respond with valid JSON only. Never include markdown formatting or backticks." }],
            },
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.7 },
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        const msg = data?.error?.message ?? `API error ${res.status}`;
        throw new Error(msg);
      }

      const raw = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
      if (!raw) throw new Error("Empty response from Gemini");

      const clean = raw.trim().replace(/```json|```/g, "").trim();
      const parsed: WisdomCard[] = JSON.parse(clean);

      // ✅ THIS PART WAS MISSING — saves to cache and updates state
      const withIds = parsed.map((c, i) => ({ ...c, id: `${cacheKey}-${i}` }));
      cache[cacheKey] = withIds;
      setCards(withIds);

    } catch (err: any) {
      if (err.message?.includes("429") || err.message?.includes("depleted")) {
        setError("API quota reached — please try again later.");
      } else {
        setError("Could not fetch wisdom tips. Please try again.");
      }
      console.error(err);
    } finally {
      setLoading(false); // ✅ THIS WAS ALSO MISSING
    }
  }, []);

  return { cards, loading, error, fetchWisdom };
};