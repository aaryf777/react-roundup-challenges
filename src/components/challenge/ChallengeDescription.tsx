import { Building2, Tag, Clock, Trophy, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ChallengeDescriptionProps } from "./type";

const ChallengeDescription = ({
  challenge,
  totalSubmissionsCount,
}: ChallengeDescriptionProps) => {
  const difficultyConfig = {
    easy: { color: "text-difficulty-easy", bg: "bg-difficulty-easy/10" },
    medium: { color: "text-difficulty-medium", bg: "bg-difficulty-medium/10" },
    hard: { color: "text-difficulty-hard", bg: "bg-difficulty-hard/10" },
  };

  const diffConfig = difficultyConfig[challenge.difficulty];

  // Handler for back button (navigate to previous page)
  const handleBack = () => {
    window.history.back();
  };

  const preStyles = `
    .prose pre {
      color: rgb(212, 212, 212);
      font-size: 13px;
      text-shadow: none;
      font-family: Menlo, Monaco, Consolas, "Andale Mono", "Ubuntu Mono", "Courier New", monospace;
      direction: ltr;
      text-align: left;
      white-space: pre;
      word-spacing: normal;
      word-break: normal;
      line-height: 1.5;
      tab-size: 4;
      hyphens: none;
      padding: 1em;
      margin: 0.5em 0px;
      overflow: auto;
      background: rgb(30, 30, 30);
      border-radius: 0.3em;
    }
  `;

  return (
    <div className="flex flex-col h-full bg-background">
      <style>{preStyles}</style>
      {/* Top Bar */}
      <div className="flex-shrink-0 px-6 py-4 flex justify-between items-start border-b border-border">
        <div>
          <h2 className="text-2xl font-bold">{challenge.title}</h2>
          <Badge
            className={cn(
              "px-3  font-medium capitalize mt-2",
              diffConfig.color,
              diffConfig.bg
            )}
          >
            {challenge.difficulty}
          </Badge>
        </div>
        <div className="flex items-center justify-end gap-6 text-xs text-muted-foreground pt-2">
          <div className="flex items-center gap-1">
            <Trophy className="w-4 h-4 text-yellow-500" />
            <span>{challenge.points} pts</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4 text-blue-500" />
            <span>{totalSubmissionsCount} submissions</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4 text-green-500" />
            <span>{challenge.timeEstimate}</span>
          </div>
        </div>
      </div>
      {/* Content Area */}
      <div className="flex-grow px-6 pb-6 pt-4 space-y-6 overflow-y-auto">
        {/* <div className="prose prose-sm max-w-none dark:prose-invert">
          <div
            dangerouslySetInnerHTML={{
              __html: challenge.content
                .replace(/\n/g, "<br/>")
                .replace(/```([\s\S]*?)```/g, "<pre><code>$1</code></pre>")
                .replace(/`([^`]+)`/g, "<code>$1</code>")
                .replace(
                  /## (.*?)\n/g,
                  "<h2 class='text-xl font-bold mt-6 mb-3'>$1</h2>"
                )
                .replace(
                  /### (.*?)\n/g,
                  "<h3 class='text-lg font-semibold mt-4 mb-2'>$1</h3>"
                )
                .replace(/- (.*?)\n/g, "<li class='ml-4'>$1</li>"),
            }}
          />
        </div> */}

        <div>
          <div
            className="prose prose-sm max-w-none dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: challenge.instructions }}
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Test Cases</h3>
          <div className="space-y-2">
            {Array.isArray(challenge.testCases) &&
              challenge.testCases.map((testCase, index) => (
              <div
                key={index}
                className="p-3 bg-background-light rounded-md border border-border"
              >
                <p className="text-xs font-mono text-muted-foreground">
                  Case {index + 1}
                </p>
                <div className="mt-1 text-sm font-mono">
                  <strong>Input:</strong>{" "}
                  <code>{JSON.stringify(testCase.input)}</code>
                </div>
                <div className="mt-1 text-sm font-mono">
                  <strong>Expected:</strong>{" "}
                  <code>{JSON.stringify(testCase.expected)}</code>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-auto">
          {challenge.companies && challenge.companies.length > 0 && (
            <div className="mt-4">
              <div className="flex items-center gap-1 font-semibold text-xs text-muted-foreground mb-1 uppercase tracking-wider">
                <Building2 className="w-4 h-4 mr-1 mb-2" /> Companies
              </div>
              <div className="flex flex-wrap gap-2">
                {challenge.companies.map((company) => (
                  <Badge
                    key={company}
                    variant="secondary"
                    className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 flex items-center gap-1"
                  >
                    <Building2 className="w-4 h-4 mr-1" />
                    {company}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          {challenge.tags && challenge.tags.length > 0 && (
            <div className="mt-4">
              <div className="flex items-center gap-1 font-semibold text-xs text-muted-foreground mb-1 uppercase tracking-wider">
                <Tag className="w-4 h-4 mr-1 mb-2" /> Categories
              </div>
              <div className="flex flex-wrap gap-2">
                {challenge.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChallengeDescription;
