import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

import { AuthProvider, useAuth } from "@/context/AuthContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import MoodCalendar from "./pages/MoodCalendar";
import GrandmaWisdom from "./pages/GrandmaWisdom";
import Screening from "./pages/Screening";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const LoadingScreen = () => (
  <div className="flex h-screen w-screen flex-col items-center justify-center bg-rose-50">
    <div className="text-5xl mb-4">🌸</div>
    <p className="text-rose-400 font-medium text-sm">Loading Maahyu...</p>
  </div>
);

const AppRoutes = () => {
  const { user, loading } = useAuth();

  // Single loading gate — nothing renders until Firebase resolves
  if (loading) return <LoadingScreen />;

  return (
    <Routes>
      {/* Homepage — always public */}
      <Route path="/" element={<Index />} />

      {/* Auth — if already logged in, skip to dashboard */}
      <Route path="/auth"
        element={user ? <Navigate to="/dashboard" replace /> : <Auth />} />

      {/* Onboarding — must be logged in */}
      <Route path="/onboarding"
        element={user ? <Onboarding /> : <Navigate to="/auth" replace />} />

      {/* Protected pages */}
      <Route path="/dashboard"
        element={user ? <Dashboard /> : <Navigate to="/auth" replace />} />
      <Route path="/mood-calendar"
        element={user ? <MoodCalendar /> : <Navigate to="/auth" replace />} />
      <Route path="/grandma-wisdom"
        element={user ? <GrandmaWisdom /> : <Navigate to="/auth" replace />} />
      <Route path="/screening"
        element={user ? <Screening /> : <Navigate to="/auth" replace />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;