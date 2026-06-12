import { Link } from "react-router-dom";
import { ArrowRight, Heart, Sparkles, MessageCircle, Calendar, Brain, Leaf, Users, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import logo from "@/assets/logo.png";
import nurturingAvatar from "@/assets/nurturing-avatar.png";

const features = [
  {
    icon: Calendar,
    title: "Your Feelings Diary",
    description: "A gentle daily calendar to track your moods, write little notes, and look back on your journey with kindness.",
    color: "bg-mood-happy/20 text-mood-happy",
  },
  {
    icon: MessageCircle,
    title: "SheRo — Your Midnight Friend",
    description: "Awake at 2am with a heavy heart? SheRo listens without judgment, anytime you need to talk.",
    color: "bg-primary/20 text-primary",
  },
  {
    icon: Brain,
    title: "Heart Check-In",
    description: "A gentle, science-backed check-in that helps you understand how you're really feeling — privately, just for you.",
    color: "bg-mood-calm/20 text-mood-calm",
  },
  {
    icon: Leaf,
    title: "Grandma's Wisdom",
    description: "Time-tested traditional remedies from your region, explained with the science behind why they actually work.",
    color: "bg-sage/20 text-sage",
  },
  {
    icon: Sparkles,
    title: "MaaWrapped",
    description: "A sweet little weekly recap of your emotional journey, with gentle suggestions for the week ahead.",
    color: "bg-gold/20 text-gold",
  },
  {
    icon: ShieldCheck,
    title: "Your Safe Space",
    description: "Everything you share stays private and protected. This space is yours — built with care, kept with trust.",
    color: "bg-secondary/20 text-secondary",
  },
];

const testimonials = [
  {
    quote: "At 3am with a crying baby, I didn't feel so alone anymore. SheRo just... got it.",
    name: "A new mom, Bengaluru",
    emoji: "🌙",
  },
  {
    quote: "The wisdom tips reminded me of things my own grandmother used to say. It felt like home.",
    name: "An expecting mother, Mysuru",
    emoji: "🌿",
  },
  {
    quote: "I didn't realize how much I needed a space to just check in with myself until I found this.",
    name: "A toddler mom, Mangaluru",
    emoji: "💛",
  },
];

// "We are here for you" in different Indian languages
const greetings = [
  "We are here for you",
  "আমি আপনার পাশে আছি", // Bengali
  "અમે તમારી સાથે છીએ", // Gujarati
  "हम आपके साथ हैं", // Hindi
  "ನಾವು ನಿಮ್ಮ ಜೊತೆಯಿದ್ದೇವೆ", // Kannada
  "اسۍ توہی سٕتؠ چھِ", // Kashmiri
  "ഞങ്ങൾ നിങ്ങളുടെ കൂടെയുണ്ട്", // Malayalam
  "आम्ही तुमच्यासोबत आहोत", // Marathi
  "ଆମେ ତୁମ ପାଇଁ ଅଛୁ", // Odia
  "ਅਸੀਂ ਤੁਹਾਡੇ ਨਾਲ ਹਾਂ", // Punjabi
  "वयं तव सह स्मः", // Sanskrit
  "நாங்கள் உங்களுடன் இருக்கிறோம்", // Tamil
  "మేము మీతో ఉన్నాము", // Telugu
  "ہم آپ کے ساتھ ہیں", // Urdu
  "আমি তোমাৰ লগত আছোঁ", // Assamese
];

const TypewriterGreeting = () => {
  const [textIndex, setTextIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentText = greetings[textIndex];
    let timeout: ReturnType<typeof setTimeout>;

    if (!isDeleting && displayedText.length < currentText.length) {
      timeout = setTimeout(() => {
        setDisplayedText(currentText.slice(0, displayedText.length + 1));
      }, 80);
    } else if (!isDeleting && displayedText.length === currentText.length) {
      timeout = setTimeout(() => setIsDeleting(true), 1800);
    } else if (isDeleting && displayedText.length > 0) {
      timeout = setTimeout(() => {
        setDisplayedText(displayedText.slice(0, -1));
      }, 40);
    } else if (isDeleting && displayedText.length === 0) {
      timeout = setTimeout(() => {
        setIsDeleting(false);
        setTextIndex((prev) => (prev + 1) % greetings.length);
      }, 300);
    }

    return () => clearTimeout(timeout);
  }, [displayedText, isDeleting, textIndex]);

  return (
    <p className="text-xl sm:text-2xl lg:text-3xl font-semibold text-primary min-h-[2.5rem] flex items-center justify-center gap-1">
      <span>{displayedText}</span>
      <span className="inline-block w-[2px] h-7 bg-primary animate-pulse" />
    </p>
  );
};

