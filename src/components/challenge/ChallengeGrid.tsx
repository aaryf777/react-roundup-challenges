import ChallengeCard from "./ChallengeCard";

interface ChallengeGridProps {
  visibleChallenges: any[];
  handleChallengeClick: (challengeId: string) => void;
}

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
          {...challenge}
          onClick={() =>
            handleChallengeClick(
              `${challenge.title.toLowerCase().replace(/\s+/g, "-")}`
            )
          }
        />
      </div>
    ))}
  </div>
);

export default ChallengeGrid;
