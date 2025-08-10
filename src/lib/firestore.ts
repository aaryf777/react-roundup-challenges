import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  setDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  DocumentData,
  QueryDocumentSnapshot,
  increment,
} from "firebase/firestore";
import { db } from "./firebase";

// Collection names
export const COLLECTIONS = {
  USERS: "users",
  CHALLENGES: "challenges",
  SUBMISSIONS: "submissions",
  LEADERBOARD: "leaderboard",
  CATEGORIES: "categories",
} as const;

// User interface
export interface FirestoreUser {
  uid: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  points: number;
  problemsSolved: number;
  streak: number;
  longestStreak: number;
  createdAt: any;
  updatedAt: any;
  solvedProblems: string[]; // Array of challenge IDs
  submissions: string[]; // Array of submission IDs
}

// Challenge interface
export interface FirestoreChallenge extends DocumentData {
  id: string;
  title: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  category: string;
  estimatedTime: number;
  completions: number;
  submissions: number;
  tags: string[];
  companyTags: string[];
  instructions: string;
  starterCode: string;
  solutionCode: string;
  testCases: string;
  createdAt: any;
  updatedAt: any;
  status: string;
  createdBy: string;
}

// Category interface
export interface FirestoreCategory {
  id: string;
  category: string;
}

// Submission interface
export interface FirestoreSubmission {
  id: string;
  userId: string;
  challengeId: string;
  code: string;
  language: string;
  status: "accepted" | "wrong_answer" | "time_limit_exceeded" | "runtime_error" | "failed" | "partial_accepted";
  executionTime: number;
  memoryUsage: number;
  testCasesPassed: number;
  totalTestCases: number;
  points?: number;
  submittedAt: any;
}

// User operations
export const userService = {
  // Create or update user
  async createUser(
    userData: Omit<FirestoreUser, "createdAt" | "updatedAt">
  ): Promise<void> {
    const userRef = doc(db, COLLECTIONS.USERS, userData.uid);
    await setDoc(userRef, {
      ...userData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  },

  // Get user by ID
  async getUser(uid: string): Promise<FirestoreUser | null> {
    const userRef = doc(db, COLLECTIONS.USERS, uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return userSnap.data() as FirestoreUser;
    }
    return null;
  },

  // Update user
  async updateUser(
    uid: string,
    updates: Partial<FirestoreUser>
  ): Promise<void> {
    const userRef = doc(db, COLLECTIONS.USERS, uid);
    await updateDoc(userRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  },

  // Update user points and solved problems
  async updateUserProgress(
    uid: string,
    points: number,
    solvedProblems: string[]
  ): Promise<void> {
    const userRef = doc(db, COLLECTIONS.USERS, uid);
    await updateDoc(userRef, {
      points,
      problemsSolved: solvedProblems.length,
      solvedProblems,
      updatedAt: serverTimestamp(),
    });
  },

  // Get leaderboard users
  async getLeaderboard(limitCount: number = 10): Promise<FirestoreUser[]> {
    const q = query(
      collection(db, COLLECTIONS.USERS),
      orderBy("points", "desc"),
      limit(limitCount)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => doc.data() as FirestoreUser);
  },
};

// Category operations
export const categoryService = {
  // Get all categories
  async getCategories(): Promise<FirestoreCategory[]> {
    const q = query(collection(db, COLLECTIONS.CATEGORIES));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        }) as FirestoreCategory
    );
  },
};

