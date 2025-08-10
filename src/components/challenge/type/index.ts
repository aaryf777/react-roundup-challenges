// Centralized type definitions for the challenge components

import type { Challenge } from "@/contexts/ChallengesContext";

export type { Challenge };

export interface ChallengeDescriptionProps {
  challenge: Challenge;
  totalSubmissionsCount: number;
}

export interface ChallengeCardProps {
  title: string;
  instructions: string;
  difficulty: "easy" | "medium" | "hard";
  category: string;
  timeEstimate: number;
  submissions: number;
  points?: number;
  tags: string[];
  companies?: string[];
  onClick: () => void;
}

export interface ChallengeGridProps {
  visibleChallenges: Challenge[];
  handleChallengeClick: (challenge: Challenge) => void;
}

export interface ChallengesSectionProps {
  onChallengeClick: (challengeId: string) => void;
  onLoadMore: () => void;
}

// Export future types here as needed
