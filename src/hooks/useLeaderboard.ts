import { useState, useEffect } from "react";
import { userService, FirestoreUser } from "@/lib/firestore";

export const useLeaderboard = () => {
  const [leaderboard, setLeaderboard] = useState<FirestoreUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeaderboard = async (limitCount: number = 10) => {
    try {
      setLoading(true);
      setError(null);
      const data = await userService.getLeaderboard(limitCount);
      setLeaderboard(data);
    } catch (err) {
      console.error("Error fetching leaderboard:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch leaderboard"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  return {
    leaderboard,
    loading,
    error,
    refetch: fetchLeaderboard,
  };
};