// Challenge operations
export const challengeService = {
  // Get all challenges
  async getChallenges(): Promise<FirestoreChallenge[]> {
    const q = query(collection(db, COLLECTIONS.CHALLENGES));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
          submissions: doc.data().submissions || 0,
        }) as FirestoreChallenge
    );
  },

  // Get challenge by ID
  async getChallenge(id: string): Promise<FirestoreChallenge | null> {
    const challengeRef = doc(db, COLLECTIONS.CHALLENGES, id);
    const challengeSnap = await getDoc(challengeRef);

    if (challengeSnap.exists()) {
      return {
        id: challengeSnap.id,
        ...challengeSnap.data(),
        submissions: challengeSnap.data().submissions || 0,
      } as FirestoreChallenge;
    }
    return null;
  },

  // Get challenges by difficulty
  async getChallengesByDifficulty(
    difficulty: string
  ): Promise<FirestoreChallenge[]> {
    const q = query(
      collection(db, COLLECTIONS.CHALLENGES),
      where("difficulty", "==", difficulty)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
          submissions: doc.data().submissions || 0,
        }) as FirestoreChallenge
    );
  },

  // Get challenges by category
  async getChallengesByCategory(
    category: string
  ): Promise<FirestoreChallenge[]> {
    const q = query(
      collection(db, COLLECTIONS.CHALLENGES),
      where("category", "==", category)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
          submissions: doc.data().submissions || 0,
        }) as FirestoreChallenge
    );
  },
};

// Submission operations
export interface SubmissionService {
  createSubmission: (
    userId: string,
    challengeId: string,
    submissionData: Omit<
      FirestoreSubmission,
      "id" | "submittedAt" | "userId" | "challengeId"
    >
  ) => Promise<string>;
  getUserSubmissions: (userId: string) => Promise<FirestoreSubmission[]>;
  getChallengeSubmissions: (
    challengeId: string
  ) => Promise<FirestoreSubmission[]>;
  getUserChallengeSubmission: (
    userId: string,
    challengeId: string
  ) => Promise<FirestoreSubmission | null>;
  getAllSubmissions: () => Promise<FirestoreSubmission[]>;
  getUserSubmissionsForChallenge: (
    userId: string,
    challengeId: string
  ) => Promise<FirestoreSubmission[]>;
}

export const submissionService: SubmissionService = {
  // Create submission
  async createSubmission(
    userId: string,
    challengeId: string,
    submissionData: Omit<
      FirestoreSubmission,
      "id" | "submittedAt" | "userId" | "challengeId"
    >
  ): Promise<string> {
    // Create the submission document
    const submissionPromise = addDoc(
      collection(db, COLLECTIONS.SUBMISSIONS),
      {
        ...submissionData,
        userId,
        challengeId,
        submittedAt: serverTimestamp(),
      }
    );

    const submissionRef = await submissionPromise;
    return submissionRef.id;
  },

  // Get all submissions (for calculating counts)
  async getAllSubmissions(): Promise<FirestoreSubmission[]> {
    const querySnapshot = await getDocs(
      collection(db, COLLECTIONS.SUBMISSIONS)
    );
    return querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        }) as FirestoreSubmission
    );
  },

  // Get user submissions
  async getUserSubmissions(userId: string): Promise<FirestoreSubmission[]> {
    const q = query(
      collection(db, COLLECTIONS.SUBMISSIONS),
      where("userId", "==", userId),
      orderBy("submittedAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        }) as FirestoreSubmission
    );
  },

  // Get challenge submissions
  async getChallengeSubmissions(
    challengeId: string
  ): Promise<FirestoreSubmission[]> {
    const q = query(
      collection(db, COLLECTIONS.SUBMISSIONS),
      where("challengeId", "==", challengeId),
      orderBy("submittedAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        }) as FirestoreSubmission
    );
  },

  // Get user's submission for a specific challenge
  async getUserChallengeSubmission(
    userId: string,
    challengeId: string
  ): Promise<FirestoreSubmission | null> {
    const q = query(
      collection(db, COLLECTIONS.SUBMISSIONS),
      where("userId", "==", userId),
      where("challengeId", "==", challengeId),
      orderBy("submittedAt", "desc"),
      limit(1)
    );

    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data(),
      } as FirestoreSubmission;
    }
    return null;
  },

  // Get all of a user's submissions for a specific challenge
  async getUserSubmissionsForChallenge(
    userId: string,
    challengeId: string
  ): Promise<FirestoreSubmission[]> {
    const q = query(
      collection(db, COLLECTIONS.SUBMISSIONS),
      where("userId", "==", userId),
      where("challengeId", "==", challengeId),
      orderBy("submittedAt", "desc")
    );
    console.log(" - ", q, "challengeId - ", challengeId);
    try {
      const querySnapshot = await getDocs(q);
      console.log("querySnapshot - ", querySnapshot);
      return querySnapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          }) as FirestoreSubmission
      );
    } catch (error: any) {
      console.error(
        "Failed to fetch user submissions for challenge:",
        error.message
      );
      if (
        error.code === "failed-precondition" &&
        error.message.includes("create it here")
      ) {
        const match = error.message.match(
          /https:\/\/console\.firebase\.google\.com\/[^\s]+/
        );
        if (match) {
          console.error("👉 Create the required index here:", match[0]);
        }
      }
      return [];
    }
  },
};

