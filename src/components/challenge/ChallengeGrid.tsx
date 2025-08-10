import ChallengeCard from "./ChallengeCard";
import type { ChallengeGridProps } from "./type";

const ChallengeGrid = ({
  visibleChallenges,
  handleChallengeClick,
}: ChallengeGridProps) => (
  <div className="grid md:grid-cols-2 gap-6">
    {visibleChallenges.map((challenge, index) => (
      <div
        key={index}
        className="animate-fade-in"
        style={{ animationDelay: `${index * 0.1}s` }}
      >
        <ChallengeCard
          key={challenge.id}
          {...challenge}
          onClick={() => handleChallengeClick(challenge)}
        />
      </div>
    ))}
  </div>
);

export default ChallengeGrid;
