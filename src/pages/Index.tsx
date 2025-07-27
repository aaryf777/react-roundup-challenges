import { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import HeroSection from "@/components/challenge/HeroSection";
import ChallengesSection from "@/components/challenge/ChallengesSection";
import { useAuth } from "@/contexts/AuthContext";
import { useChallenges } from "@/contexts/ChallengesContext";

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { visibleChallenges, dispatch } = useChallenges();
  const challengesSectionRef = useRef<HTMLDivElement>(null);

  // Set the ref in the context when component mounts
  useEffect(() => {
    dispatch({
      type: "SET_CHALLENGES_SECTION_REF",
      payload: challengesSectionRef,
    });
  }, [dispatch]);

  const handleChallengeClick = (challengeId: string) => {
    navigate(`/challenge/${challengeId}`);
  };

  const handleStartCoding = () => {
    const firstChallenge = visibleChallenges[0];
    const challengeId = firstChallenge
      ? `${firstChallenge.title.toLowerCase().replace(/\s+/g, "-")}`
      : null;
    if (isAuthenticated) {
      if (challengeId) {
        navigate(`/challenge/${challengeId}`);
      }
    } else {
      navigate("/login", {
        state: { from: { pathname: `/challenge/${challengeId}` } },
      });
    }
  };

  const handleBrowseChallenges = () => {
    if (challengesSectionRef.current) {
      challengesSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleLoadMore = () => {
    dispatch({ type: "LOAD_MORE_CHALLENGES" });
  };

  return (
    <div className="min-h-screen bg-background">
      <HeroSection
        onStartCoding={handleStartCoding}
        onBrowseChallenges={handleBrowseChallenges}
      />
      <div ref={challengesSectionRef}>
        <ChallengesSection
          onChallengeClick={handleChallengeClick}
          onLoadMore={handleLoadMore}
        />
      </div>
    </div>
  );
};

export default Index;
