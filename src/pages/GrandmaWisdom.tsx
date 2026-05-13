import { useState, useEffect, useRef } from "react";
import { Leaf, Volume2, Search, Sparkles, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Navbar from "@/components/layout/Navbar";
import MaaMindChatbot from "@/components/chat/MaaMindChatbot";
import { useGrandmaWisdom, WisdomCard } from "@/hooks/useGrandmaWisdom";

const regions = [
  "North India", "South India", "East India", "West India",
  "Northeast India", "Central India", "Kerala", "Karnataka",
  "Tamil Nadu", "Punjab", "Rajasthan", "Maharashtra", "Bengal", "Gujarat",
];
const stages = ["Pregnancy", "Postpartum", "Toddler Care", "Trying to Conceive"];
const categories = [
  "Digestion", "Mental Health", "Physical Care",
  "Lactation", "Immunity", "Sleep", "Nutrition", "Skin Care",
];

// ─── Swipe Carousel ────────────────────────────────────────────────────────────
const WisdomCarousel = ({ cards, onSpeak }: { cards: WisdomCard[]; onSpeak: (c: WisdomCard) => void }) => {
  const [current, setCurrent] = useState(0);
  const startX = useRef(0);
  const isDragging = useRef(false);

  useEffect(() => { setCurrent(0); }, [cards]);

  const goTo = (idx: number) => {
    if (idx < 0 || idx >= cards.length) return;
    setCurrent(idx);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    startX.current = e.clientX;
    isDragging.current = true;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const diff = e.clientX - startX.current;
    if (diff < -50) goTo(current + 1);
    else if (diff > 50) goTo(current - 1);
  };

  if (cards.length === 0) return null;

  return (
    <div className="w-full">
      {/* Card Stage */}
      <div
        className="relative h-[340px] overflow-hidden select-none cursor-grab active:cursor-grabbing"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
      >
        {cards.map((card, i) => {
          const diff = i - current;
          let transform = "";
          let opacity = 0;
          let zIndex = 0;
          let pointerEvents: "none" | "auto" = "none";

          if (diff === 0) {
            transform = "translateX(-50%) scale(1)";
            opacity = 1;
            zIndex = 3;
            pointerEvents = "auto";
          } else if (diff === -1) {
            transform = "translateX(calc(-50% - 280px)) scale(0.9)";
            opacity = 0.4;
            zIndex = 2;
          } else if (diff === 1) {
            transform = "translateX(calc(-50% + 280px)) scale(0.9)";
            opacity = 0.4;
            zIndex = 2;
          } else if (diff < 0) {
            transform = "translateX(calc(-50% - 600px)) scale(0.8)";
            opacity = 0;
          } else {
            transform = "translateX(calc(-50% + 600px)) scale(0.8)";
            opacity = 0;
          }

          return (
            <div
              key={card.id}
              className="absolute top-0 left-1/2 w-[88%] max-w-[520px]"
              style={{
                transform,
                opacity,
                zIndex,
                pointerEvents,
                transition: "transform 0.35s cubic-bezier(0.4,0,0.2,1), opacity 0.35s",
              }}
            >
              {/* Card Content */}
              <div className="card-glow p-6 h-[320px] flex flex-col">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-sage/20 flex items-center justify-center shrink-0 text-xl">
                      👵
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-lg leading-tight">
                        {card.title}
                      </h3>
                      {card.localName && (
                        <p className="text-xs text-muted-foreground italic mt-0.5">
                          {card.localName}
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => onSpeak(card)}
                    className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors shrink-0"
                  >
                    <Volume2 className="w-4 h-4 text-primary" />
                  </button>
                </div>

                {/* Traditional + Scientific */}
                <div className="space-y-2 flex-1 overflow-hidden">
                  <div className="p-3 rounded-xl bg-muted/50">
                    <p className="text-sm line-clamp-2">
                      <span className="font-semibold text-foreground">Traditional: </span>
                      <span className="text-muted-foreground">{card.traditional}</span>
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-primary/5 border border-primary/10">
                    <p className="text-sm line-clamp-2">
                      <span className="font-semibold text-primary">Scientific: </span>
                      <span className="text-muted-foreground">{card.scientific}</span>
                    </p>
                  </div>
                  {card.caution && (
                    <div className="p-2 rounded-xl bg-amber-50 border border-amber-200">
                      <p className="text-xs text-amber-700 line-clamp-1">
                        <span className="font-semibold">⚠️ </span>{card.caution}
                      </p>
                    </div>
                  )}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="px-3 py-1 rounded-full bg-muted text-xs font-medium">{card.region}</span>
                  <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">{card.stage}</span>
                  <span className="px-3 py-1 rounded-full bg-sage/20 text-sage text-xs font-medium">{card.category}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Nav Controls */}
      <div className="flex items-center justify-center gap-4 mt-4">
        <button
          onClick={() => goTo(current - 1)}
          disabled={current === 0}
          className="w-9 h-9 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Previous"
        >
          ←
        </button>

        {/* Dots */}
        <div className="flex gap-1.5 items-center">
          {cards.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className="transition-all duration-200 rounded-full bg-primary/30 hover:bg-primary/60"
              style={{
                width: i === current ? "18px" : "6px",
                height: "6px",
                background: i === current ? "hsl(var(--primary))" : undefined,
              }}
              aria-label={`Go to card ${i + 1}`}
            />
          ))}
        </div>

        <button
          onClick={() => goTo(current + 1)}
          disabled={current === cards.length - 1}
          className="w-9 h-9 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Next"
        >
          →
        </button>
      </div>

      <p className="text-center text-xs text-muted-foreground mt-2">
        {current + 1} / {cards.length} · swipe or use arrows
      </p>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
const GrandmaWisdom = () => {
  const [selectedRegion, setSelectedRegion] = useState("Karnataka");
  const [selectedStage, setSelectedStage] = useState("Postpartum");
  const [selectedCategory, setSelectedCategory] = useState("Digestion");

  const { cards, loading, error, fetchWisdom } = useGrandmaWisdom();

  useEffect(() => {
    fetchWisdom({ region: selectedRegion, stage: selectedStage, category: selectedCategory, count: 6 });
  }, []);

  const handleGenerate = () => {
    fetchWisdom({ region: selectedRegion, stage: selectedStage, category: selectedCategory, count: 6 });
  };

  const speakText = (card: WisdomCard) => {
    const text = `${card.title}. Traditional: ${card.traditional}. Scientific: ${card.scientific}`;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-IN";
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sage/20 text-sage text-sm font-medium mb-4">
            <Leaf className="w-4 h-4" />
            <span>Traditional Meets Modern</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold mb-3">
            Grandma's <span className="text-gradient">Wisdom</span>
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            AI-curated indigenous practices with scientific backing — specific to your region, stage, and needs.
          </p>
        </div>

        {/* Filters */}
        <div className="card-elevated p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <Select value={selectedRegion} onValueChange={setSelectedRegion}>
              <SelectTrigger className="w-full md:w-44">
                <SelectValue placeholder="Region" />
              </SelectTrigger>
              <SelectContent>
                {regions.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
              </SelectContent>
            </Select>

            <Select value={selectedStage} onValueChange={setSelectedStage}>
              <SelectTrigger className="w-full md:w-44">
                <SelectValue placeholder="Stage" />
              </SelectTrigger>
              <SelectContent>
                {stages.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-44">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>

            <Button onClick={handleGenerate} disabled={loading} className="rounded-full gap-2 ml-auto">
              <Sparkles className="w-4 h-4" />
              {loading ? "Generating..." : "Generate"}
            </Button>
          </div>
        </div>

        {/* Status */}
        {!loading && !error && cards.length > 0 && (
          <p className="text-sm text-muted-foreground mb-6 text-center">
            {cards.length} tips for{" "}
            <span className="text-primary font-medium">{selectedRegion}</span> ·{" "}
            <span className="text-primary font-medium">{selectedStage}</span> ·{" "}
            <span className="text-primary font-medium">{selectedCategory}</span>
          </p>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div className="flex justify-center">
            <div className="card-elevated p-6 w-[88%] max-w-[520px] h-[320px] animate-pulse">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-muted" />
                <div className="h-5 bg-muted rounded w-48" />
              </div>
              <div className="space-y-3">
                <div className="h-16 bg-muted rounded-xl" />
                <div className="h-16 bg-muted rounded-xl" />
              </div>
              <div className="flex gap-2 mt-4">
                <div className="h-6 w-20 bg-muted rounded-full" />
                <div className="h-6 w-20 bg-muted rounded-full" />
              </div>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-destructive/10 text-destructive mb-6">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Carousel */}
        {!loading && !error && cards.length > 0 && (
          <WisdomCarousel cards={cards} onSpeak={speakText} />
        )}

      </main>
      <MaaMindChatbot />
    </div>
  );
};

export default GrandmaWisdom;