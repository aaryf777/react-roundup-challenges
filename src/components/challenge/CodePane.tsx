import CodeEditor from './CodeEditor';
import { Challenge } from './type';

interface CodePaneProps {
  challenge: Challenge;
  code: string;
  onCodeChange: (code: string) => void;
  onSubmit: (submissionData: any) => Promise<void>;
}

const CodePane = ({ challenge, code, onCodeChange, onSubmit }: CodePaneProps) => {
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
