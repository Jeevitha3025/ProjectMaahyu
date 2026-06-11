import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

const Index = () => {
  return (
    <div className="min-h-screen hero-gradient flex flex-col items-center justify-center text-center px-4">
      <img src={logo} alt="Maahyu" className="h-24 w-auto mb-6" />
      <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
        Welcome to Maahyu
      </h1>
      <p className="text-muted-foreground text-lg max-w-md mb-10">
        Your AI-powered maternal wellness companion. Nurturing every mother's journey with care, wisdom, and support.
      </p>
      <Link to="/auth">
        <Button className="rounded-full px-10 py-6 text-lg font-semibold bg-primary hover:bg-primary/90 shadow-lg">
          Start Your Journey 🌸
        </Button>
      </Link>
    </div>
  );
};

export default Index;