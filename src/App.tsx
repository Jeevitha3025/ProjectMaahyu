import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import MoodCalendar from "./pages/MoodCalendar";
import GrandmaWisdom from "./pages/GrandmaWisdom";
import Screening from "./pages/Screening";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const isLoggedIn = localStorage.getItem("maahyu-auth") === "true";

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* HOME */}
            <Route path="/" element={<Index />} />

            {/* AUTH */}
            <Route
              path="/auth"
              element={isLoggedIn ? <Navigate to="/dashboard" /> : <Auth />}
            />

            {/* ONBOARDING (PUBLIC) */}
            <Route path="/onboarding" element={<Onboarding />} />

            {/* PROTECTED */}
            <Route
              path="/dashboard"
              element={isLoggedIn ? <Dashboard /> : <Navigate to="/auth" />}
            />

            <Route
              path="/mood-calendar"
              element={isLoggedIn ? <MoodCalendar /> : <Navigate to="/auth" />}
            />

            <Route
              path="/grandma-wisdom"
              element={isLoggedIn ? <GrandmaWisdom /> : <Navigate to="/auth" />}
            />

            <Route
              path="/screening"
              element={isLoggedIn ? <Screening /> : <Navigate to="/auth" />}
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
