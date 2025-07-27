import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { userService, FirestoreUser } from "@/lib/firestore";

interface User {
  id: string;
  username: string;
  email: string;
  points: number;
  problemsSolved: number;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  socialLogin: (
    provider: "google" | "github"
  ) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Listen for Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser: FirebaseUser | null) => {
        if (firebaseUser) {
          try {
            // Check if user exists in Firestore
            let firestoreUser = await userService.getUser(firebaseUser.uid);

            if (!firestoreUser) {
              // Create new user in Firestore
              const firstName = firebaseUser.displayName?.split(" ")[0] || "";
              const lastName =
                firebaseUser.displayName?.split(" ").slice(1).join(" ") || "";
              const username = firebaseUser.email?.split("@")[0] || "User";
              const email = firebaseUser.email || "";

              const newUserData: Omit<
                FirestoreUser,
                "createdAt" | "updatedAt"
              > = {
                uid: firebaseUser.uid,
                username: username,
                email: email,
                firstName: firstName,
                lastName: lastName,
                points: 0,
                problemsSolved: 0,
                streak: 0,
                longestStreak: 0,
                solvedProblems: [],
                submissions: [],
              };

              await userService.createUser(newUserData);
              firestoreUser = await userService.getUser(firebaseUser.uid);
            }

            // Convert Firestore user to our User interface
            const user: User = {
              id: firestoreUser!.uid,
              username: firestoreUser!.username,
              email: firestoreUser!.email,
              points: firestoreUser!.points,
              problemsSolved: firestoreUser!.problemsSolved,
            };

            setUser(user);
            localStorage.setItem("user", JSON.stringify(user));
          } catch (error) {
            console.error("Error handling user authentication:", error);
            // Fallback to basic user data
            const user: User = {
              id: firebaseUser.uid,
              username:
                firebaseUser.displayName ||
                firebaseUser.email?.split("@")[0] ||
                "User",
              email: firebaseUser.email || "",
              points: 0,
              problemsSolved: 0,
            };
            setUser(user);
            localStorage.setItem("user", JSON.stringify(user));
          }
        } else {
          setUser(null);
          localStorage.removeItem("user");
        }
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      // Sign in with Firebase Auth
      const result = await signInWithEmailAndPassword(auth, email, password);

      // User data will be handled by onAuthStateChanged
      return { success: !!result.user };
    } catch (error: any) {
      console.error("Login error:", error);
      return {
        success: false,
        error: error.message || "Login failed",
      };
    }
  };

  const register = async (
    username: string,
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      // Create user with Firebase Auth
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Create user document in Firestore
      const newUserData: Omit<FirestoreUser, "createdAt" | "updatedAt"> = {
        uid: result.user.uid,
        username: username,
        email: email,
        firstName: username, // Use username as firstName for email registration
        lastName: "",
        points: 0,
        problemsSolved: 0,
        streak: 0,
        longestStreak: 0,
        solvedProblems: [],
        submissions: [],
      };

      await userService.createUser(newUserData);

      // User data will be handled by onAuthStateChanged
      return { success: !!result.user };
    } catch (error: any) {
      console.error("Registration error:", error);
      return {
        success: false,
        error: error.message || "Registration failed",
      };
    }
  };

  const socialLogin = async (
    provider: "google" | "github"
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      if (provider === "google") {
        const result = await signInWithPopup(auth, googleProvider);
        // User is automatically set by onAuthStateChanged
        return { success: !!result.user };
      } else {
        // GitHub login can be implemented similarly
        console.log("GitHub login not implemented yet");
        return { success: false, error: "GitHub login not implemented yet" };
      }
    } catch (error: any) {
      console.error(`${provider} login error:`, error);
      return {
        success: false,
        error: error.message || `${provider} login failed`,
      };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      // User state is automatically cleared by onAuthStateChanged
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    socialLogin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
