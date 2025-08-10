import { useState, useMemo, useEffect } from "react";
import Profile from "@/components/profile";
import { useAuth } from "@/contexts/AuthContext";
import { submissionService, FirestoreSubmission } from "@/lib/firestore";
import { useChallenges } from "@/contexts/ChallengesContext";

const ProfilePage = () => {
  const { user, loading: authLoading } = useAuth();
  const { allChallenges } = useChallenges();
  const [timeFilter, setTimeFilter] = useState("1month");
  const [submissions, setSubmissions] = useState<FirestoreSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubmissions = async () => {
      if (user?.id) {
        setLoading(true);
        const userSubmissions = await submissionService.getUserSubmissions(user.id);
        setSubmissions(userSubmissions);
        setLoading(false);
      }
    };
    fetchSubmissions();
  }, [user]);

  const chartData = useMemo(() => {
    const now = new Date();
    const days = timeFilter === "1month" ? 30 : timeFilter === "6months" ? 180 : 365;
    const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

    const filteredSubmissions = submissions.filter(sub => {
      const subDate = sub.submittedAt?.toDate();
      return subDate && subDate >= startDate;
    });

    const submissionsByDay = filteredSubmissions.reduce((acc, sub) => {
      const date = sub.submittedAt.toDate().toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = new Set();
      }
      if (sub.status === 'accepted') {
        acc[date].add(sub.challengeId);
      }
      return acc;
    }, {} as Record<string, Set<string>>);

    const data = [];
    for (let i = 0; i < days; i++) {
      const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
      const dateString = date.toISOString().split('T')[0];
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        solved: submissionsByDay[dateString]?.size || 0,
      });
    }
    return data;
  }, [submissions, timeFilter]);

  const submissionStats = useMemo(() => {
    const totalSubmissions = submissions.length;
    const acceptedSubmissions = submissions.filter(
      (s) => s.status === "accepted"
    ).length;
    const acceptanceRate =
      totalSubmissions > 0
        ? Math.round((acceptedSubmissions / totalSubmissions) * 100)
        : 0;

    return { totalSubmissions, acceptedSubmissions, acceptanceRate };
  }, [submissions]);

  const profileStats = useMemo(() => {
    const solvedProblemIds = new Set(user?.solvedProblems || []);
    
    const problemsByDifficulty = { easy: 0, medium: 0, hard: 0 };
    const totalChallengesByDifficulty = { easy: 0, medium: 0, hard: 0 };
    const solvedByCategory = {
        easy: {} as Record<string, number>,
        medium: {} as Record<string, number>,
        hard: {} as Record<string, number>,
    };

    for (const challenge of allChallenges) {
        totalChallengesByDifficulty[challenge.difficulty]++;

        if (solvedProblemIds.has(challenge.id)) {
            problemsByDifficulty[challenge.difficulty]++;
            const categoryName = challenge.category;
            const difficulty = challenge.difficulty;
            solvedByCategory[difficulty][categoryName] = (solvedByCategory[difficulty][categoryName] || 0) + 1;
        }
    }

    return { problemsByDifficulty, totalChallengesByDifficulty, solvedByCategory };
  }, [user?.solvedProblems, allChallenges]);

  if (authLoading || loading) {
    return <div>Loading profile...</div>;
  }

  if (!user) {
    return <div>Please log in to view your profile.</div>;
  }

  const timeFilterOptions = [
    { label: "1 Month", value: "1month" },
    { label: "6 Months", value: "6months" },
    { label: "1 Year", value: "1year" },
  ];

  const profileData = {
    ...submissionStats,
    username: user.username,
    email: user.email,
    joinDate: user.createdAt?.toDate().toLocaleDateString() || 'N/A',
    totalProblemsSolved: user.solvedProblems.length,
    points: user.points,
    currentStreak: user.streak,
    longestStreak: user.longestStreak,
    problemsByDifficulty: profileStats.problemsByDifficulty,
    totalChallengesByDifficulty: profileStats.totalChallengesByDifficulty,
    solvedByCategory: profileStats.solvedByCategory,
  };

  return (
    <Profile
      user={profileData}
      chartData={chartData}
      timeFilter={timeFilter}
      setTimeFilter={setTimeFilter}
      timeFilterOptions={timeFilterOptions}
    />
  );
};

export default ProfilePage;
