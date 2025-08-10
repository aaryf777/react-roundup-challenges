import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip as ShadcnTooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  Zap,
  Target,
  Flame,
  Trophy,
  Star,
  CheckCircle,
  Send,
} from "lucide-react";

interface ProfileProps {
  user: {
    username: string;
    email: string;
    joinDate: string;
    totalProblemsSolved: number;
    points: number;
    currentStreak: number;
    longestStreak: number;
    totalSubmissions: number;
    acceptedSubmissions: number;
    acceptanceRate: number;
    problemsByDifficulty: {
      easy: number;
      medium: number;
      hard: number;
    };
    totalChallengesByDifficulty: {
      easy: number;
      medium: number;
      hard: number;
    };
    solvedByCategory: {
      easy: Record<string, number>;
      medium: Record<string, number>;
      hard: Record<string, number>;
    };
  };
  chartData: { date: string; solved: number }[];
  timeFilter: string;
  setTimeFilter: (filter: string) => void;
  timeFilterOptions: { label: string; value: string }[];
}

const Profile = ({
  user,
  chartData,
  timeFilter,
  setTimeFilter,
  timeFilterOptions,
}: ProfileProps) => {
  const DifficultyInfo: React.FC<{
    title: string;
    solved: number;
    color: string;
    categoryData: Record<string, number>;
  }> = ({ title, solved, color, categoryData }) => {
    return (
      <TooltipProvider>
        <ShadcnTooltip>
          <TooltipTrigger asChild>
            <div className={`text-center p-4 bg-${color}-50 rounded-lg`}>
              <Badge className={`bg-${color}-500 mb-2`}>{title}</Badge>
              <p className={`text-2xl font-bold text-${color}-600`}>{solved}</p>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p className="font-bold mb-1">Solved by Category:</p>
            {Object.entries(categoryData).map(([cat, num]) => (
              <p key={cat} className="text-sm">
                {cat}: {num}
              </p>
            ))}
          </TooltipContent>
        </ShadcnTooltip>
      </TooltipProvider>
    );
  };

  return (
    <div className="container max-w-4xl py-12">
      <div className="space-y-8">
        {/* Profile Header */}
        <Card>
          <CardContent>
            <div className="flex items-center space-x-4 pt-6">
              <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-xl font-semibold">{user.username}</h2>
                <p className="text-muted-foreground">{user.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                <span className="text-sm font-medium">Total Solved</span>
              </div>
              <p className="text-2xl font-bold mt-2">
                {user.totalProblemsSolved}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-indigo-500" />
                <span className="text-sm font-medium">Points</span>
              </div>
              <p className="text-2xl font-bold mt-2">{user.points}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Flame className="h-5 w-5 text-orange-500" />
                <span className="text-sm font-medium">Streak</span>
              </div>
              <p className="text-2xl font-bold mt-2">
                {user.currentStreak} days
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-green-500" />
                <span className="text-sm font-medium">Acceptance Rate</span>
              </div>
              <div className="flex items-center space-x-2">
                <p className="text-2xl font-bold mt-2">
                  {user.acceptanceRate}%
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Problems Solved by Difficulty */}
        <Card>
          <CardHeader>
            <CardTitle>Problems Solved by Difficulty</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <DifficultyInfo
                title="Easy"
                solved={user.problemsByDifficulty.easy}
                color="green"
                categoryData={user.solvedByCategory.easy}
              />
              <DifficultyInfo
                title="Medium"
                solved={user.problemsByDifficulty.medium}
                color="yellow"
                categoryData={user.solvedByCategory.medium}
              />
              <DifficultyInfo
                title="Hard"
                solved={user.problemsByDifficulty.hard}
                color="red"
                categoryData={user.solvedByCategory.hard}
              />
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-4 flex overflow-hidden">
              <TooltipProvider>
                <ShadcnTooltip>
                  <TooltipTrigger asChild>
                    <div
                      className="bg-green-500 h-full"
                      style={{
                        width: `${user.totalChallengesByDifficulty.easy > 0 ? (user.problemsByDifficulty.easy / user.totalChallengesByDifficulty.easy) * 100 : 0}%`,
                      }}
                    ></div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      Easy: {user.problemsByDifficulty.easy} /{" "}
                      {user.totalChallengesByDifficulty.easy}
                    </p>
                  </TooltipContent>
                </ShadcnTooltip>
              </TooltipProvider>
              <TooltipProvider>
                <ShadcnTooltip>
                  <TooltipTrigger asChild>
                    <div
                      className="bg-yellow-500 h-full"
                      style={{
                        width: `${user.totalChallengesByDifficulty.medium > 0 ? (user.problemsByDifficulty.medium / user.totalChallengesByDifficulty.medium) * 100 : 0}%`,
                      }}
                    ></div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      Medium: {user.problemsByDifficulty.medium} /{" "}
                      {user.totalChallengesByDifficulty.medium}
                    </p>
                  </TooltipContent>
                </ShadcnTooltip>
              </TooltipProvider>
              <TooltipProvider>
                <ShadcnTooltip>
                  <TooltipTrigger asChild>
                    <div
                      className="bg-red-500 h-full"
                      style={{
                        width: `${user.totalChallengesByDifficulty.hard > 0 ? (user.problemsByDifficulty.hard / user.totalChallengesByDifficulty.hard) * 100 : 0}%`,
                      }}
                    ></div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      Hard: {user.problemsByDifficulty.hard} /{" "}
                      {user.totalChallengesByDifficulty.hard}
                    </p>
                  </TooltipContent>
                </ShadcnTooltip>
              </TooltipProvider>
            </div>
          </CardContent>
        </Card>

        {/* Problems Solved Per Day Chart */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Problems Solved Per Day</CardTitle>
              <div className="flex space-x-2">
                {timeFilterOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant={
                      timeFilter === option.value ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => setTimeFilter(option.value)}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent className="pb-2">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  interval={
                    timeFilter === "1month"
                      ? 6
                      : timeFilter === "6months"
                        ? 30
                        : 60
                  }
                />
                <YAxis />
                <RechartsTooltip
                  contentStyle={{ background: "#1f2937", border: "none" }}
                  labelStyle={{ color: "#f9fafb" }}
                />
                <Bar dataKey="solved" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
