import { Clock, Trophy, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ChallengeDescription from "./ChallengeDescription";
import SubmissionResult from "./SubmissionResult";
import SubmissionsList from "./SubmissionsList";
import type { Challenge } from "./type";
import type { FirestoreSubmission } from "@/lib/firestore";
import { cn } from "@/lib/utils";

interface LeftPaneProps {
  challenge: Challenge;
  latestSubmission: FirestoreSubmission | null;
  userSubmissions: FirestoreSubmission[];
  totalSubmissionsCount: number;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const difficultyConfig = {
  easy: {
    color: "text-difficulty-easy",
    bg: "bg-difficulty-easy/10",
  },
  medium: {
    color: "text-difficulty-medium",
    bg: "bg-difficulty-medium/10",
  },
  hard: {
    color: "text-difficulty-hard",
    bg: "bg-difficulty-hard/10",
  },
};

const LeftPane = ({
  challenge,
  latestSubmission,
  userSubmissions,
  totalSubmissionsCount,
  activeTab,
  onTabChange,
}: LeftPaneProps) => {
  const diffConfig = difficultyConfig[challenge.difficulty];
  return (
    <Tabs
      value={activeTab}
      onValueChange={onTabChange}
      className="h-full flex flex-col"
    >
      <div className="p-2">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="result" disabled={!latestSubmission}>
            Result
          </TabsTrigger>
          <TabsTrigger value="submissions">
            Submissions ({userSubmissions.length})
          </TabsTrigger>
        </TabsList>
      </div>
      <div className="flex-grow overflow-y-auto">
        <TabsContent value="description" className="h-full">
          <div className="py-2 px-4">
            <div className="prose prose-invert max-w-none pt-4 border-t border-border">
              <ChallengeDescription
                challenge={challenge}
                totalSubmissionsCount={totalSubmissionsCount}
              />
            </div>
          </div>
        </TabsContent>
        <TabsContent value="result" className="h-full">
          {latestSubmission ? (
            <SubmissionResult submission={latestSubmission} />
          ) : (
            <div className="p-6 text-center">
              Submit your code to see the result.
            </div>
          )}
        </TabsContent>
        <TabsContent value="submissions" className="h-full">
          <SubmissionsList submissions={userSubmissions} />
        </TabsContent>
      </div>
    </Tabs>
  );
};

export default LeftPane;
