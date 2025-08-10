import React, { useState, useEffect } from "react";
import LeftPane from "./LeftPane";
import CodePane from "./CodePane";
import { useHorizontalResize } from "./useHorizontalResize";
import { Challenge } from "@/contexts/ChallengesContext";
import { submissionService, FirestoreSubmission } from "@/lib/firestore";
import { useAuth } from "@/contexts/AuthContext";
import { useSubmissions } from "@/hooks/useSubmissions";

interface ChallengePageProps {
  challenge: Challenge;
}

const MIN_LEFT = 280;
const MAX_LEFT = 900;

const ChallengePage = ({ challenge }: ChallengePageProps) => {
  const { user } = useAuth();
  const [code, setCode] = useState(challenge.starterCode);
  const [latestSubmission, setLatestSubmission] =
    useState<FirestoreSubmission | null>(null);
  const [userSubmissions, setUserSubmissions] = useState<FirestoreSubmission[]>(
    []
  );
  const [activeLeftTab, setActiveLeftTab] = useState("description");
  const { submissions, getChallengeSubmissions } = useSubmissions();
  console.log("submissions", submissions);
  useEffect(() => {
    if (challenge?.id) {
      console.log("fetching with challenge.id", challenge.id);
      getChallengeSubmissions(challenge.id);
    }
  }, [challenge?.id]);

  useEffect(() => {
    const fetchUserSubmissions = async () => {
      if (user && challenge.id) {
        const subs = await submissionService.getUserSubmissionsForChallenge(
          user.id,
          challenge.id
        );
        setUserSubmissions(subs);
        if (subs.length > 0) {
          setCode(subs[0].code);
          setLatestSubmission(subs[0]);
        }
      }
    };
    fetchUserSubmissions();
  }, [user, challenge.id]);

  const { leftWidth, handleMouseDown, containerRef } = useHorizontalResize({
    minPx: MIN_LEFT,
    maxPx: MAX_LEFT,
    initialPercent: 0.5,
  });

  const { createSubmission } = useSubmissions();

  const handleSubmission = async (
    submissionData: Omit<FirestoreSubmission, "id" | "submittedAt" | "points">
  ) => {
    if (!user) return;

    try {
      await createSubmission(submissionData);

      // After submission, refetch user submissions to update the result tab
      const updatedUserSubmissions =
        await submissionService.getUserSubmissionsForChallenge(
          user.id,
          challenge.id
        );
      setUserSubmissions(updatedUserSubmissions);
      if (updatedUserSubmissions.length > 0) {
        setLatestSubmission(updatedUserSubmissions[0]);
      }

      // Also refetch all challenge submissions to update the count
      getChallengeSubmissions(challenge.id);
      setActiveLeftTab("result");
    } catch (error) {
      console.error("Failed to handle submission:", error);
      // Optionally, show an error message to the user
    }
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen h-[93vh] bg-background overflow-hidden flex flex-col"
    >
      <div className="flex-1 flex flex-row h-full w-full">
        {/* Left Pane */}
        <div
          style={{ width: `calc(${leftWidth * 100}% - 4px)` }}
          className="h-full min-w-[280px] max-w-[900px] transition-all duration-100 ease-linear"
        >
          <LeftPane
            challenge={challenge}
            latestSubmission={latestSubmission}
            userSubmissions={userSubmissions}
            totalSubmissionsCount={submissions.length}
            activeTab={activeLeftTab}
            onTabChange={setActiveLeftTab}
          />
        </div>
        {/* Resize handle */}
        <div
          onMouseDown={handleMouseDown}
          className="w-2 cursor-col-resize bg-border hover:bg-primary transition"
          style={{ zIndex: 20 }}
        />
        {/* Right: Code Pane */}
        <div style={{ flex: 1 }} className="h-full min-w-[200px]">
          <CodePane
            challenge={challenge}
            code={code}
            onCodeChange={setCode}
            onSubmit={handleSubmission}
          />
        </div>
      </div>
    </div>
  );
};

export default ChallengePage;
