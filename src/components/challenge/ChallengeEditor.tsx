import { useState } from "react";
import CodeEditor from "./CodeEditor";
import { Challenge } from "../../contexts/ChallengesContext";

interface ChallengeEditorProps {
  challenge: Challenge;
}

const ChallengeEditor = ({ challenge }: ChallengeEditorProps) => {
  const [code, setCode] = useState(challenge.starterCode);

  const handleSubmitSolution = async (submission: any) => {
    // Handle solution submission to the backend
    console.log("Submitting solution...", submission);
    // Here you would typically call a service to save the submission
  };

  return (
    <div className="h-full w-full">
      <CodeEditor
        challenge={challenge}
        code={code}
        onCodeChange={setCode}
        onSubmit={handleSubmitSolution}
      />
    </div>
  );
};

export default ChallengeEditor;
