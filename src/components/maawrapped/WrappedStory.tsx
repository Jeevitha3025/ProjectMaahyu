import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
  X, Flame, Sparkles, BookOpen, Wind, Droplet, PenLine, Moon, Sun, Heart, ArrowRight, Quote,
} from "lucide-react";
import { WrappedStats, WrappedPeriod, getSuggestions } from "@/lib/wrappedUtils";
import { WrappedReflection } from "@/hooks/useWrappedReflection";
import MoodDonut from "./MoodDonut";

interface WrappedStoryProps {
  stats: WrappedStats;
  reflection: WrappedReflection | null;
  period: WrappedPeriod;
  userName?: string;
  onClose: () => void;
  onFinish: () => void;
}

const SUGGESTION_ICONS = { wind: Wind, droplet: Droplet, pen: PenLine, moon: Moon, sun: Sun, heart: Heart };

const GRADIENTS = [
  "from-coral/30 via-blush to-cream",
  "from-sage/40 via-cream to-background",
  "from-gold/30 via-blush to-cream",
  "from-lavender/40 via-blush to-cream",
  "from-coral/20 via-sage/20 to-cream",
  "from-blush via-cream to-background",
  "from-primary/20 via-blush to-cream",
  "from-lavender/30 via-cream to-background",
  "from-coral/30 via-gold/20 to-cream",
  "from-sage/30 via-blush to-cream",
  "from-coral/40 via-blush to-cream",
];

const periodWord = (period: WrappedPeriod) => (period === "weekly" ? "week" : "month");

