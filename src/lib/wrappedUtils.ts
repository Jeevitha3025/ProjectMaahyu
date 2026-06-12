// ─── MaaWrapped: pure data utilities ─────────────────────────────────────────
export interface MoodEntry {
  date: string; // "YYYY-MM-DD"
  moods: string[];
  note?: string;
}

export interface MoodMeta {
  emoji: string;
  label: string;
  score: number;
  bucket: "joy" | "calm" | "stress" | "low";
  colorVar: string;
}

export const MOOD_META: MoodMeta[] = [
  { emoji: "😊", label: "Happy",      score: 2,    bucket: "joy",   colorVar: "mood-happy"   },
  { emoji: "🥰", label: "Loved",      score: 2,    bucket: "joy",   colorVar: "primary"      },
  { emoji: "😌", label: "Calm",       score: 1,    bucket: "calm",  colorVar: "mood-calm"    },
  { emoji: "😴", label: "Tired",      score: -1,   bucket: "low",   colorVar: "mood-tired"   },
  { emoji: "😰", label: "Anxious",    score: -1.5, bucket: "stress",colorVar: "mood-anxious" },
  { emoji: "😠", label: "Frustrated", score: -2,   bucket: "stress",colorVar: "mood-angry"   },
  { emoji: "😔", label: "Sad",        score: -2,   bucket: "low",   colorVar: "mood-sad"     },
];

export const MOOD_MAP: Record<string, MoodMeta> = MOOD_META.reduce((acc, m) => {
  acc[m.emoji] = m;
  return acc;
}, {} as Record<string, MoodMeta>);

export type WrappedPeriod = "weekly" | "monthly";

export interface DateRange {
  start: Date;
  end: Date;
}

export const formatDateStr = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const startOfDay = (d: Date) => {
  const c = new Date(d);
  c.setHours(0, 0, 0, 0);
  return c;
};

export const getWeekRange = (ref: Date): DateRange => {
  const start = startOfDay(ref);
  start.setDate(start.getDate() - start.getDay());
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  return { start, end };
};

export const getMonthRange = (ref: Date): DateRange => {
  const start = new Date(ref.getFullYear(), ref.getMonth(), 1);
  const end = new Date(ref.getFullYear(), ref.getMonth() + 1, 0);
  return { start: startOfDay(start), end: startOfDay(end) };
};

export const formatRangeLabel = (range: DateRange) => {
  const opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
  const startStr = range.start.toLocaleDateString("en-US", opts);
  const endStr = range.end.toLocaleDateString("en-US", { ...opts, year: "numeric" });
  return `${startStr} – ${endStr}`;
};

export const shiftRange = (range: DateRange, period: WrappedPeriod, dir: 1 | -1): DateRange => {
  if (period === "weekly") {
    const start = new Date(range.start);
    start.setDate(start.getDate() + dir * 7);
    return getWeekRange(start);
  }
  const start = new Date(range.start);
  start.setMonth(start.getMonth() + dir);
  return getMonthRange(start);
};

export const filterEntriesInRange = (entries: MoodEntry[], range: DateRange) => {
  const startStr = formatDateStr(range.start);
  const endStr = formatDateStr(range.end);
  return entries.filter((e) => e.date >= startStr && e.date <= endStr);
};

export interface DonutSlice {
  bucket: "joy" | "calm" | "stress" | "low";
  label: string;
  value: number;
  colorVar: string;
}

export interface WrappedStats {
  range: DateRange;
  rangeLabel: string;
  entries: MoodEntry[];
  daysPossible: number;
  daysLogged: number;
  consistencyPct: number;
  streak: number;
  happiestDay: { date: string; dayName: string; score: number; moods: string[] } | null;
  toughestDay: { date: string; dayName: string; score: number; moods: string[] } | null;
  topMood: MoodMeta | null;
  topMoodCount: number;
  moodDiversity: number;
  moodCounts: Record<string, number>;
  donut: DonutSlice[];
  journalCount: number;
  totalWords: number;
  longestNote: { date: string; note: string } | null;
  hasData: boolean;
}

const BUCKET_META: Record<string, { label: string; colorVar: string }> = {
  joy:    { label: "Joyful & Loving", colorVar: "mood-happy" },
  calm:   { label: "Mostly Calm",     colorVar: "mood-calm"  },
  stress: { label: "Some Stress",     colorVar: "mood-angry" },
  low:    { label: "Low Energy",      colorVar: "mood-tired" },
};

