import CodeEditor from "./CodeEditor";
import MCQChallenge from "./MCQChallenge";
import { Challenge } from "../../contexts/ChallengesContext";

interface CodePaneProps {
  challenge: Challenge;
  code: string;
  onCodeChange: (code: string) => void;
  onSubmit: (submissionData: any) => Promise<void>;
}

const CodePane = ({
  challenge,
  code,
  onCodeChange,
  onSubmit,
}: CodePaneProps) => {
  // Check if this is an MCQ challenge
  const isMCQChallenge =
    challenge.category === "MCQ" ||
    challenge.tags?.includes("MCQ") ||
    challenge.tags?.some((tag) => tag.toLowerCase() === "mcq");

  if (isMCQChallenge) {
    return <MCQChallenge challenge={challenge} onSubmit={onSubmit} />;
  }

  return (
    <CodeEditor
      challenge={challenge}
      code={code}
      onCodeChange={onCodeChange}
      onSubmit={onSubmit}
    />
  );
};

export default CodePane;
