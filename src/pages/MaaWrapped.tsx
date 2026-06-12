import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Sparkles, Wind, Droplets, PenLine, Moon, Sun, Heart, Flame, BookOpen, Star, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import { useAuth } from "@/context/AuthContext";
import { useMaaWrapped } from "@/hooks/useMaaWrapped";
import { useWrappedReflection } from "@/hooks/useWrappedReflection";
import { getSuggestions, MIN_ENTRIES_FOR_MONTHLY, WrappedPeriod } from "@/lib/wrappedUtils";

// ─── Icon map for suggestions ─────────────────────────────────────────────────
const SUGGESTION_ICONS = {
  wind:    Wind,
  droplet: Droplets,
  pen:     PenLine,
  moon:    Moon,
  sun:     Sun,
  heart:   Heart,
};

// ─── Donut SVG ────────────────────────────────────────────────────────────────
const DonutChart = ({ slices }: { slices: { value: number; colorVar: string; label: string }[] }) => {
  const SIZE = 140;
  const STROKE = 22;
  const R = (SIZE - STROKE) / 2;
  const C = SIZE / 2;
  const CIRCUMFERENCE = 2 * Math.PI * R;

  let offset = 0;
  const paths = slices.map((s, i) => {
    const dash = (s.value / 100) * CIRCUMFERENCE;
    const gap = CIRCUMFERENCE - dash;
    const el = (
      <circle
        key={i}
        cx={C}
        cy={C}
        r={R}
        fill="none"
        stroke={`hsl(var(--${s.colorVar}))`}
        strokeWidth={STROKE}
        strokeDasharray={`${dash} ${gap}`}
        strokeDashoffset={-offset}
        strokeLinecap="round"
        style={{ transition: "stroke-dasharray 0.6s ease" }}
      />
    );
    offset += dash;
    return el;
  });

  return (
    <svg width={SIZE} height={SIZE} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={C} cy={C} r={R} fill="none" stroke="hsl(var(--muted))" strokeWidth={STROKE} />
      {paths}
    </svg>
  );
};