export const computeWrappedStats = (allEntries: MoodEntry[], range: DateRange): WrappedStats => {
  const entries = filterEntriesInRange(allEntries, range);
  const today = startOfDay(new Date());
  const effectiveEnd = range.end > today ? today : range.end;
  const daysPossible = Math.max(
    0,
    Math.floor((effectiveEnd.getTime() - range.start.getTime()) / 86400000) + 1
  );
  const daysLogged = entries.length;
  const consistencyPct = daysPossible > 0 ? Math.round((daysLogged / daysPossible) * 100) : 0;

  const dayScores = entries.map((e) => {
    const scores = e.moods.map((m) => MOOD_MAP[m]?.score ?? 0);
    const avg = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
    const d = new Date(e.date + "T00:00");
    return { date: e.date, dayName: d.toLocaleDateString("en-US", { weekday: "long" }), score: avg, moods: e.moods };
  });

  const happiestDay = dayScores.length
    ? dayScores.reduce((a, b) => (b.score > a.score ? b : a))
    : null;
  const toughestDay = dayScores.length
    ? dayScores.reduce((a, b) => (b.score < a.score ? b : a))
    : null;

  const moodCounts: Record<string, number> = {};
  entries.forEach((e) => e.moods.forEach((m) => {
    moodCounts[m] = (moodCounts[m] || 0) + 1;
  }));
  const moodEntriesSorted = Object.entries(moodCounts).sort((a, b) => b[1] - a[1]);
  const topMoodEmoji = moodEntriesSorted[0]?.[0] ?? null;
  const topMood = topMoodEmoji ? MOOD_MAP[topMoodEmoji] ?? null : null;
  const topMoodCount = moodEntriesSorted[0]?.[1] ?? 0;
  const moodDiversity = Object.keys(moodCounts).length;

  const bucketCounts: Record<string, number> = { joy: 0, calm: 0, stress: 0, low: 0 };
  let totalMoods = 0;
  Object.entries(moodCounts).forEach(([emoji, count]) => {
    const bucket = MOOD_MAP[emoji]?.bucket;
    if (bucket) {
      bucketCounts[bucket] += count;
      totalMoods += count;
    }
  });
  const donut: DonutSlice[] = (["joy", "calm", "stress", "low"] as const)
    .map((bucket) => ({
      bucket,
      label: BUCKET_META[bucket].label,
      value: totalMoods > 0 ? Math.round((bucketCounts[bucket] / totalMoods) * 100) : 0,
      colorVar: BUCKET_META[bucket].colorVar,
    }))
    .filter((s) => s.value > 0);

  const sortedDates = [...new Set(entries.map((e) => e.date))].sort();
  let streak = 0;
  if (sortedDates.length) {
    streak = 1;
    for (let i = sortedDates.length - 1; i > 0; i--) {
      const cur = new Date(sortedDates[i] + "T00:00");
      const prev = new Date(sortedDates[i - 1] + "T00:00");
      const diff = Math.round((cur.getTime() - prev.getTime()) / 86400000);
      if (diff === 1) streak++;
      else break;
    }
  }

  const withNotes = entries.filter((e) => e.note && e.note.trim().length > 0);
  const journalCount = withNotes.length;
  const totalWords = withNotes.reduce((sum, e) => sum + (e.note?.trim().split(/\s+/).length ?? 0), 0);
  const longestNote = withNotes.length
    ? withNotes.reduce((a, b) => ((b.note?.length ?? 0) > (a.note?.length ?? 0) ? b : a))
    : null;

  return {
    range,
    rangeLabel: formatRangeLabel(range),
    entries,
    daysPossible,
    daysLogged,
    consistencyPct,
    streak,
    happiestDay,
    toughestDay,
    topMood,
    topMoodCount,
    moodDiversity,
    moodCounts,
    donut,
    journalCount,
    totalWords,
    longestNote: longestNote ? { date: longestNote.date, note: longestNote.note! } : null,
    hasData: entries.length > 0,
  };
};

export interface Suggestion {
  icon: "wind" | "droplet" | "pen" | "moon" | "sun" | "heart";
  label: string;
}

export const getSuggestions = (stats: WrappedStats): Suggestion[] => {
  const suggestions: Suggestion[] = [];
  const bucketPct = (b: string) => stats.donut.find((d) => d.bucket === b)?.value ?? 0;

  if (bucketPct("stress") >= 25) {
    suggestions.push({ icon: "wind", label: "Take 5 deep breaths" });
  }
  if (bucketPct("low") >= 25) {
    suggestions.push({ icon: "moon", label: "Protect an early bedtime tonight" });
  }
  if (stats.journalCount === 0) {
    suggestions.push({ icon: "pen", label: "Write 1 gratitude note" });
  }
  if (bucketPct("joy") >= 40) {
    suggestions.push({ icon: "heart", label: "Savor what's working — note it down" });
  }
  if (suggestions.length < 3) {
    suggestions.push({ icon: "droplet", label: "Drink a warm glass of water" });
  }
  if (suggestions.length < 3) {
    suggestions.push({ icon: "sun", label: "Step outside for 10 minutes" });
  }
  return suggestions.slice(0, 3);
};

export const MIN_ENTRIES_FOR_MONTHLY = 10;