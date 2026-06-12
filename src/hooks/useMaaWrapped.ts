import { useState, useEffect, useMemo } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase";
import { useAuth } from "@/context/AuthContext";
import {
  MoodEntry,
  WrappedPeriod,
  DateRange,
  getWeekRange,
  getMonthRange,
  shiftRange,
  computeWrappedStats,
  WrappedStats,
} from "@/lib/wrappedUtils";

export const useMaaWrapped = (period: WrappedPeriod) => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState<DateRange>(() =>
    period === "weekly" ? getWeekRange(new Date()) : getMonthRange(new Date())
  );

  useEffect(() => {
    setRange(period === "weekly" ? getWeekRange(new Date()) : getMonthRange(new Date()));
  }, [period]);

  useEffect(() => {
    if (!user) return;
    let active = true;
    setLoading(true);
    (async () => {
      try {
        const snap = await getDocs(collection(db, "users", user.uid, "moodEntries"));
        if (!active) return;
        setEntries(snap.docs.map((d) => d.data() as MoodEntry));
      } catch (err) {
        console.error("MaaWrapped: failed to load mood entries", err);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [user]);

  const stats = useMemo<WrappedStats>(() => computeWrappedStats(entries, range), [entries, range]);

  const goPrev = () => setRange((r) => shiftRange(r, period, -1));
  const goNext = () => setRange((r) => shiftRange(r, period, 1));

  const isCurrent = useMemo(() => {
    const now = period === "weekly" ? getWeekRange(new Date()) : getMonthRange(new Date());
    return now.start.getTime() === range.start.getTime();
  }, [range, period]);

  return { entries, stats, loading, range, goPrev, goNext, isCurrent };
};