// ─── Stat card ────────────────────────────────────────────────────────────────
const StatCard = ({ icon: Icon, label, value, sub, color }: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub?: string;
  color: string;
}) => (
  <div className="card-glow p-4 flex flex-col gap-2">
    <div className={`w-9 h-9 rounded-lg ${color} flex items-center justify-center`}>
      <Icon className="w-5 h-5" />
    </div>
    <p className="text-xs text-muted-foreground">{label}</p>
    <p className="font-display font-bold text-2xl leading-tight">{value}</p>
    {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
  </div>
);

// ─── Main page ────────────────────────────────────────────────────────────────
const MaaWrapped = () => {
  const { userProfile } = useAuth();
  const [period, setPeriod] = useState<WrappedPeriod>("weekly");

  const { stats, loading, range, goPrev, goNext, isCurrent } = useMaaWrapped(period);
  const { reflection, loading: reflLoading, fetchReflection } = useWrappedReflection();

  const firstName = userProfile?.name?.split(" ")[0] || "Mama";
  const suggestions = getSuggestions(stats);

  // Fetch AI reflection whenever stats change and has data
  useEffect(() => {
    if (!loading && stats.hasData) {
      fetchReflection(stats, firstName);
    }
  }, [stats, loading]);

  const notEnoughForMonthly = period === "monthly" && stats.daysLogged < MIN_ENTRIES_FOR_MONTHLY;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 pt-24 pb-16 max-w-2xl">

        {/* ── Header ── */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/20 text-gold text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            <span>MaaWrapped</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold mb-2">
            Your emotional journey, {firstName} 🌸
          </h1>
          <p className="text-muted-foreground">A gentle look at how you've been feeling</p>
        </div>

        {/* ── Period toggle ── */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {(["weekly", "monthly"] as WrappedPeriod[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                period === p
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-muted text-muted-foreground hover:bg-muted/70"
              }`}
            >
              {p === "weekly" ? "This Week" : "This Month"}
            </button>
          ))}
        </div>

        {/* ── Range navigator ── */}
        <div className="flex items-center justify-between mb-8 px-1">
          <button
            onClick={goPrev}
            className="p-2 rounded-full hover:bg-muted transition-colors"
            aria-label="Previous period"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="text-center">
            <p className="font-medium text-sm">{stats.rangeLabel}</p>
            {isCurrent && (
              <span className="text-xs text-primary font-medium">Current period</span>
            )}
          </div>
          <button
            onClick={goNext}
            disabled={isCurrent}
            className="p-2 rounded-full hover:bg-muted transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Next period"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* ── Loading ── */}
        {loading && (
          <div className="text-center py-16">
            <div className="text-4xl mb-4 animate-bounce">🌸</div>
            <p className="text-muted-foreground text-sm">Gathering your journey...</p>
          </div>
        )}

        {/* ── No data ── */}
        {!loading && !stats.hasData && (
          <div className="card-elevated p-8 text-center">
            <div className="text-5xl mb-4">🌱</div>
            <h2 className="font-display font-bold text-xl mb-2">Nothing here yet</h2>
            <p className="text-muted-foreground mb-6">
              Start logging your moods on the Feelings Diary and your MaaWrapped will bloom here.
            </p>
            <a href="/mood-calendar">
              <Button className="rounded-full">Start Logging</Button>
            </a>
          </div>
        )}

        {/* ── Not enough for monthly ── */}
        {!loading && stats.hasData && notEnoughForMonthly && (
          <div className="card-elevated p-6 text-center mb-6">
            <div className="text-3xl mb-3">📅</div>
            <p className="text-muted-foreground text-sm">
              Log at least {MIN_ENTRIES_FOR_MONTHLY} days this month to unlock your Monthly Wrapped.
              You've logged <strong>{stats.daysLogged}</strong> so far — keep going!
            </p>
          </div>
        )}

        {/* ── Main content ── */}
        {!loading && stats.hasData && !notEnoughForMonthly && (
          <div className="space-y-6">

            {/* AI Reflection card */}
            <div
              className="relative rounded-3xl p-6 overflow-hidden"
              style={{
                background: "linear-gradient(135deg, hsl(var(--primary)/0.12) 0%, hsl(var(--secondary)/0.15) 100%)",
                border: "1px solid hsl(var(--primary)/0.2)",
              }}
            >
              <div className="absolute top-4 right-4 opacity-20">
                <Sparkles className="w-16 h-16 text-primary" />
              </div>

              {reflLoading ? (
                <div className="flex items-center gap-3 text-muted-foreground text-sm">
                  <div className="w-4 h-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                  Crafting your reflection...
                </div>
              ) : reflection ? (
                <>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/15 text-primary text-xs font-medium mb-4">
                    <Star className="w-3 h-3" />
                    {reflection.theme}
                  </div>
                  <p className="text-foreground leading-relaxed mb-4">{reflection.reflection}</p>
                  <p className="text-primary font-semibold italic text-sm">"{reflection.affirmation}"</p>
                </>
              ) : null}
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-4">
              <StatCard
                icon={Calendar}
                label="Days logged"
                value={`${stats.daysLogged} / ${stats.daysPossible}`}
                sub={`${stats.consistencyPct}% consistency`}
                color="bg-primary/20 text-primary"
              />
              <StatCard
                icon={Flame}
                label="Check-in streak"
                value={`${stats.streak} day${stats.streak !== 1 ? "s" : ""}`}
                sub={stats.streak >= 3 ? "On a roll! 🔥" : "Keep going 💪"}
                color="bg-mood-happy/20 text-mood-happy"
              />
              {stats.topMood && (
                <StatCard
                  icon={() => <span className="text-lg">{stats.topMood!.emoji}</span>}
                  label="Most felt"
                  value={stats.topMood.label}
                  sub={`${stats.topMoodCount} time${stats.topMoodCount !== 1 ? "s" : ""}`}
                  color="bg-secondary/20 text-secondary"
                />
              )}
              <StatCard
                icon={BookOpen}
                label="Journal notes"
                value={stats.journalCount}
                sub={stats.totalWords > 0 ? `${stats.totalWords} words total` : "Try writing one!"}
                color="bg-sage/20 text-sage"
              />
            </div>

            {/* Emotional mix donut */}
            {stats.donut.length > 0 && (
              <div className="card-elevated p-6">
                <h3 className="font-display font-bold text-lg mb-5">Your emotional mix</h3>
                <div className="flex items-center gap-6">
                  <div className="flex-shrink-0">
                    <DonutChart slices={stats.donut} />
                  </div>
                  <div className="flex flex-col gap-2 flex-1">
                    {stats.donut.map((s) => (
                      <div key={s.bucket} className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{ backgroundColor: `hsl(var(--${s.colorVar}))` }}
                        />
                        <span className="text-sm text-muted-foreground flex-1">{s.label}</span>
                        <span className="text-sm font-semibold">{s.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Happiest / toughest day */}
            {(stats.happiestDay || stats.toughestDay) && (
              <div className="grid grid-cols-2 gap-4">
                {stats.happiestDay && (
                  <div className="card-glow p-4 text-center">
                    <div className="text-3xl mb-2">☀️</div>
                    <p className="text-xs text-muted-foreground mb-1">Happiest day</p>
                    <p className="font-display font-bold">{stats.happiestDay.dayName}</p>
                    <div className="flex justify-center gap-1 mt-2">
                      {stats.happiestDay.moods.map((m, i) => (
                        <span key={i} className="text-lg">{m}</span>
                      ))}
                    </div>
                  </div>
                )}
                {stats.toughestDay && (
                  <div className="card-glow p-4 text-center">
                    <div className="text-3xl mb-2">🌙</div>
                    <p className="text-xs text-muted-foreground mb-1">Toughest day</p>
                    <p className="font-display font-bold">{stats.toughestDay.dayName}</p>
                    <div className="flex justify-center gap-1 mt-2">
                      {stats.toughestDay.moods.map((m, i) => (
                        <span key={i} className="text-lg">{m}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Suggestions for next week */}
            <div className="card-elevated p-6">
              <h3 className="font-display font-bold text-lg mb-4">
                Gentle suggestions for the week ahead 🌿
              </h3>
              <div className="flex flex-col gap-3">
                {suggestions.map((s, i) => {
                  const Icon = SUGGESTION_ICONS[s.icon];
                  return (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-3 rounded-xl bg-muted/50"
                    >
                      <div className="w-8 h-8 rounded-lg bg-primary/15 text-primary flex items-center justify-center flex-shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-sm">{s.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Longest note snippet */}
            {stats.longestNote && (
              <div
                className="rounded-2xl p-5"
                style={{
                  background: "hsl(var(--secondary)/0.1)",
                  border: "1px solid hsl(var(--secondary)/0.2)",
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen className="w-4 h-4 text-secondary" />
                  <p className="text-sm font-medium text-secondary">Your most heartfelt note</p>
                  <span className="ml-auto text-xs text-muted-foreground">{stats.longestNote.date}</span>
                </div>
                <p className="text-sm text-muted-foreground italic leading-relaxed line-clamp-4">
                  "{stats.longestNote.note}"
                </p>
              </div>
            )}

          </div>
        )}
      </main>
    </div>
  );
};

export default MaaWrapped;