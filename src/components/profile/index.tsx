import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Zap, Target, Flame, Trophy } from "lucide-react";

interface ProfileProps {
  user: {
    username: string;
    email: string;
    joinDate: string;
    totalProblemsSolved: number;
    currentStreak: number;
    longestStreak: number;
    problemsByDifficulty: {
      easy: number;
      medium: number;
      hard: number;
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
  const totalProblemsSolved =
    user.problemsByDifficulty.easy +
    user.problemsByDifficulty.medium +
    user.problemsByDifficulty.hard;

  return (
    <div className="container max-w-4xl py-12">
      <div className="space-y-8">
        {/* Profile Header */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-xl font-semibold">{user.username}</h2>
                <p className="text-muted-foreground">{user.email}</p>
                <p className="text-sm text-muted-foreground">
                  Joined {new Date(user.joinDate).toLocaleDateString()}
                </p>
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
              <p className="text-2xl font-bold mt-2">{totalProblemsSolved}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Flame className="h-5 w-5 text-orange-500" />
                <span className="text-sm font-medium">Current Streak</span>
              </div>
              <p className="text-2xl font-bold mt-2">
                {user.currentStreak} days
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-blue-500" />
                <span className="text-sm font-medium">Longest Streak</span>
              </div>
              <p className="text-2xl font-bold mt-2">
                {user.longestStreak} days
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-green-500" />
                <span className="text-sm font-medium">Success Rate</span>
              </div>
              <p className="text-2xl font-bold mt-2">87%</p>
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
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <Badge className="bg-green-500 mb-2">Easy</Badge>
                <p className="text-2xl font-bold text-green-600">
                  {user.problemsByDifficulty.easy}
                </p>
                <p className="text-sm text-muted-foreground">
                  {Math.round(
                    (user.problemsByDifficulty.easy / totalProblemsSolved) * 100
                  )}
                  %
                </p>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <Badge className="bg-yellow-500 mb-2">Medium</Badge>
                <p className="text-2xl font-bold text-yellow-600">
                  {user.problemsByDifficulty.medium}
                </p>
                <p className="text-sm text-muted-foreground">
                  {Math.round(
                    (user.problemsByDifficulty.medium / totalProblemsSolved) *
                      100
                  )}
                  %
                </p>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <Badge className="bg-red-500 mb-2">Hard</Badge>
                <p className="text-2xl font-bold text-red-600">
                  {user.problemsByDifficulty.hard}
                </p>
                <p className="text-sm text-muted-foreground">
                  {Math.round(
                    (user.problemsByDifficulty.hard / totalProblemsSolved) * 100
                  )}
                  %
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{
                  width: `${(user.problemsByDifficulty.easy / totalProblemsSolved) * 100}%`,
                }}
              ></div>
              <div
                className="bg-yellow-500 h-2 rounded-full -mt-2"
                style={{
                  width: `${(user.problemsByDifficulty.medium / totalProblemsSolved) * 100}%`,
                }}
              ></div>
              <div
                className="bg-red-500 h-2 rounded-full -mt-2"
                style={{
                  width: `${(user.problemsByDifficulty.hard / totalProblemsSolved) * 100}%`,
                }}
              ></div>
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
                <Tooltip />
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
