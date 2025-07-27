import React from "react";
import ChallengeDescription from "./ChallengeDescription";
import ChallengeEditor from "./ChallengeEditor";
import { useHorizontalResize } from "./useHorizontalResize";

interface ChallengePageProps {
  challenge: {
    id: string;
    title: string;
    description: string;
    content: string;
    hints: string[];
    difficulty: "easy" | "medium" | "hard";
    category: string;
    timeEstimate: string;
    solvedBy: number;
    points: number;
    tags: string[];
    companies: string[];
  };
  initialCode: string;
  functionName: string;
  testCases: { input: any[]; expected: any; description: string }[];
  onSubmitSolution: () => void;
}

const MIN_LEFT = 280;
const MAX_LEFT = 900;

const ChallengePage = ({
  challenge,
  initialCode,
  functionName,
  testCases,
  onSubmitSolution,
}: ChallengePageProps) => {
  const { leftWidth, handleMouseDown, containerRef } = useHorizontalResize({
    minPx: MIN_LEFT,
    maxPx: MAX_LEFT,
    initialPercent: 0.5,
  });

  return (
    <div
      ref={containerRef}
      className="min-h-screen h-[93vh] bg-background overflow-hidden flex flex-col"
    >
      <div className="flex-1 flex flex-row h-full w-full">
        {/* Left: Challenge Description */}
        <div
          style={{ width: `calc(${leftWidth * 100}% - 4px)` }}
          className="h-full min-w-[280px] max-w-[900px] transition-all duration-100 ease-linear"
        >
          <ChallengeDescription challenge={challenge} />
        </div>
        {/* Resize handle */}
        <div
          onMouseDown={handleMouseDown}
          className="w-2 cursor-col-resize bg-border hover:bg-primary transition"
          style={{ zIndex: 20 }}
        />
        {/* Right: Code Editor */}
        <div style={{ flex: 1 }} className="h-full min-w-[200px]">
          <ChallengeEditor
            initialCode={initialCode}
            functionName={functionName}
            testCases={testCases}
            onSubmitSolution={onSubmitSolution}
          />
        </div>
      </div>
    </div>
  );
};

export default ChallengePage;
