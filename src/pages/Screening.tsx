import MaaMindChatbot from "@/components/chat/MaaMindChatbot";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { ArrowLeft, ArrowRight, Brain, CheckCircle, Heart } from "lucide-react";
import { useState } from "react";

interface Question {
  id: number;
  text: string;
  type: "PHQ9" | "EPDS";
}

const questions: Question[] = [
  { id: 1, text: "Little interest or pleasure in doing things",              type: "PHQ9" },
  { id: 2, text: "Feeling down, depressed, or hopeless",                     type: "PHQ9" },
  { id: 3, text: "Trouble falling or staying asleep, or sleeping too much",  type: "PHQ9" },
  { id: 4, text: "Feeling tired or having little energy",                    type: "PHQ9" },
  { id: 5, text: "Poor appetite or overeating",                              type: "PHQ9" },
  { id: 6, text: "I have looked forward with enjoyment to things.",          type: "EPDS" },
  { id: 7, text: "I have blamed myself unnecessarily when things went wrong.", type: "EPDS" },
  { id: 8, text: "I have felt scared or panicky for no very good reason.",   type: "EPDS" },
  { id: 9, text: "I have been so unhappy that I have been crying.",          type: "EPDS" },
];

const answerOptions = [
  { value: 0, label: "Not at all",              emoji: "😊" },
  { value: 1, label: "Several days",            emoji: "😐" },
  { value: 2, label: "More than half the days", emoji: "😔" },
  { value: 3, label: "Nearly every day",        emoji: "😢" },
];

// ─── Score helpers (used internally + for Firestore, never shown to user) ────
const getTotalScore = (answers: Record<number, number>) =>
  Object.values(answers).reduce((sum, val) => sum + val, 0);

const getLevel = (score: number) => {
  if (score <= 4)  return "Minimal";
  if (score <= 9)  return "Mild";
  if (score <= 14) return "Moderate";
  return "Moderately Severe";
};

// ─── What the USER sees — gentle, no numbers ─────────────────────────────────
const getUserMessage = (score: number) => {
  if (score <= 4) return {
    headline:  "You're doing beautifully 🌸",
    body:      "Your responses suggest you're managing well. Keep nourishing yourself with rest, connection, and small joys.",
    icon:      CheckCircle,
    bgColor:   "bg-mood-happy/20",
    iconColor: "text-mood-happy",
  };
  if (score <= 9) return {
    headline:  "You're doing okay, mama 💛",
    body:      "Some days feel heavier than others — that's completely normal. Keep checking in with yourself and reach out if things shift.",
    icon:      CheckCircle,
    bgColor:   "bg-mood-calm/20",
    iconColor: "text-mood-calm",
  };
  if (score <= 14) return {
    headline:  "It's okay to not be okay 🤍",
    body:      "You may be carrying more than usual right now — emotionally or physically. You deserve support. Consider talking to someone you trust, or let MaaMind be here for you today.",
    icon:      Heart,
    bgColor:   "bg-mood-anxious/20",
    iconColor: "text-mood-anxious",
  };
  return {
    headline:  "You are seen and you are not alone 💜",
    body:      "Your responses suggest you may be going through a really difficult time. Please be gentle with yourself. Reaching out — to a friend, a doctor, or MaaMind — is a brave and important step.",
    icon:      Heart,
    bgColor:   "bg-mood-sad/20",
    iconColor: "text-mood-sad",
  };
};

// ─── Component ────────────────────────────────────────────────────────────────
const Screening = () => {
  const { user } = useAuth();

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers,         setAnswers]         = useState<Record<number, number>>({});
  const [isComplete,      setIsComplete]      = useState(false);
  const [hasStarted,      setHasStarted]      = useState(false);
  const [isSaving,        setIsSaving]        = useState(false);

  const progress = (Object.keys(answers).length / questions.length) * 100;

  const handleAnswer = (value: number) => {
    setAnswers((prev) => ({ ...prev, [questions[currentQuestion].id]: value }));
  };
  const getRiskLevel = (score: number): "low" | "medium" | "high" => {
  if (score <= 9)  return "low";
  if (score
 <= 14) return "medium";
  return "high";
};

