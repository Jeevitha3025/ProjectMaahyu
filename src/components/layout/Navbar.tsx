import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
   const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

 const navLinks = isLoggedIn
  ? [
      { name: "Dashboard", path: "/dashboard" },
      { name: "Mood Calendar", path: "/mood-calendar" },
      { name: "Grandma Wisdom", path: "/grandma-wisdom" },
      { name: "Screening", path: "/screening" },
    ]
  : [{ name: "Home", path: "/" }];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="Maahyu" className="h-10 w-auto" />
            <span className="font-display font-bold text-xl text-primary">maahyu</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  isActive(link.path)
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
         <div className="hidden md:flex items-center gap-3">
  {!isLoggedIn ? (
    <>
      <Link to="/auth">
        <Button variant="ghost" className="rounded-full">
          Login
        </Button>
      </Link>
      <Link to="/onboarding">
        <Button className="rounded-full bg-primary hover:bg-primary/90">
          Get Started
        </Button>
      </Link>
    </>
  ) : (
    <span className="text-sm font-medium text-foreground">
      Hi, {localStorage.getItem("userName") || "User"}
    </span>
  )}
</div>


          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-in">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive(link.path)
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              {!isLoggedIn && (
  <div className="flex gap-2 mt-4 pt-4 border-t border-border">
    <Link to="/auth" className="flex-1" onClick={() => setIsOpen(false)}>
      <Button variant="outline" className="w-full rounded-full">
        Login
      </Button>
    </Link>
    <Link to="/onboarding" className="flex-1" onClick={() => setIsOpen(false)}>
      <Button className="w-full rounded-full">Get Started</Button>
    </Link>
  </div>
)}

            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
