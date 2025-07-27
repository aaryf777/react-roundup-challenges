import {
  BookOpen,
  Building2,
  Tag,
  ChevronLeft,
  Clock,
  Trophy,
  Users,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  category: string;
  timeEstimate: string;
  solvedBy: number;
  tags: string[];
  content: string;
  hints: string[];
  companies?: string[];
  points: number;
}

interface ChallengeDescriptionProps {
  challenge: Challenge;
}

const ChallengeDescription = ({ challenge }: ChallengeDescriptionProps) => {
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

  return (
    <div className="flex flex-col h-full min-h-screen h-full bg-gradient-card ">
      {/* Top Bar */}
      <div className="sticky top-0 z-10 bg-gradient-card px-6 py-4 flex flex-col gap-2 border-b border-border">
        <div className="flex items-center h-10">
          <button
            onClick={handleBack}
            className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Back</span>
          </button>
          <div className="flex-1" />
          <Badge
            className={cn(
              "px-3  font-medium capitalize",
              diffConfig.color,
              diffConfig.bg
            )}
          >
            {challenge.difficulty}
          </Badge>
        </div>
        {/* Challenge Stats Row */}
        <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Trophy className="w-4 h-4 text-yellow-500" />
            <span>{challenge.points} pts</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4 text-blue-500" />
            <span>{challenge.solvedBy.toLocaleString()} solved</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4 text-green-500" />
            <span>{challenge.timeEstimate}</span>
          </div>
        </div>
      </div>
      {/* Content Area */}
      <div className="flex-1 px-6 pb-6 pt-4 h-[50vh] overflow-y-scroll">
        <Tabs defaultValue="description" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger
              value="description"
              className="flex items-center space-x-2"
            >
              <BookOpen className="h-4 w-4" />
              <span>Description</span>
            </TabsTrigger>
            <TabsTrigger value="hints">Hints</TabsTrigger>
            <TabsTrigger value="solutions">Solutions</TabsTrigger>
          </TabsList>

          <TabsContent value="description">
            <Card className=" flex flex-col">
              <CardContent className="pt-6 flex-1 flex flex-col">
                <h2 className="text-xl font-bold mb-4">{challenge.title}</h2>
                {/* Markdown Content */}
                <div className="prose prose-sm max-w-none dark:prose-invert overflow-y-auto  mb-4">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: challenge.content
                        .replace(/\n/g, "<br/>")
                        .replace(
                          /```([\s\S]*?)```/g,
                          "<pre><code>$1</code></pre>"
                        )
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
                </div>
                {/* Companies and Categories always visible at the bottom */}
                <div className="mt-auto">
                  {challenge.companies && challenge.companies.length > 0 && (
                    <div className="mt-4">
                      <div className="flex items-center gap-1 font-semibold text-xs text-muted-foreground mb-1 uppercase tracking-wider">
                        <Building2 className="w-4 h-4 mr-1" /> Companies
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {challenge.companies.map((company) => (
                          <Badge
                            key={company}
                            variant="secondary"
                            className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                          >
                            {company}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {challenge.tags && challenge.tags.length > 0 && (
                    <div className="mt-4">
                      <div className="flex items-center gap-1 font-semibold text-xs text-muted-foreground mb-1 uppercase tracking-wider">
                        <Tag className="w-4 h-4 mr-1" /> Categories
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {challenge.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="hints">
            <Card>
              <CardContent className="pt-6 space-y-4">
                {challenge.hints.map((hint, index) => (
                  <div key={index} className="p-4 bg-muted rounded-lg">
                    <p className="text-sm">
                      <span className="font-medium">Hint {index + 1}:</span>{" "}
                      {hint}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="solutions">
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground text-center py-8">
                  Complete the challenge to unlock community solutions
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ChallengeDescription;