const Index = () => {
  return (
    <div className="min-h-screen bg-background">

      {/* ─── Logo Spotlight Bar ───────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, hsl(var(--primary) / 0.07) 0%, hsl(var(--secondary) / 0.10) 50%, hsl(var(--primary) / 0.05) 100%)",
          borderBottom: "1px solid hsl(var(--primary) / 0.12)",
        }}
      >
        {/* Soft ambient blobs behind logo */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-10 left-1/4 w-64 h-64 bg-primary/8 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 right-1/4 w-64 h-64 bg-secondary/8 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 py-10 relative flex flex-col items-center gap-3">
          <img
            src={logo}
            alt="Maahyu"
            className="h-28 sm:h-36 w-auto animate-float drop-shadow-md"
          />
          <p className="text-sm sm:text-base tracking-[0.2em] uppercase text-primary/70 font-medium">
            Maahyu
          </p>
          <p className="text-muted-foreground text-sm sm:text-base max-w-sm text-center leading-relaxed">
            A gentle space built for every mother, every stage, every feeling.
          </p>
        </div>
      </section>

      {/* ─── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative hero-gradient overflow-hidden">

        {/* Ambient blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-coral-light/20 rounded-full blur-2xl animate-float" />
        </div>

        <div className="container mx-auto px-4 pt-16 pb-24 relative">
          <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-20">

            {/* ── Left: text content ── */}
            <div className="flex flex-col items-center text-center lg:items-start lg:text-left flex-1 max-w-2xl">

              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 animate-fade-in">
                <Heart className="w-4 h-4" />
                <span>A little corner just for mothers</span>
              </div>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-5 animate-slide-up">
                You're doing better than{" "}
                <span className="text-gradient">you think</span>, mama
              </h1>

              <p className="text-lg text-muted-foreground max-w-xl mb-10 animate-slide-up" style={{ animationDelay: "0.1s" }}>
                Maahyu is your gentle companion through pregnancy, motherhood, and
                everything in between — blending traditional wisdom, AI support,
                and a space that's truly yours.
              </p>

              <Link to="/auth">
                <Button size="lg" className="rounded-full px-10 py-6 text-lg font-semibold gap-2 shadow-lg group">
                  Start Your Journey
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>

              <p className="text-sm text-muted-foreground mt-4">
                Free to begin · Takes less than 2 minutes 🌸
              </p>
            </div>

            {/* ── Right: avatar card ── */}
            <div className="flex-shrink-0 flex flex-col items-center gap-0 animate-fade-in">

              {/* Card */}
              <div
                className="relative rounded-3xl overflow-hidden shadow-xl"
                style={{
                  width: "min(320px, 88vw)",
                  background: "linear-gradient(160deg, hsl(var(--background)) 0%, hsl(var(--primary) / 0.06) 100%)",
                  border: "1px solid hsl(var(--primary) / 0.18)",
                }}
              >
                {/* Avatar — fills top 3/4 of card */}
                <div className="w-full" style={{ aspectRatio: "4/3.6" }}>
                  <img
                    src={nurturingAvatar}
                    alt="A warm, nurturing presence here for you"
                    className="w-full h-full object-cover object-top"
                    style={{ display: "block" }}
                  />
                </div>

                {/* Greeting strip at bottom of card */}
                <div
                  className="px-5 py-4 flex flex-col items-center gap-1"
                  style={{
                    background: "hsl(var(--background) / 0.82)",
                    backdropFilter: "blur(10px)",
                    borderTop: "1px solid hsl(var(--primary) / 0.12)",
                  }}
                >
                  <TypewriterGreeting />
                  <p className="text-xs text-muted-foreground tracking-wide uppercase">
                    Maahyu · Your gentle companion
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── A Little Note From Us ─────────────────────────────────────────── */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/20 text-secondary text-sm font-medium mb-6">
              <Heart className="w-4 h-4" />
              <span>A little note from us</span>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-6">
              Every mother carries a quiet world{" "}
              <span className="text-gradient">inside her</span>
            </h2>

            <p className="text-muted-foreground text-lg leading-relaxed mb-4">
              Late nights, big feelings, and a thousand little questions —
              motherhood is beautiful, but it can also feel quietly
              overwhelming. We built Maahyu because we believe every mother
              deserves a soft place to land.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed">
              A place that listens like a friend, advises like a grandmother,
              and watches over you like family — wherever you are, whatever
              stage you're in. 🌸
            </p>
          </div>
        </div>
      </section>

      {/* ─── Features ──────────────────────────────────────────────────────── */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              <span>What's waiting for you</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
              Little things that make{" "}
              <span className="text-gradient">a big difference</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Every feature here was made with one thought — what would
              actually help a mother feel less alone today?
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="card-glow p-6 flex flex-col gap-4 animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="font-display font-bold text-xl">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Testimonials ──────────────────────────────────────────────────── */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sage/20 text-sage text-sm font-medium mb-4">
              <Users className="w-4 h-4" />
              <span>Mama voices</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
              You're <span className="text-gradient">not alone</span> in this
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="card-elevated p-6 flex flex-col gap-4 animate-slide-up"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="text-3xl">{t.emoji}</div>
                <p className="text-foreground leading-relaxed italic">"{t.quote}"</p>
                <p className="text-sm text-muted-foreground mt-auto">— {t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Final CTA ─────────────────────────────────────────────────────── */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-blush to-cream" />
        <div className="container mx-auto px-4 relative text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-6">
            <Heart className="w-8 h-8 text-primary" />
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
            Ready when you are 🌸
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
            No pressure, no judgment — just a gentle space, ready whenever you need it.
          </p>
          <Link to="/auth">
            <Button size="lg" className="rounded-full px-10 py-6 text-lg font-semibold gap-2 shadow-lg group">
              Start Your Journey
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </section>

      {/* ─── Footer ──────────────────────────────────────────────────────────── */}
      <footer className="py-8 border-t border-border">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <span>© {new Date().getFullYear()} Maahyu. Made with 🤍 for every mother.</span>
          <Link to="/privacy" className="hover:text-primary transition-colors">
            Privacy &amp; Security
          </Link>
        </div>
      </footer>

    </div>
  );
};

export default Index;