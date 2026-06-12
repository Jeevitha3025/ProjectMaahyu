import { useState, useCallback } from "react";
import { WrappedStats } from "@/lib/wrappedUtils";

export interface WrappedReflection {
  theme: string;
  reflection: string;
  affirmation: string;
}

const cache: Record<string, WrappedReflection> = {};

const FALLBACK: WrappedReflection = {
  theme: "Quiet Resilience",
  reflection:
    "Every day you showed up for yourself and your little one, even on the harder days. That consistency is its own kind of strength — one that doesn't always feel loud, but adds up to something real.",
  affirmation: "You are doing better than you think, mama.",
};

export const useWrappedReflection = () => {
  const [reflection, setReflection] = useState<WrappedReflection | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReflection = useCallback(async (stats: WrappedStats, name?: string) => {
    if (!stats.hasData) {
      setReflection(null);
      return;
    }

    const cacheKey = `${stats.rangeLabel}-${stats.daysLogged}-${stats.topMood?.emoji}-${stats.streak}`;
    if (cache[cacheKey]) {
      setReflection(cache[cacheKey]);
      return;
    }

    setLoading(true);
    setError(null);

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      setReflection(FALLBACK);
      setLoading(false);
      return;
    }

    const donutSummary = stats.donut.map((d) => `${d.label}: ${d.value}%`).join(", ");

    const prompt = `You are MaaWrapped AI, a warm, gentle companion for a new or expecting mother using a maternal wellness app.

Based ONLY on this period's mood-tracking summary, write a short personalized reflection. Never mention numbers, scores, or "data". Speak directly to her, warmly, like a wise friend.

Summary:
- Period: ${stats.rangeLabel}
- Days she checked in: ${stats.daysLogged} out of ${stats.daysPossible}
- Current check-in streak: ${stats.streak} day(s)
- Most felt emotion: ${stats.topMood?.label ?? "a mix of feelings"}
- Emotional mix: ${donutSummary || "not enough data yet"}
- Happiest day: ${stats.happiestDay?.dayName ?? "n/a"}
- Most sensitive day: ${stats.toughestDay?.dayName ?? "n/a"}
- Journal entries written: ${stats.journalCount}
${name ? `- Her name: ${name}` : ""}

Respond ONLY with valid JSON, no markdown, no backticks, in this exact format:
{
  "theme": "A short 2-3 word poetic theme for her period (e.g. 'Quiet Resilience', 'Steady Growth')",
  "reflection": "2-4 warm sentences reflecting on her period, in second person ('you'). Acknowledge effort and care, never judgmental.",
  "affirmation": "One short, uplifting affirmation sentence."
}`;

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            systemInstruction: {
              parts: [
                {
                  text: "You are a warm, emotionally intelligent maternal wellness companion. Always respond with valid JSON only. Never include markdown formatting or backticks.",
                },
              ],
            },
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.8 },
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error?.message ?? `API error ${res.status}`);

      const raw = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
      if (!raw) throw new Error("Empty response from Gemini");

      const clean = raw.trim().replace(/```json|```/g, "").trim();
      const parsed: WrappedReflection = JSON.parse(clean);

      cache[cacheKey] = parsed;
      setReflection(parsed);
    } catch (err: any) {
      console.error("MaaWrapped reflection error:", err);
      if (err.message?.includes("429") || err.message?.includes("depleted")) {
        setError("API quota reached — showing a gentle default reflection instead.");
      } else {
        setError("Could not generate your personalized reflection.");
      }
      setReflection(FALLBACK);
    } finally {
      setLoading(false);
    }
  }, []);

  return { reflection, loading, error, fetchReflection };
};