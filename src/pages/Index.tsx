import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import Features from "@/components/home/Features";
import GrandmaWisdomPreview from "@/components/home/GrandmaWisdomPreview";
import CTA from "@/components/home/CTA";
import Footer from "@/components/layout/Footer";
import MaaMindChatbot from "@/components/chat/MaaMindChatbot";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Features />
      <GrandmaWisdomPreview />
      <CTA />
      <Footer />
      <MaaMindChatbot />
    </div>
  );
};

export default Index;
