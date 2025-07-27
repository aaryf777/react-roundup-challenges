import { useState, useEffect } from "react";
import { challengeService, FirestoreChallenge } from "@/lib/firestore";

export const useChallenges = () => {
  const [challenges, setChallenges] = useState<FirestoreChallenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        setLoading(true);
        const fetchedChallenges = await challengeService.getChallenges();
        setChallenges(fetchedChallenges);
      } catch (err) {
        console.error("Error fetching challenges:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch challenges"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchChallenges();
  }, []);

  const getChallengeById = async (id: string) => {
    try {
      return await challengeService.getChallenge(id);
    } catch (err) {
      console.error("Error fetching challenge:", err);
      throw err;
    }
  };

  const getChallengesByDifficulty = async (difficulty: string) => {
    try {
      return await challengeService.getChallengesByDifficulty(difficulty);
    } catch (err) {
      console.error("Error fetching challenges by difficulty:", err);
      throw err;
    }
  };

  const getChallengesByCategory = async (category: string) => {
    try {
      return await challengeService.getChallengesByCategory(category);
    } catch (err) {
      console.error("Error fetching challenges by category:", err);
      throw err;
    }
  };

  return {
    challenges,
    loading,
    error,
    getChallengeById,
    getChallengesByDifficulty,
    getChallengesByCategory,
  };
};
