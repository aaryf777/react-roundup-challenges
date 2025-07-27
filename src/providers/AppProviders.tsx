import { ReactNode } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { ChallengesProvider } from "@/contexts/ChallengesContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { useFirestoreInit } from "@/hooks/useFirestoreInit";

interface AppProvidersProps {
  children: ReactNode;
  allChallenges: any[];
  categories: any[];
}

export const AppProviders = ({
  children,
  allChallenges,
  categories,
}: AppProvidersProps) => {
  const { isInitialized, error } = useFirestoreInit();

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Setting up challenges...</p>
        </div>
      </div>
    );
  }

  if (error) {
    console.error("Firestore initialization error:", error);
  }

  return (
    <ThemeProvider>
      <AuthProvider>
        <ChallengesProvider
          allChallenges={allChallenges}
          categories={categories}
        >
          {children}
        </ChallengesProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};
