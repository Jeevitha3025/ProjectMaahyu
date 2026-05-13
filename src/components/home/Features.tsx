import { Calendar, MessageCircle, Brain, Heart, Shield, Sparkles } from "lucide-react";

const features = [
  {
    icon: Calendar,
    title: "Mood Calendar",
    description: "Track your daily emotions with emoji-based entries. Visualize patterns and get personalized insights.",
    color: "bg-mood-happy/20 text-mood-happy",
  },
  {
    icon: MessageCircle,
    title: "sHero Chatbot",
    description: "Your 24/7 empathetic AI companion offering emotional support with culturally-sensitive guidance.",
    color: "bg-primary/20 text-primary",
  },
  {
    icon: Brain,
    title: "Mental Health Screening",
    description: "Adapted GAD-7 & PHQ-9 assessments designed for mothers, with early risk detection.",
    color: "bg-mood-calm/20 text-mood-calm",
  },
  {
    icon: Heart,
    title: "Grandma Wisdom",
    description: "Traditional health tips paired with scientific explanations, tailored to your region and stage.",
    color: "bg-secondary/20 text-secondary",
  },
  {
    icon: Sparkles,
    title: "Maa Wrapped",
    description: "Weekly and monthly emotional summaries with improvement tracking and personalized insights.",
    color: "bg-gold/20 text-gold",
  },
  {
    icon: Shield,
    title: "Privacy First",
    description: "Healthcare-grade encryption, role-based access, and ethical AI with human oversight.",
    color: "bg-sage/20 text-sage",
  },
];

const Features = () => {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
            Comprehensive Care for{" "}
            <span className="text-gradient">Every Stage</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            From pregnancy to toddler care, Maahyu supports you with intelligent, compassionate features.
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
  );
};

export default Features;
