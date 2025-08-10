import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ChallengePage from "@/components/challenge";
import { challengeService } from "@/lib/firestore";
import { Challenge } from "@/contexts/ChallengesContext";

const ChallengePageContainer = () => {
  const { id } = useParams<{ id: string }>();
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChallenge = async () => {
      if (!id) return;
      try {
        setLoading(true);
        console.log("id", id);

        const challengeData = await challengeService.getChallenge(id);
        if (challengeData) {
          const functionNameMatch = (challengeData.starterCode || "").match(
            /function\s+([a-zA-Z0-9_]+)\s*\(/
          );
          const functionName = functionNameMatch ? functionNameMatch[1] : "";

          const transformedChallenge = {
            ...challengeData,
            timeEstimate: challengeData.estimatedTime,
            solvedBy: challengeData.completions,
            companies: challengeData.companyTags,
            content: challengeData.description,
            hints: [],
            functionName,
            testCases:
              challengeData.testRunner === "memoize"
                ? challengeData.testCases
                : challengeData.testCases,
            testRunner: challengeData.testRunner, // Ensure this is passed through
          };
          setChallenge(transformedChallenge as Challenge);
        } else {
          console.error("Challenge not found");
        }
      } catch (error) {
        console.error("Error fetching challenge:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChallenge();
  }, [id]);
  console.log("challenge", challenge);
  if (loading) {
    return <div>Loading...</div>;
  }

  if (!challenge) {
    return <div>Challenge not found!</div>;
  }

  return <ChallengePage challenge={challenge} />;
};

export default ChallengePageContainer;