const WrappedStory = ({ stats, reflection, period, userName, onClose, onFinish }: WrappedStoryProps) => {
  const [index, setIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const word = periodWord(period);
  const firstName = userName?.split(" ")[0] || "Mama";

  // ─── Build slides ────────────────────────────────────────────────────────
  type Slide = { content: JSX.Element };
  const slides: Slide[] = [];

  // 1. Intro
  slides.push({
    content: (
      <div className="flex flex-col items-center justify-center text-center h-full px-8">
        <Sparkles className="w-10 h-10 text-primary mb-4 animate-pulse-soft" />
        <h1 className="font-display font-bold text-4xl mb-3">Your MaaWrapped</h1>
        <p className="text-muted-foreground mb-1">A gentle look at your {word}</p>
        <p className="text-sm text-muted-foreground/70">{stats.rangeLabel}</p>
        <p className="mt-8 text-sm font-medium">Hi {firstName} 🌸</p>
      </div>
    ),
  });

  if (!stats.hasData) {
    // Empty state
    slides.push({
      content: (
        <div className="flex flex-col items-center justify-center text-center h-full px-8">
          <span className="text-5xl mb-4">🌱</span>
          <h2 className="font-display font-bold text-2xl mb-3">Nothing logged yet</h2>
          <p className="text-muted-foreground mb-6">
            Log a mood or two this {word} and your wrapped will start filling up with insights — just for you.
          </p>
          <Link
            to="/mood-calendar"
            onClick={onClose}
            className="btn-gradient inline-flex items-center gap-2"
          >
            Log my mood <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ),
    });
  } else {
    // 2. Consistency / streak
    slides.push({
      content: (
        <div className="flex flex-col items-center justify-center text-center h-full px-8">
          <Flame className="w-10 h-10 text-coral mb-4" />
          <p className="text-sm uppercase tracking-wide text-muted-foreground mb-2">Check-in Consistency</p>
          <h2 className="font-display font-bold text-5xl mb-3">
            {stats.daysLogged}/{stats.daysPossible}
          </h2>
          <p className="text-muted-foreground mb-4">days you showed up for yourself</p>
          {stats.streak > 1 && (
            <div className="rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              🔥 {stats.streak}-day streak
            </div>
          )}
        </div>
      ),
    });

    // 3. Happiest day
    if (stats.happiestDay) {
      slides.push({
        content: (
          <div className="flex flex-col items-center justify-center text-center h-full px-8">
            <span className="text-6xl mb-4">{stats.happiestDay.moods[0] ?? "😊"}</span>
            <p className="text-sm uppercase tracking-wide text-muted-foreground mb-2">Happiest Day</p>
            <h2 className="font-display font-bold text-4xl mb-3">{stats.happiestDay.dayName}</h2>
            <p className="text-muted-foreground">
              {stats.happiestDay.score > 0
                ? "A bright spot worth holding onto."
                : "Even your hardest days had a little light in them."}
            </p>
          </div>
        ),
      });
    }

    // 4. Toughest / most sensitive day
    if (stats.toughestDay) {
      slides.push({
        content: (
          <div className="flex flex-col items-center justify-center text-center h-full px-8">
            <span className="text-6xl mb-4">{stats.toughestDay.moods[0] ?? "🤍"}</span>
            <p className="text-sm uppercase tracking-wide text-muted-foreground mb-2">Most Sensitive Day</p>
            <h2 className="font-display font-bold text-4xl mb-3">{stats.toughestDay.dayName}</h2>
            <p className="text-muted-foreground max-w-xs mx-auto">
              It's okay — naming a hard day is the first step to caring for yourself through it. 💛
            </p>
          </div>
        ),
      });
    }

    // 5. Top mood
    if (stats.topMood) {
      slides.push({
        content: (
          <div className="flex flex-col items-center justify-center text-center h-full px-8">
            <span className="text-7xl mb-4">{stats.topMood.emoji}</span>
            <p className="text-sm uppercase tracking-wide text-muted-foreground mb-2">Most Felt Mood</p>
            <h2 className="font-display font-bold text-4xl mb-3">{stats.topMood.label}</h2>
            <p className="text-muted-foreground">
              Logged {stats.topMoodCount} time{stats.topMoodCount !== 1 ? "s" : ""} this {word}
            </p>
            {stats.moodDiversity > 1 && (
              <p className="text-xs text-muted-foreground/70 mt-2">
                You felt {stats.moodDiversity} different emotions — that's being human 🌸
              </p>
            )}
          </div>
        ),
      });
    }

    // 6. Mood mix donut
    if (stats.donut.length > 0) {
      slides.push({
        content: (
          <div className="flex flex-col items-center justify-center text-center h-full px-8">
            <p className="text-sm uppercase tracking-wide text-muted-foreground mb-4">Your Emotional Mix</p>
            <MoodDonut slices={stats.donut} centerLabel="🌿" />
            <div className="mt-6 space-y-2">
              {stats.donut.map((slice) => (
                <div key={slice.bucket} className="flex items-center gap-2 justify-center text-sm">
                  <span
                    className="w-3 h-3 rounded-full inline-block"
                    style={{ backgroundColor: `hsl(var(--${slice.colorVar}))` }}
                  />
                  <span>{slice.label}</span>
                  <span className="text-muted-foreground">{slice.value}%</span>
                </div>
              ))}
            </div>
          </div>
        ),
      });
    }

    // 7. Journal highlight
    if (stats.journalCount > 0) {
      slides.push({
        content: (
          <div className="flex flex-col items-center justify-center text-center h-full px-8">
            <BookOpen className="w-10 h-10 text-primary mb-4" />
            <p className="text-sm uppercase tracking-wide text-muted-foreground mb-2">Your Diary</p>
            <h2 className="font-display font-bold text-4xl mb-3">{stats.journalCount}</h2>
            <p className="text-muted-foreground mb-4">
              entr{stats.journalCount === 1 ? "y" : "ies"} written • {stats.totalWords} words
            </p>
            {stats.longestNote && (
              <div className="card-elevated p-4 max-w-xs italic text-sm text-muted-foreground">
                <Quote className="w-4 h-4 mb-2 text-primary" />
                "{stats.longestNote.note.slice(0, 120)}
                {stats.longestNote.note.length > 120 ? "…" : ""}"
              </div>
            )}
          </div>
        ),
      });
    }

    // 8. AI Reflection (theme + reflection)
    if (reflection) {
      slides.push({
        content: (
          <div className="flex flex-col items-center justify-center text-center h-full px-8">
            <Sparkles className="w-8 h-8 text-primary mb-3" />
            <p className="text-sm uppercase tracking-wide text-muted-foreground mb-2">Your Core Theme</p>
            <h2 className="font-display font-bold text-3xl mb-4">{reflection.theme}</h2>
            <p className="text-muted-foreground max-w-sm leading-relaxed">{reflection.reflection}</p>
          </div>
        ),
      });

      // 9. Affirmation
      slides.push({
        content: (
          <div className="flex flex-col items-center justify-center text-center h-full px-8">
            <Heart className="w-9 h-9 text-primary mb-4 animate-pulse-soft" />
            <p className="text-sm uppercase tracking-wide text-muted-foreground mb-4">Weekly Affirmation</p>
            <p className="font-display text-2xl leading-relaxed max-w-sm">"{reflection.affirmation}"</p>
          </div>
        ),
      });
    }

    // 10. Suggestions
    const suggestions = getSuggestions(stats);
    if (suggestions.length > 0) {
      slides.push({
        content: (
          <div className="flex flex-col items-center justify-center text-center h-full px-8">
            <p className="text-sm uppercase tracking-wide text-muted-foreground mb-6">A Few Gentle Nudges</p>
            <div className="space-y-3 w-full max-w-xs">
              {suggestions.map((s, i) => {
                const Icon = SUGGESTION_ICONS[s.icon];
                return (
                  <div key={i} className="card-glow px-4 py-3 flex items-center gap-3 text-left">
                    <Icon className="w-5 h-5 text-primary shrink-0" />
                    <span className="text-sm font-medium">{s.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ),
      });
    }
  }

  // Outro
  slides.push({
    content: (
      <div className="flex flex-col items-center justify-center text-center h-full px-8">
        <span className="text-5xl mb-4">🌸</span>
        <h2 className="font-display font-bold text-3xl mb-3">That's your {word}!</h2>
        <p className="text-muted-foreground mb-8 max-w-xs">
          Keep showing up for yourself — one check-in at a time.
        </p>
        <button onClick={onFinish} className="btn-gradient inline-flex items-center gap-2">
          See Full Recap <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    ),
  });

  // ─── Navigation ──────────────────────────────────────────────────────────
  const goNext = () => {
    if (index < slides.length - 1) setIndex(index + 1);
    else onFinish();
  };
  const goPrev = () => {
    if (index > 0) setIndex(index - 1);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (delta > 50) goPrev();
    else if (delta < -50) goNext();
    touchStartX.current = null;
  };

  return (
    <div
      className="fixed inset-0 z-[100] bg-background"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Progress bar */}
      <div className="absolute top-0 left-0 right-0 z-20 flex gap-1 p-3">
        {slides.map((_, i) => (
          <div key={i} className="h-1 flex-1 rounded-full bg-foreground/10 overflow-hidden">
            <div
              className={`h-full rounded-full bg-primary transition-all duration-300 ${
                i < index ? "w-full" : i === index ? "w-full animate-fade-in" : "w-0"
              }`}
            />
          </div>
        ))}
      </div>

      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-6 right-4 z-20 p-2 rounded-full bg-foreground/5 hover:bg-foreground/10 transition-colors"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Slide */}
      <div
        key={index}
        className={`h-full w-full bg-gradient-to-br ${GRADIENTS[index % GRADIENTS.length]} animate-fade-in`}
      >
        {slides[index].content}
      </div>

      {/* Tap zones */}
      <button
        onClick={goPrev}
        aria-label="Previous"
        className="absolute left-0 top-0 h-full w-1/3 cursor-pointer"
      />
      <button
        onClick={goNext}
        aria-label="Next"
        className="absolute right-0 top-0 h-full w-1/3 cursor-pointer"
      />
    </div>
  );
};

export default WrappedStory;