const saveToFirestore = async (finalAnswers: Record<number, number>) => {
  if (!user) return;
  const score     = getTotalScore(finalAnswers);
  const level     = getLevel(score);       // "Minimal/Mild/Moderate" — kept for your own reference
  const riskLevel = getRiskLevel(score);   // "low/medium/high" — for admin dashboard

  try {
    await addDoc(
      collection(db, "assessmentScores"),  // ✅ top-level collection
      {
        userId:      user.uid,
        userEmail:   user.email,
        score,                             // stored in Firestore, never shown to user
        level,                             // human-readable label
        riskLevel,                         // ✅ what admin dashboard reads
        answers:     finalAnswers,
        type:        "PHQ9+EPDS",
        completedAt: serverTimestamp(),
      }
    );
    console.log("Screening result saved ✅");
  } catch (err) {
    console.error("Failed to save screening result:", err);
  }
};

  // ─── Save to Firestore (score hidden from user, visible to admin) ───────────

  const handleNext = async () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Last question — save silently then show completion screen
      setIsSaving(true);
      await saveToFirestore(answers);
      setIsSaving(false);
      setIsComplete(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) setCurrentQuestion(currentQuestion - 1);
  };

  // ─── Start screen ────────────────────────────────────────────────────────────
  if (!hasStarted) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 pt-24 pb-12 max-w-2xl">
          <div className="card-elevated p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-mood-calm/20 flex items-center justify-center mx-auto mb-6">
              <Brain className="w-8 h-8 text-mood-calm" />
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold mb-4">
              Mental Health Check-In
            </h1>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              This quick screening helps us understand how you're feeling.
              Your responses are private and help us provide better support.
            </p>

            <div className="p-4 rounded-xl bg-muted/50 border border-border mb-8 text-left">
              <h3 className="font-medium mb-2">What to expect:</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• {questions.length} simple questions</li>
                <li>• Takes about 2–3 minutes</li>
                <li>• Based on validated PHQ-9 &amp; EPDS assessments</li>
                <li>• Your data is kept secure and private</li>
              </ul>
            </div>

            <Button onClick={() => setHasStarted(true)} className="rounded-full gap-2 px-8">
              Begin Screening
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </main>
        <MaaMindChatbot />
      </div>
    );
  }

  // ─── Completion screen — gentle message ONLY, no score shown ────────────────
  if (isComplete) {
    const score   = getTotalScore(answers);
    const message = getUserMessage(score);
    const Icon    = message.icon;

    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 pt-24 pb-12 max-w-2xl">
          <div className="card-elevated p-8 text-center">

            <div className={`w-16 h-16 rounded-full ${message.bgColor} flex items-center justify-center mx-auto mb-6`}>
              <Icon className={`w-8 h-8 ${message.iconColor}`} />
            </div>

            <h1 className="font-display text-2xl sm:text-3xl font-bold mb-2">
              Check-In Complete
            </h1>
            <p className="text-muted-foreground mb-8">
              Thank you for taking a moment for yourself today 🌸
            </p>

            {/* Gentle message — NO score number shown to user */}
            <div className={`p-6 rounded-2xl ${message.bgColor} mb-8 text-left`}>
              <div className="flex items-start gap-3">
                <Heart className={`w-5 h-5 ${message.iconColor} mt-0.5 shrink-0`} />
                <div>
                  <h3 className="font-semibold mb-2">{message.headline}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {message.body}
                  </p>
                </div>
              </div>
            </div>

            {/* Suggestions */}
            <div className="p-4 rounded-xl bg-muted/50 border border-border mb-8 text-left">
              <h3 className="font-medium mb-2 text-sm">Things that might help today:</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>🌿 Step outside for 5 minutes of fresh air</li>
                <li>💧 Drink a glass of water slowly</li>
                <li>🤲 Talk to MaaMind if something is weighing on you</li>
                <li>📞 Call your emergency contact if you need support</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                variant="outline"
                onClick={() => {
                  setIsComplete(false);
                  setHasStarted(false);
                  setCurrentQuestion(0);
                  setAnswers({});
                }}
                className="rounded-full"
              >
                Take Again
              </Button>
              <Button className="rounded-full gap-2">
                Talk to MaaMind
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>

          </div>
        </main>
        <MaaMindChatbot />
      </div>
    );
  }

  // ─── Question screen ─────────────────────────────────────────────────────────
  const question      = questions[currentQuestion];
  const currentAnswer = answers[question.id];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 pt-24 pb-12 max-w-2xl">

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <span className="font-medium text-primary">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question card */}
        <div className="card-elevated p-8">
          <div className="mb-2">
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${
              question.type === "PHQ9"
                ? "bg-mood-calm/20 text-mood-calm"
                : "bg-mood-anxious/20 text-mood-anxious"
            }`}>
              {question.type === "PHQ9" ? "Mood" : "Anxiety"}
            </span>
          </div>

          <h2 className="font-display text-xl font-bold mb-2">
            Over the last 2 weeks, how often have you been bothered by:
          </h2>
          <p className="text-lg text-foreground mb-8">{question.text}</p>

          <RadioGroup
            value={currentAnswer?.toString()}
            onValueChange={(value) => handleAnswer(parseInt(value))}
            className="space-y-3"
          >
            {answerOptions.map((option) => (
              <label
                key={option.value}
                className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  currentAnswer === option.value
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <RadioGroupItem value={option.value.toString()} id={`option-${option.value}`} />
                <span className="text-2xl">{option.emoji}</span>
                <span className="font-medium">{option.label}</span>
              </label>
            ))}
          </RadioGroup>

          {/* Navigation */}
          <div className="flex gap-3 mt-8">
            {currentQuestion > 0 && (
              <Button
                variant="outline"
                onClick={handlePrevious}
                className="rounded-full gap-2"
                disabled={isSaving}
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </Button>
            )}
            <Button
              onClick={handleNext}
              className="flex-1 rounded-full gap-2"
              disabled={currentAnswer === undefined || isSaving}
            >
              {isSaving
                ? "Saving..."
                : currentQuestion === questions.length - 1
                ? "Complete"
                : "Next"}
              {!isSaving && <ArrowRight className="w-4 h-4" />}
            </Button>
          </div>
        </div>

      </main>

      <MaaMindChatbot />
    </div>
  );
};

export default Screening;