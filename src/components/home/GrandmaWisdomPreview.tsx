import { Leaf, Volume2, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const wisdomCards = [
  {
    title: "Ginger Tea for Nausea",
    traditional: "Adrak wali chai has been used for generations to ease morning sickness.",
    scientific: "Gingerol compounds reduce nausea by affecting the digestive system and blocking serotonin receptors.",
    region: "North India",
    stage: "Pregnancy",
  },
  {
    title: "Ajwain Water for Digestion",
    traditional: "Mothers have always given ajwain water post-delivery for digestive comfort.",
    scientific: "Thymol in carom seeds has carminative properties that reduce bloating and gas.",
    region: "Pan-India",
    stage: "Postpartum",
  },
  {
    title: "Saffron Milk Tradition",
    traditional: "Kesar doodh is believed to give the baby a fair complexion and calm the mother.",
    scientific: "Saffron contains crocin which may have mood-enhancing and anti-anxiety properties.",
    region: "North India",
    stage: "Pregnancy",
  },
];

const GrandmaWisdomPreview = () => {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-start gap-12">
          {/* Content */}
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sage/20 text-sage text-sm font-medium mb-6">
              <Leaf className="w-4 h-4" />
              <span>Traditional Meets Modern</span>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
              Grandma's <span className="text-gradient">Wisdom</span>
            </h2>

            <p className="text-muted-foreground text-lg mb-8 max-w-md">
              Bridge traditional knowledge with evidence-based healthcare. Each tip comes with scientific backing, tailored to your region and motherhood phase.
            </p>

            <Link to="/grandma-wisdom">
              <Button variant="outline" className="rounded-full gap-2">
                Explore All Tips
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {/* Cards */}
          <div className="flex-1 w-full">
            <div className="flex flex-col gap-4">
              {wisdomCards.map((card, index) => (
                <div
                  key={card.title}
                  className="card-glow p-5 animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-display font-bold text-lg">{card.title}</h3>
                    <button className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors">
                      <Volume2 className="w-4 h-4 text-primary" />
                    </button>
                  </div>

                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">Traditional:</span> {card.traditional}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium text-primary">Scientific:</span> {card.scientific}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <span className="px-3 py-1 rounded-full bg-muted text-xs font-medium">{card.region}</span>
                    <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">{card.stage}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GrandmaWisdomPreview;
