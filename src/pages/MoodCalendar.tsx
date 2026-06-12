import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Navbar from "@/components/layout/Navbar";
import MaaMindChatbot from "@/components/chat/MaaMindChatbot";
import { collection, doc, setDoc, getDocs, serverTimestamp } from "firebase/firestore";
import { db } from "@/firebase";
import { useAuth } from "@/context/AuthContext";

interface MoodEntry {
  date: string;
  moods: string[];
  note?: string;
}

const moodOptions = [
  { emoji: "😊", label: "Happy",      color: "bg-mood-happy"   },
  { emoji: "😌", label: "Calm",       color: "bg-mood-calm"    },
  { emoji: "🥰", label: "Loved",      color: "bg-primary"      },
  { emoji: "😔", label: "Sad",        color: "bg-mood-sad"     },
  { emoji: "😰", label: "Anxious",    color: "bg-mood-anxious" },
  { emoji: "😠", label: "Frustrated", color: "bg-mood-angry"   },
  { emoji: "😴", label: "Tired",      color: "bg-mood-tired"   },
];

const MOOD_COLOR_MAP: Record<string, string> = {
  "😊": "rgb(255, 255, 0)",      // Joy        - Yellow
  "😌": "rgb(144, 238, 144)",    // Calm       - Light green
  "🥰": "rgb(255, 182, 193)",    // Loved      - Pink
  "😔": "rgb(70, 130, 180)",     // Sad        - Blue
  "😰": "rgb(255, 165, 0)",      // Anxious    - Orange
  "😠": "rgb(247, 10, 10)",      // Anger      - Red
  "😴": "rgb(186, 85, 211)",     // Tired      - Purple
};

