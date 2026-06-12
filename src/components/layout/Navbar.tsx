import logo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, userProfile, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/auth");
  };

  const navLinks = user
    ? [
        { name: "Dashboard",      path: "/dashboard" },
        { name: "Mood Calendar",  path: "/mood-calendar" },
        { name: "MaaWrapped",     path: "/maawrapped" },
        { name: "Grandma Wisdom", path: "/grandma-wisdom" },
        { name: "Screening",      path: "/screening" },
        { name: "MaaGang",        path: "/maagang" },
        { name: "Security Policy", path: "/security-policy" },
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

          {/* Desktop Nav Links */}
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

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                {/* ✅ Avatar button → goes to profile */}
                <Link
                  to="/profile"
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                  title="View profile"
                >
                
                  <Link
  to="/profile"
  className="flex items-center gap-2 hover:opacity-80 transition-opacity"
>
  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xl
    ${isActive("/profile")
      ? "bg-primary/20 ring-2 ring-primary"
      : "bg-primary/10 hover:bg-primary/20"} transition-colors`}>
    {userProfile?.avatar || "🌸"}
  </div>
  <span className="text-sm font-medium text-foreground">
    Hi, {userProfile?.name?.split(" ")[0] || user.displayName?.split(" ")[0] || "Mama"}
  </span>
</Link>
                </Link>

                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full gap-2"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link to="/auth">
                  <Button variant="ghost" className="rounded-full">Login</Button>
                </Link>
                <Link to="/auth">
                  <Button className="rounded-full bg-primary hover:bg-primary/90">Get Started</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Nav */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-in">
            <div className="flex flex-col gap-2">

              {/* ✅ Profile link in mobile menu */}
              {user && (
                <Link
                  to="/profile"
                  onClick={() => setIsOpen(false)}
                  className={`px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-3 transition-all
                    ${isActive("/profile")
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}
                >
                  <span className="text-xl">{userProfile?.avatar || "🌸"}</span>
                  My Profile
                </Link>
              )}

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

              {user ? (
                <Button
                  variant="outline"
                  className="w-full rounded-full gap-2 mt-4"
                  onClick={() => { handleLogout(); setIsOpen(false); }}
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </Button>
              ) : (
                <div className="flex gap-2 mt-4 pt-4 border-t border-border">
                  <Link to="/auth" className="flex-1" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full rounded-full">Login</Button>
                  </Link>
                  <Link to="/auth" className="flex-1" onClick={() => setIsOpen(false)}>
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