// Initialize default data
export const initializeDefaultData = async () => {
  // Check if challenges already exist
  const challengesSnapshot = await getDocs(
    collection(db, COLLECTIONS.CHALLENGES)
  );

  if (challengesSnapshot.empty) {
    // Add default challenges
    const defaultChallenges = [
      {
        title: "Two Sum",
        description:
          "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
        content:
          "Given an array of integers `nums` and an integer `target`, return *indices of the two numbers such that they add up to `target`*.\n\nYou may assume that each input would have ***exactly one solution***, and you may not use the *same* element twice.\n\nYou can return the answer in any order.\n\n**Example 1:**\n```\nInput: nums = [2,7,11,15], target = 9\nOutput: [0,1]\nExplanation: Because nums[0] + nums[1] == 9, we return [0, 1].\n```\n\n**Example 2:**\n```\nInput: nums = [3,2,4], target = 6\nOutput: [1,2]\n```\n\n**Example 3:**\n```\nInput: nums = [3,3], target = 6\nOutput: [0,1]\n```\n\n**Constraints:**\n- `2 <= nums.length <= 104`\n- `-109 <= nums[i] <= 109`\n- `-109 <= target <= 109`\n- **Only one valid answer exists.**",
        difficulty: "easy" as const,
        category: "arrays",
        tags: ["Array", "Hash Table"],
        companies: ["Google", "Amazon", "Microsoft"],
        points: 10,
        timeEstimate: "15 minutes",
        solvedBy: 0,
        testCases: [
          { input: [2, 7, 11, 15], target: 9, expected: [0, 1] },
          { input: [3, 2, 4], target: 6, expected: [1, 2] },
          { input: [3, 3], target: 6, expected: [0, 1] },
        ],
        hints: [
          "Try using a hash table to store the complement of each number",
          "For each number, check if its complement exists in the hash table",
        ],
      },
      {
        title: "Valid Parentheses",
        description:
          "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
        content:
          "Given a string `s` containing just the characters `'('`, `')'`, `'{'`, `'}'`, `'['` and `']'`, determine if the input string is valid.\n\nAn input string is valid if:\n\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n3. Every close bracket has a corresponding open bracket of the same type.\n\n**Example 1:**\n```\nInput: s = \"()\"\nOutput: true\n```\n\n**Example 2:**\n```\nInput: s = \"()[]{}\"\nOutput: true\n```\n\n**Example 3:**\n```\nInput: s = \"(]\"\nOutput: false\n```\n\n**Constraints:**\n- `1 <= s.length <= 104`\n- `s` consists of parentheses only `'()[]{}'`",
        difficulty: "easy" as const,
        category: "stack",
        tags: ["String", "Stack"],
        companies: ["Amazon", "Microsoft", "Apple"],
        points: 10,
        timeEstimate: "10 minutes",
        solvedBy: 0,
        testCases: [
          { input: "()", expected: true },
          { input: "()[]{}", expected: true },
          { input: "(]", expected: false },
          { input: "([)]", expected: false },
        ],
        hints: [
          "Use a stack to keep track of opening brackets",
          "When you encounter a closing bracket, check if it matches the top of the stack",
        ],
      },
    ];

    for (const challenge of defaultChallenges) {
      await addDoc(collection(db, COLLECTIONS.CHALLENGES), {
        ...challenge,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }
  }
};
