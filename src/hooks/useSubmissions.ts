import { useState } from "react";
import { submissionService, FirestoreSubmission } from "@/lib/firestore";
import { useAuth } from "@/contexts/AuthContext";

export const useSubmissions = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createSubmission = async (
    challengeId: string,
    code: string,
    language: string = "javascript",
    status: FirestoreSubmission["status"],
    executionTime: number,
    memoryUsage: number,
    testCasesPassed: number,
    totalTestCases: number
  ) => {
    if (!user) {
      throw new Error("User must be authenticated to submit solutions");
    }

    try {
      setLoading(true);
      setError(null);

      const submissionData = {
        userId: user.id,
        challengeId,
        code,
        language,
        status,
        executionTime,
        memoryUsage,
        testCasesPassed,
        totalTestCases,
      };

      const submissionId =
        await submissionService.createSubmission(submissionData);
      return submissionId;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create submission";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getUserSubmissions = async (userId?: string) => {
    const targetUserId = userId || user?.id;
    if (!targetUserId) {
      throw new Error("User ID is required");
    }

    try {
      setLoading(true);
      setError(null);
      return await submissionService.getUserSubmissions(targetUserId);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch user submissions";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getChallengeSubmissions = async (challengeId: string) => {
    try {
      setLoading(true);
      setError(null);
      return await submissionService.getChallengeSubmissions(challengeId);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to fetch challenge submissions";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getUserChallengeSubmission = async (
    challengeId: string,
    userId?: string
  ) => {
    const targetUserId = userId || user?.id;
    if (!targetUserId) {
      throw new Error("User ID is required");
    }

    try {
      setLoading(true);
      setError(null);
      return await submissionService.getUserChallengeSubmission(
        targetUserId,
        challengeId
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to fetch user challenge submission";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    createSubmission,
    getUserSubmissions,
    getChallengeSubmissions,
    getUserChallengeSubmission,
  };
};
