import { CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { FirestoreSubmission } from "@/lib/firestore";

interface SubmissionResultProps {
  submission: FirestoreSubmission;
}

const SubmissionResult = ({ submission }: SubmissionResultProps) => {
  const getStatusInfo = () => {
    switch (submission.status) {
      case "accepted":
        return {
          text: "Accepted",
          Icon: CheckCircle2,
          color: "text-green-500",
        };
      case "partial_accepted":
        return {
          text: "Partial Accepted",
          Icon: AlertTriangle,
          color: "text-yellow-500",
        };
      case "wrong_answer":
      case "failed":
        return {
          text:
            submission.status === "wrong_answer" ? "Wrong Answer" : "Failed",
          Icon: XCircle,
          color: "text-red-500",
        };
      case "runtime_error":
      case "time_limit_exceeded":
      default:
        return {
          text: "Error",
          Icon: AlertTriangle,
          color: "text-yellow-500",
        };
    }
  };

  const { text, Icon, color } = getStatusInfo();

  return (
    <div className="p-6 bg-white dark:bg-gray-800 h-full">
      <div className={`flex items-center text-3xl font-bold ${color}`}>
        <Icon className="h-10 w-10 mr-4" />
        <h1>{text}</h1>
      </div>
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Execution Time
          </p>
          <p className="text-lg font-semibold">
            {submission.executionTime.toFixed(2)} ms
          </p>
        </div>
        <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
          <p className="text-sm text-gray-500 dark:text-gray-400">Test Cases</p>
          <p className="text-lg font-semibold">{`${submission.testCasesPassed} / ${submission.totalTestCases}`}</p>
        </div>
        <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
          <p className="text-sm text-gray-500 dark:text-gray-400">Memory</p>
          <p className="text-lg font-semibold">{submission.memoryUsage}</p>
        </div>
        <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
          <p className="text-sm text-gray-500 dark:text-gray-400">Points</p>
          <p className="text-lg font-semibold">{submission.points || 0}</p>
        </div>
      </div>
    </div>
  );
};

export default SubmissionResult;
