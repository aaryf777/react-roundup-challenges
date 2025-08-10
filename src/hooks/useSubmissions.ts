import { useState } from "react";
import {
  submissionService,
  userService,
  FirestoreSubmission,
  FirestoreUser,
} from "@/lib/firestore";
import { useAuth } from "@/contexts/AuthContext";

export const useSubmissions = () => {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState<FirestoreSubmission[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createSubmission = async (
    submissionData: Omit<FirestoreSubmission, "id" | "submittedAt" | "points">
  ) => {
    if (!user) {
      throw new Error("User must be authenticated to submit solutions");
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Get previous submissions for this challenge
      const previousSubmissions =
        await submissionService.getUserSubmissionsForChallenge(
          user.id,
          submissionData.challengeId
        );

      // 2. Find the best previous score
      const bestPreviousScore = previousSubmissions.reduce(
        (max, sub) => Math.max(max, sub.testCasesPassed),
        0
      );

      // 3. Calculate newly passed test cases
      const newlyPassedTestCases = Math.max(
        0,
        submissionData.testCasesPassed - bestPreviousScore
      );

      // 4. Calculate points to award (e.g., 10 points per new test case)
      const pointsToAdd = newlyPassedTestCases;

      // 5. Update user's total points if they earned any
      if (pointsToAdd > 0) {
        const currentUser = await userService.getUser(user.id);
        if (currentUser) {
          const updatedUserData: Partial<FirestoreUser> = {
            points: currentUser.points + pointsToAdd,
          };

          // If all test cases are passed for the first time, update solved problems
          if (
            submissionData.testCasesPassed === submissionData.totalTestCases &&
            !currentUser.solvedProblems.includes(submissionData.challengeId)
          ) {
            updatedUserData.solvedProblems = [
              ...currentUser.solvedProblems,
              submissionData.challengeId,
            ];
          }

          await userService.updateUser(user.id, updatedUserData);
        }
      }

      // 6. Create the new submission record
      const submissionId = await submissionService.createSubmission(
        user.id,
        submissionData.challengeId,
        {
          ...submissionData,
          points: pointsToAdd,
        }
      );

      // Refetch submissions for the UI
      getChallengeSubmissions(submissionData.challengeId);

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
      const fetchedSubmissions =
        await submissionService.getChallengeSubmissions(challengeId);
      console.log("fetchedSubmissions", fetchedSubmissions);

      setSubmissions(fetchedSubmissions);
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
    createSubmission,
    getUserSubmissions,
    getChallengeSubmissions,
    getUserChallengeSubmission,
    submissions,
    loading,
    error,
  };
};
