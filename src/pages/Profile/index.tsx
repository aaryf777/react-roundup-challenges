import { useState, useMemo } from "react";
import Profile from "@/components/profile";

const ProfilePage = () => {
  const [timeFilter, setTimeFilter] = useState("1month");

  // Mock user data
  const user = {
    username: "alex_coder",
    email: "alex@example.com",
    joinDate: "2023-01-15",
    totalProblemsSolved: 245,
    currentStreak: 12,
    longestStreak: 45,
    problemsByDifficulty: {
      easy: 120,
      medium: 85,
      hard: 40,
    },
  };

  // Generate mock data for the chart based on time filter
  const generateChartData = (filter: string) => {
    const days = filter === "1month" ? 30 : filter === "6months" ? 180 : 365;
    const data = [];
    for (let i = 0; i < days; i++) {
      data.push({
        date: new Date(
          Date.now() - (days - i) * 24 * 60 * 60 * 1000
        ).toLocaleDateString(),
        solved: Math.floor(Math.random() * 5) + 1,
      });
    }
    return data;
  };

  const chartData = useMemo(() => generateChartData(timeFilter), [timeFilter]);

  const timeFilterOptions = [
    { label: "1 Month", value: "1month" },
    { label: "6 Months", value: "6months" },
    { label: "1 Year", value: "1year" },
  ];

  return (
    <Profile
      user={user}
      chartData={chartData}
      timeFilter={timeFilter}
      setTimeFilter={setTimeFilter}
      timeFilterOptions={timeFilterOptions}
    />
  );
};

export default ProfilePage;
