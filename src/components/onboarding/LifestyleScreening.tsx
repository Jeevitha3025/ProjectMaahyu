import { useEffect, useState } from "react";

interface Option {
  label: string;
  value: string;
  img: string;
}

interface Step {
  id: string;
  question: string;
  options: Option[];
}

const quizSteps: Step[] = [
  {
    id: "activity",
    question: "What takes up most of your day?",
    options: [
      { label: "Homemaker", value: "homemaker", img: "https://cdn-icons-png.flaticon.com/512/610/610333.png" },
      { label: "Professional", value: "professional", img: "https://cdn-icons-png.flaticon.com/512/3281/3281289.png" },
      { label: "Student", value: "student", img: "https://cdn-icons-png.flaticon.com/512/201/201614.png" },
    ],
  },
  {
    id: "support",
    question: "Who is in your home circle?",
    options: [
      { label: "Joint Family", value: "joint_family", img: "https://cdn-icons-png.flaticon.com/512/1531/1531121.png" },
      { label: "Nuclear", value: "nuclear_family", img: "https://cdn-icons-png.flaticon.com/512/432/432312.png" },
      { label: "Single Mom", value: "single_mom", img: "https://cdn-icons-png.flaticon.com/512/1261/1261452.png" },
    ],
  },
  {
    id: "mood",
    question: "How has your heart been feeling lately?",
    options: [
      { label: "Sunny", value: "mood_good", img: "https://cdn-icons-png.flaticon.com/512/869/869869.png" },
      { label: "Cloudy", value: "mood_neutral", img: "https://cdn-icons-png.flaticon.com/512/414/414927.png" },
      { label: "Rainy", value: "mood_low", img: "https://cdn-icons-png.flaticon.com/512/1146/1146860.png" },
    ],
  },
];

const LifestyleScreening = ({
  onComplete,
}: {
  onComplete: (tags: string[]) => void;
}) => {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);

  useEffect(() => {
    const step = quizSteps[current];
    if (step) {
      const speech = new SpeechSynthesisUtterance(step.question);
      window.speechSynthesis.speak(speech);
    }
  }, [current]);

  const handleSelect = (value: string) => {
    const updated = [...answers, value];
    setAnswers(updated);

    if (current < quizSteps.length - 1) {
      setCurrent(current + 1);
    } else {
      onComplete(updated);
    }
  };

  const step = quizSteps[current];

  return (
    <div className="text-center space-y-6 animate-fade-in">
      <h2 className="font-display text-xl font-bold">{step.question}</h2>

      <div className="grid grid-cols-3 gap-4 mt-6">
        {step.options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => handleSelect(opt.value)}
            className="border-2 border-border rounded-xl p-4 hover:border-primary transition-all"
          >
            <img src={opt.img} alt={opt.label} className="w-16 h-16 mx-auto mb-2" />
            <p className="font-medium">{opt.label}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default LifestyleScreening;
