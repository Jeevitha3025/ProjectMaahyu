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

// Simple in-memory cache: key → cards
const cache: Record<string, WisdomCard[]> = {};

export const useGrandmaWisdom = () => {
  const [cards, setCards] = useState<WisdomCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWisdom = useCallback(async (params: FetchParams) => {
    const cacheKey = `${params.region}|${params.stage}|${params.category}`;

    if (cache[cacheKey]) {
      setCards(cache[cacheKey]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("http://localhost:5000/grandma-wisdom", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });

      const data = await res.json();

      if (data.error) throw new Error(data.error);

      const withIds: WisdomCard[] = data.cards.map(
        (c: WisdomCard, i: number) => ({
          ...c,
          id: `${cacheKey}-${i}`,
        })
      );

      cache[cacheKey] = withIds;
      setCards(withIds);
    } catch (err) {
      setError("Could not fetch wisdom tips. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  return { cards, loading, error, fetchWisdom };
};