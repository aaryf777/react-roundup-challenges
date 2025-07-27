import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import Header from "@/components/Header";
import Index from "@/pages/Index";
import Leaderboard from "@/pages/Leaderboard";
import Register from "@/pages/Register";
import Login from "@/pages/Login";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/NotFound";
import ProtectedRoute from "@/components/ProtectedRoute";
import ChallengePageContainer from "@/pages/ChallengePage";

const AppRouter = () => (
  <Router>
    <TooltipProvider>
      <Header />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route
          path="/challenge/:id"
          element={
            <ProtectedRoute>
              <ChallengePageContainer />
            </ProtectedRoute>
          }
        />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
      <Sonner />
    </TooltipProvider>
  </Router>
);

export default AppRouter;
