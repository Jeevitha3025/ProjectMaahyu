import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Navbar from "@/components/layout/Navbar";
import MaaMindChatbot from "@/components/chat/MaaMindChatbot";

interface MoodEntry {
  date: string;
  moods: string[];
  note?: string;
}

const moodOptions = [
  { emoji: "😊", label: "Happy", color: "bg-mood-happy" },
  { emoji: "😌", label: "Calm", color: "bg-mood-calm" },
  { emoji: "🥰", label: "Loved", color: "bg-primary" },
  { emoji: "😔", label: "Sad", color: "bg-mood-sad" },
  { emoji: "😰", label: "Anxious", color: "bg-mood-anxious" },
  { emoji: "😠", label: "Frustrated", color: "bg-mood-angry" },
  { emoji: "😴", label: "Tired", color: "bg-mood-tired" },
];

const MOOD_COLOR_MAP: Record<string, string> = {
  "😊": "rgb(255, 255, 0)",      // Joy - Yellow
  "😌": "rgb(144, 238, 144)",    // Calm - Light green
  "🥰": "rgb(255, 182, 193)",    // Loved - Pink
  "😔": "rgb(70, 130, 180)",     // Sad - Blue
  "😰": "rgb(255, 165, 0)",      // Anxious - Orange
  "😠": "rgb(247, 10, 10)",      // Anger - Red
  "😴": "rgb(186, 85, 211)",     // Tired - Purple
};

const MoodCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([
    { date: "2026-01-25", moods: ["😊", "😌"], note: "Had a good day with baby" },
    { date: "2026-01-26", moods: ["😴", "😰"], note: "Didn't sleep well" },
    { date: "2026-01-27", moods: ["🥰"], note: "Baby smiled for the first time!" },
    { date: "2026-01-28", moods: ["😊"] },
  ]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);
  const [note, setNote] = useState("");

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const formatDate = (day: number) => {
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const dayStr = String(day).padStart(2, "0");
    return `${currentDate.getFullYear()}-${month}-${dayStr}`;
  };

  const getMoodEntry = (day: number) => {
    const date = formatDate(day);
    return moodEntries.find((entry) => entry.date === date);
  };

  const getMoodStyle = (moods: string[]) => {
  if (!moods || moods.length === 0) return {};

  const colors = moods
    .map((m) => MOOD_COLOR_MAP[m])
    .filter(Boolean);

  if (colors.length === 1) {
    return {
      backgroundColor: colors[0],
    };
  }
  // Multiple moods → gradient blend
  return {
    background: `linear-gradient(135deg, ${colors.join(", ")})`,
  };
};

const isFutureDate = (dateStr: string) => {
  const selected = new Date(dateStr);
  const today = new Date();

  selected.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  return selected > today;
};

const isPastDate = (dateStr: string) => {
  const selected = new Date(dateStr);
  const today = new Date();

  selected.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  return selected < today;
};
 const handleDateClick = (day: number) => {
  const date = formatDate(day);

  // 🚫 Future dates: totally blocked
  if (isFutureDate(date)) return;

  const entry = getMoodEntry(day);

  // 🔒 Past date WITH existing entry → view only
  if (isPastDate(date) && entry) {
    setSelectedDate(date);
    setSelectedMoods(entry.moods);
    setNote(entry.note || "");
    setIsDialogOpen(true);
    return;
  }

  // ✅ Today OR past date WITHOUT entry → editable
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

const handleSave = () => {
  if (!selectedDate) return;

  const existingEntry = moodEntries.find(e => e.date === selectedDate);

  if (isFutureDate(selectedDate)) return;

  // 🔒 lock only if past AND already has note
  if (isPastDate(selectedDate) && existingEntry?.note) return;

  if (selectedMoods.length > 0) {
    setMoodEntries(prev => {
      if (existingEntry) {
        return prev.map(e =>
          e.date === selectedDate
            ? { ...e, moods: selectedMoods, note: note || undefined }
            : e
        );
      }

      return [
        ...prev,
        { date: selectedDate, moods: selectedMoods, note: note || undefined },
      ];
    });
  }

  setIsDialogOpen(false);
  setSelectedMoods([]);
  setNote("");
};

  const navigateMonth = (direction: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1));
  };

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

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {/* Empty cells for days before month starts */}
            {Array.from({ length: firstDayOfMonth }, (_, i) => (
              <div key={`empty-${i}`} className="aspect-square" />
            ))}

            {/* Days */}
            {Array.from({ length: daysInMonth }, (_, i) => {
              const day = i + 1;
              const entry = getMoodEntry(day);
              const isToday =
                day === new Date().getDate() &&
                currentDate.getMonth() === new Date().getMonth() &&
                currentDate.getFullYear() === new Date().getFullYear();

              return (
                <button
                   key={day}
                   onClick={() => handleDateClick(day)}
                   style={entry ? getMoodStyle(entry.moods) : undefined}
                   className={`aspect-square rounded-xl p-1 flex flex-col items-center justify-center gap-1 transition-all hover:scale-105 ${
                   isToday ? "ring-2 ring-primary ring-offset-2" : ""
                     } ${entry ? "text-black" : "bg-muted/50 hover:bg-muted"}`}
                    
                   >

                  <span className={`text-sm ${isToday ? "font-bold text-primary" : "text-foreground"}`}>
                    {day}
                  </span>
                  {entry && (
                    <div className="flex -space-x-1">
                      {entry.moods.slice(0, 2).map((mood, idx) => (
                        <span key={idx} className="text-sm">
                          {mood}
                        </span>
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

        {/* Recent Entries */}
        <div className="mt-8">
  <h2 className="font-display font-bold text-xl mb-4 text-primary text-center">
    My Personal Diary 🌸
  </h2>
      </div>
        <div className="space-y-3">
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
           <p className="text-sm text-muted-foreground">
  {entry.note ? entry.note : "No diary note added"}
</p>

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
              {selectedDate && new Date(selectedDate + "T00:00").toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-medium mb-3">How are you feeling?</h4>
              <div className="grid grid-cols-4 gap-2">
                {moodOptions.map((mood) => (
                  <button
                    key={mood.emoji}
                    onClick={() => handleMoodToggle(mood.emoji)}
                    className={`p-3 rounded-xl flex flex-col items-center gap-1 transition-all ${
                      selectedMoods.includes(mood.emoji)
                        ? `${mood.color}/30 ring-2 ring-primary`
                        : "bg-muted hover:bg-muted/80"
                    }`}
                  >
                    <span className="text-2xl">{mood.emoji}</span>
                    <span className="text-xs">{mood.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-2">Add a note (optional)</h4>
              <Textarea
                placeholder="How was your day? What made you feel this way?"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="resize-none"
                rows={3}
              />
            </div>

            {selectedDate &&
               isPastDate(selectedDate) &&
                moodEntries.some(e => e.date === selectedDate) && (
                <p className="text-xs text-muted-foreground text-center">
                 This entry is locked to preserve your emotional history 💛
                  </p>
               )}

            <Button
               onClick={handleSave}
               className="w-full rounded-full"
               disabled={
               !selectedDate ||
               selectedMoods.length === 0 ||
               isFutureDate(selectedDate) ||
             (isPastDate(selectedDate) && moodEntries.some(e => e.date === selectedDate))
                         }
               >
                   Save Entry
              </Button>
          </div>
        </DialogContent>
      </Dialog>

      <MaaMindChatbot />
    </div>
  );
};

export default MoodCalendar;