import { useState } from "react";
import { ArrowRight, ArrowLeft, Brain, CheckCircle, AlertTriangle, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import Navbar from "@/components/layout/Navbar";
import MaaMindChatbot from "@/components/chat/MaaMindChatbot";

interface Question {
  id: number;
  text: string;
  type: "PHQ9" | "EPDS";
}

const questions: Question[] = [
  { id: 1, text: "Little interest or pleasure in doing things", type: "PHQ9" },
  { id: 2, text: "Feeling down, depressed, or hopeless", type: "PHQ9" },
  { id: 3, text: "Trouble falling or staying asleep, or sleeping too much", type: "PHQ9" },
  { id: 4, text: "Feeling tired or having little energy", type: "PHQ9" },
  { id: 5, text: "Poor appetite or overeating", type: "PHQ9" },
  { id: 6, text: "I have looked forward with enjoyment to things.", type: "EPDS" },
  { id: 7, text: "I have blamed myself unnecessarily when things went wrong.", type: "EPDS" },
  { id: 8, text: "I have felt scared or panicky for no very good reason.", type: "EPDS" },
  { id: 9, text: "I have been so unhappy that I have been crying.", type: "EPDS" },
];

const answerOptions = [
  { value: 0, label: "Not at all", emoji: "😊" },
  { value: 1, label: "Several days", emoji: "😐" },
  { value: 2, label: "More than half the days", emoji: "😔" },
  { value: 3, label: "Nearly every day", emoji: "😢" },
];

const Screening = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isComplete, setIsComplete] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const progress = ((Object.keys(answers).length) / questions.length) * 100;

  const handleAnswer = (value: number) => {
    setAnswers((prev) => ({ ...prev, [questions[currentQuestion].id]: value }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setIsComplete(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const getTotalScore = () => Object.values(answers).reduce((sum, val) => sum + val, 0);

  const getScoreInterpretation = () => {
    const score = getTotalScore();
    if (score <= 4) return { level: "Minimal", color: "text-mood-happy", bgColor: "bg-mood-happy/20", icon: CheckCircle };
    if (score <= 9) return { level: "Mild", color: "text-mood-calm", bgColor: "bg-mood-calm/20", icon: CheckCircle };
    if (score <= 14) return { level: "Moderate", color: "text-mood-anxious", bgColor: "bg-mood-anxious/20", icon: AlertTriangle };
    return { level: "Moderately Severe", color: "text-mood-sad", bgColor: "bg-mood-sad/20", icon: AlertTriangle };
  };

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
              This quick screening helps us understand how you're feeling. Your responses are private and help us provide better support.
            </p>

            <div className="p-4 rounded-xl bg-muted/50 border border-border mb-8 text-left">
              <h3 className="font-medium mb-2">What to expect:</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• {questions.length} simple questions</li>
                <li>• Takes about 2-3 minutes</li>
                <li>• Based on validated PHQ-9 & EPDS assessments</li>
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

  if (isComplete) {
    const interpretation = getScoreInterpretation();
    const score = getTotalScore();

    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 pt-24 pb-12 max-w-2xl">
          <div className="card-elevated p-8 text-center">
            <div className={`w-16 h-16 rounded-full ${interpretation.bgColor} flex items-center justify-center mx-auto mb-6`}>
              <interpretation.icon className={`w-8 h-8 ${interpretation.color}`} />
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold mb-2">
              Screening Complete
            </h1>
            <p className="text-muted-foreground mb-6">
              Thank you for completing the check-in
            </p>

            <div className={`p-6 rounded-2xl ${interpretation.bgColor} mb-8`}>
              <p className="text-sm text-muted-foreground mb-2">Your Score</p>
              <p className={`text-4xl font-bold ${interpretation.color} mb-2`}>{score}/27</p>
              <p className={`font-medium ${interpretation.color}`}>{interpretation.level} Symptoms</p>
            </div>

            <div className="p-4 rounded-xl bg-muted/50 border border-border mb-8 text-left">
              <div className="flex items-start gap-3">
                <Heart className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-medium mb-1">What this means</h3>
                  <p className="text-sm text-muted-foreground">
                    {score <= 9
                      ? "Your responses suggest you're managing well. Continue practicing self-care and reach out if things change."
                      : "Your responses suggest you may benefit from additional support. Consider speaking with a healthcare provider or counselor."}
                  </p>
                </div>
              </div>
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
                Talk to sHero
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </main>
        <MaaMindChatbot />
      </div>
    );
  }

  const question = questions[currentQuestion];
  const currentAnswer = answers[question.id];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 pt-24 pb-12 max-w-2xl">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">Question {currentQuestion + 1} of {questions.length}</span>
            <span className="font-medium text-primary">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <div className="card-elevated p-8">
          <div className="mb-2">
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${
              question.type === "PHQ9" ? "bg-mood-calm/20 text-mood-calm" : "bg-mood-anxious/20 text-mood-anxious"
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
              <Button variant="outline" onClick={handlePrevious} className="rounded-full gap-2">
                <ArrowLeft className="w-4 h-4" />
                Previous
              </Button>
            )}
            <Button
              onClick={handleNext}
              className="flex-1 rounded-full gap-2"
              disabled={currentAnswer === undefined}
            >
              {currentQuestion === questions.length - 1 ? "Complete" : "Next"}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </main>

      <MaaMindChatbot/>
    </div>
  );
};

export default Screening;
