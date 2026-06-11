import { Leaf, Volume2, ChevronRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const wisdomCards = [
  {
    title: "Ginger Tea for Nausea",
    traditional: "Adrak wali chai has been used for generations to ease morning sickness and calm the stomach.",
    scientific: "Gingerol compounds inhibit 5-HT3 serotonin receptors in the gut, reducing nausea signals sent to the brain.",
    region: "North India",
    stage: "Pregnancy",
  },
  {
    title: "Coconut Oil Malish",
    traditional: "Warm coconut oil massage is a daily postpartum ritual in coastal Karnataka to restore the mother's strength.",
    scientific: "Lauric acid in coconut oil has antimicrobial properties; massage stimulates oxytocin release and reduces cortisol.",
    region: "Karnataka",
    stage: "Postpartum",
  },
  {
    title: "Methi Ladoo for Lactation",
    traditional: "Fenugreek laddoos are prepared by grandmothers in Punjab specifically for new nursing mothers.",
    scientific: "Diosgenin in fenugreek mimics estrogen and may upregulate prolactin; seeds also provide iron, magnesium and fiber.",
    region: "Punjab",
    stage: "Postpartum",
  },
];

const GrandmaWisdomPreview = () => {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-start gap-12">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sage/20 text-sage text-sm font-medium mb-6">
              <Leaf className="w-4 h-4" />
              <span>Traditional Meets Modern</span>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
              Grandma's <span className="text-gradient">Wisdom</span>
            </h2>

            <p className="text-muted-foreground text-lg mb-4 max-w-md">
              Indigenous maternal practices — specific to your region — paired with real scientific explanations. Not generic advice, but the wisdom of your land.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium mb-8">
              <Sparkles className="w-3 h-3" />
              AI-curated per region & stage
            </div>

            <br />

            <Link to="/grandma-wisdom">
              <Button variant="outline" className="rounded-full gap-2">
                Explore All Tips
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

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
                    <button className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors shrink-0">
                      <Volume2 className="w-4 h-4 text-primary" />
                    </button>
                  </div>
                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">Traditional: </span>
                      {card.traditional}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium text-primary">Scientific: </span>
                      {card.scientific}
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