import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { AuthProvider, useAuth } from "@/context/AuthContext";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import GrandmaWisdom from "./pages/GrandmaWisdom";
import Index from "./pages/Index";
import MaaGang from "./pages/MaaGang";
import MaaWrapped from "./pages/MaaWrapped";
import MoodCalendar from "./pages/MoodCalendar";
import Onboarding from "./pages/Onboarding";
import Screening from "./pages/Screening";
import Index from "./pages/Index";
import GrandmaWisdom from "./pages/GrandmaWisdom";
import SecurityPolicy from "./pages/SecurityPolicy";
const queryClient = new QueryClient();

const LoadingScreen = () => (
  <div className="flex h-screen w-screen flex-col items-center justify-center bg-rose-50">
    <div className="text-5xl mb-4">🌸</div>
    <p className="text-rose-400 font-medium text-sm">Loading Maahyu...</p>
  </div>
);

// Replace AppRoutes with this:
const AppRoutes = () => {
  const { user, userProfile, loading } = useAuth();

  if (loading) return <LoadingScreen />;

  // Helper — logged in but onboarding not done
  const needsOnboarding = user && userProfile && !userProfile.onboardingComplete;
  // Helper — logged in and onboarding done
  const isReady = user && userProfile?.onboardingComplete;

  return (
    <Routes>
      <Route path="/" element={<Index />} />

      <Route path="/auth"
        element={user ? <Navigate to="/dashboard" replace /> : <Auth />} />

      {/* Onboarding — logged in but not complete */}
      <Route path="/onboarding"
        element={user ? <Onboarding /> : <Navigate to="/auth" replace />} />

      {/* All protected routes — redirect to onboarding if not complete */}
      <Route path="/dashboard"
        element={
          !user ? <Navigate to="/auth" replace />
          : needsOnboarding ? <Navigate to="/onboarding" replace />
          : <Dashboard />
        } />
      <Route path="/mood-calendar"
        element={
          !user ? <Navigate to="/auth" replace />
          : needsOnboarding ? <Navigate to="/onboarding" replace />
          : <MoodCalendar />
        } />
      <Route path="/grandma-wisdom"
        element={
          !user ? <Navigate to="/auth" replace />
          : needsOnboarding ? <Navigate to="/onboarding" replace />
          : <GrandmaWisdom />
        } />
      <Route path="/screening"
        element={
          !user ? <Navigate to="/auth" replace />
          : needsOnboarding ? <Navigate to="/onboarding" replace />
          : <Screening />
        } />
        <Route path="/maagang"
        element={user ? <MaaGang /> : <Navigate to="/auth" replace />}
      />
      <Route path="/maawrapped"
        element={
          !user ? <Navigate to="/auth" replace />
          : needsOnboarding ? <Navigate to="/onboarding" replace />
          : <MaaWrapped />
        } />
=======
      <Route path="/security-policy" element={<SecurityPolicy />} />
>>>>>>> 0df3a4d4419e5583363e4d634e2b102c8649b9d5

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