const MoodCalendar = () => {
  const { user } = useAuth();

  const [currentDate,   setCurrentDate]   = useState(new Date());
  const [selectedDate,  setSelectedDate]  = useState<string | null>(null);
  const [moodEntries,   setMoodEntries]   = useState<MoodEntry[]>([]);
  const [isDialogOpen,  setIsDialogOpen]  = useState(false);
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);
  const [note,          setNote]          = useState("");
  const [isSaving,      setIsSaving]      = useState(false);
  const [isLoading,     setIsLoading]     = useState(true);

  // ─── Load mood entries from Firestore on mount ───────────────────────────────
  useEffect(() => {
    if (!user) return;
    const load = async () => {
      setIsLoading(true);
      try {
        const snap = await getDocs(
          collection(db, "users", user.uid, "moodEntries")
        );
        const entries = snap.docs.map((d) => d.data() as MoodEntry);
        setMoodEntries(entries);
      } catch (err) {
        console.error("Failed to load mood entries:", err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [user]);

  // ─── Calendar helpers ────────────────────────────────────────────────────────
  const daysInMonth     = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December",
  ];
  const dayNames = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

  const formatDate = (day: number) => {
    const month  = String(currentDate.getMonth() + 1).padStart(2, "0");
    const dayStr = String(day).padStart(2, "0");
    return `${currentDate.getFullYear()}-${month}-${dayStr}`;
  };

  const getMoodEntry = (day: number) => {
    const date = formatDate(day);
    return moodEntries.find((e) => e.date === date);
  };

  const getMoodStyle = (moods: string[]) => {
    if (!moods || moods.length === 0) return {};
    const colors = moods.map((m) => MOOD_COLOR_MAP[m]).filter(Boolean);
    if (colors.length === 1) return { backgroundColor: colors[0] };
    return { background: `linear-gradient(135deg, ${colors.join(", ")})` };
  };

  const isFutureDate = (dateStr: string) => {
    const selected = new Date(dateStr);
    const today    = new Date();
    selected.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    return selected > today;
  };

  const isPastDate = (dateStr: string) => {
    const selected = new Date(dateStr);
    const today    = new Date();
    selected.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    return selected < today;
  };

  // ─── Date click ──────────────────────────────────────────────────────────────
  const handleDateClick = (day: number) => {
    const date  = formatDate(day);
    if (isFutureDate(date)) return;               // 🚫 future — blocked

    const entry = getMoodEntry(day);

    setSelectedDate(date);
    setSelectedMoods(entry?.moods || []);
    setNote(entry?.note || "");
    setIsDialogOpen(true);
  };

  const handleMoodToggle = (emoji: string) => {
    setSelectedMoods((prev) =>
      prev.includes(emoji) ? prev.filter((m) => m !== emoji) : [...prev, emoji]
    );
  };

  // ─── Save to Firestore ───────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!selectedDate || !user)                       return;
    if (isFutureDate(selectedDate))                   return;
    if (selectedMoods.length === 0)                   return;

    const existingEntry = moodEntries.find((e) => e.date === selectedDate);

    // 🔒 Past date that already has an entry → locked
    if (isPastDate(selectedDate) && existingEntry)    return;

    setIsSaving(true);
    try {
      const entry: MoodEntry = {
        date:  selectedDate,
        moods: selectedMoods,
        ...(note ? { note } : {}),
      };

      // Write to Firestore — document ID = date string (e.g. "2026-06-11")
      await setDoc(
        doc(db, "users", user.uid, "moodEntries", selectedDate),
        { ...entry, createdAt: serverTimestamp() }
      );

      // Update local state immediately so UI reflects without re-fetch
      setMoodEntries((prev) => {
        const filtered = prev.filter((e) => e.date !== selectedDate);
        return [...filtered, entry];
      });

      setIsDialogOpen(false);
      setSelectedMoods([]);
      setNote("");
    } catch (err) {
      console.error("Failed to save mood entry:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const navigateMonth = (direction: number) => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1)
    );
  };

  const isEntryLocked = (dateStr: string) =>
    isPastDate(dateStr) && moodEntries.some((e) => e.date === dateStr);

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 pt-24 pb-12 max-w-4xl">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-bold mb-2">Mood Calendar</h1>
          <p className="text-muted-foreground">Track your emotional journey day by day</p>
        </div>

        {/* Calendar Card */}
        <div className="card-elevated p-6">

          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-6">
            <Button variant="ghost" size="icon" onClick={() => navigateMonth(-1)} className="rounded-full">
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <h2 className="font-display font-bold text-xl">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <Button variant="ghost" size="icon" onClick={() => navigateMonth(1)} className="rounded-full">
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>

          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {dayNames.map((day) => (
              <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Loading state */}
          {isLoading ? (
            <div className="flex justify-center py-16">
              <p className="text-muted-foreground text-sm animate-pulse">Loading your mood history...</p>
            </div>
          ) : (
            /* Calendar Grid */
            <div className="grid grid-cols-7 gap-2">
              {/* Empty cells */}
              {Array.from({ length: firstDayOfMonth }, (_, i) => (
                <div key={`empty-${i}`} className="aspect-square" />
              ))}

              {/* Day cells */}
              {Array.from({ length: daysInMonth }, (_, i) => {
                const day   = i + 1;
                const entry = getMoodEntry(day);
                const isToday =
                  day === new Date().getDate() &&
                  currentDate.getMonth() === new Date().getMonth() &&
                  currentDate.getFullYear() === new Date().getFullYear();
                const dateStr = formatDate(day);
                const future  = isFutureDate(dateStr);

                return (
                  <button
                    key={day}
                    onClick={() => handleDateClick(day)}
                    style={entry ? getMoodStyle(entry.moods) : undefined}
                    disabled={future}
                    className={`aspect-square rounded-xl p-1 flex flex-col items-center justify-center gap-1 transition-all
                      ${future ? "opacity-30 cursor-not-allowed" : "hover:scale-105"}
                      ${isToday ? "ring-2 ring-primary ring-offset-2" : ""}
                      ${entry ? "text-black" : "bg-muted/50 hover:bg-muted"}`}
                  >
                    <span className={`text-sm ${isToday ? "font-bold text-primary" : "text-foreground"}`}>
                      {day}
                    </span>
                    {entry && (
                      <div className="flex -space-x-1">
                        {entry.moods.slice(0, 2).map((mood, idx) => (
                          <span key={idx} className="text-sm">{mood}</span>
                        ))}
                        {entry.moods.length > 2 && (
                          <span className="text-xs text-muted-foreground">+{entry.moods.length - 2}</span>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Mood Legend */}
        <div className="card-elevated p-4 mt-6">
          <h3 className="font-medium text-sm mb-3">Mood Legend</h3>
          <div className="flex flex-wrap gap-3">
            {moodOptions.map((mood) => (
              <div key={mood.emoji} className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded-full ${mood.color}/40`} />
                <span className="text-sm">{mood.emoji} {mood.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Personal Diary */}
        <div className="mt-8">
          <h2 className="font-display font-bold text-xl mb-4 text-primary text-center">
            My Personal Diary 🌸
          </h2>
        </div>

        <div className="space-y-3">
          {moodEntries.length === 0 && !isLoading && (
            <p className="text-center text-muted-foreground text-sm py-8">
              No entries yet — click any day to record how you're feeling 💛
            </p>
          )}
          {[...moodEntries]
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 20)
            .map((entry) => (
              <div key={entry.date} className="card-glow p-5 flex items-start gap-4">
                <div className="text-center shrink-0">
                  <span className="text-sm font-medium block">
                    {new Date(entry.date).toLocaleDateString("en-US", { weekday: "short" })}
                  </span>
                  <span className="text-2xl font-bold text-primary">
                    {new Date(entry.date).getDate()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap gap-2 mb-2">
                    {entry.moods.map((mood, idx) => (
                      <span key={idx} className="text-xl">{mood}</span>
                    ))}
                  </div>
                  {entry.note && (
                    <p className="text-sm text-muted-foreground">{entry.note}</p>
                  )}
                </div>
              </div>
            ))}
        </div>

      </main>

      {/* Mood Entry Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">
              {selectedDate &&
                new Date(selectedDate + "T00:00").toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">

            {/* Mood selector */}
            <div>
              <h4 className="text-sm font-medium mb-3">How are you feeling?</h4>
              <div className="grid grid-cols-4 gap-2">
                {moodOptions.map((mood) => (
                  <button
                    key={mood.emoji}
                    onClick={() => handleMoodToggle(mood.emoji)}
                    disabled={!!selectedDate && isEntryLocked(selectedDate)}
                    className={`p-3 rounded-xl flex flex-col items-center gap-1 transition-all
                      ${selectedMoods.includes(mood.emoji)
                        ? `${mood.color}/30 ring-2 ring-primary`
                        : "bg-muted hover:bg-muted/80"}
                      ${selectedDate && isEntryLocked(selectedDate)
                        ? "opacity-60 cursor-not-allowed"
                        : ""}`}
                  >
                    <span className="text-2xl">{mood.emoji}</span>
                    <span className="text-xs">{mood.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Note */}
            <div>
              <h4 className="text-sm font-medium mb-2">Add a note (optional)</h4>
              <Textarea
                placeholder="How was your day? What made you feel this way?"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                disabled={!!selectedDate && isEntryLocked(selectedDate)}
                className="resize-none"
                rows={3}
              />
            </div>

            {/* Locked message */}
            {selectedDate && isEntryLocked(selectedDate) && (
              <p className="text-xs text-muted-foreground text-center">
                This entry is locked to preserve your emotional history 💛
              </p>
            )}

            <Button
              onClick={() => { handleSave(); }}
              className="w-full rounded-full"
              disabled={
                !selectedDate ||
                selectedMoods.length === 0 ||
                isSaving ||
                (!!selectedDate && isFutureDate(selectedDate)) ||
                (!!selectedDate && isEntryLocked(selectedDate))
              }
            >
              {isSaving ? "Saving..." : "Save Entry"}
            </Button>

          </div>
        </DialogContent>
      </Dialog>

      <MaaMindChatbot />
    </div>
  );
};

export default MoodCalendar;