import { useEffect, useState } from "react";
import { initializeDefaultData } from "@/lib/firestore";

export const useFirestoreInit = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initFirestore = async () => {
      try {
        await initializeDefaultData();
        setIsInitialized(true);
      } catch (err) {
        console.error("Error initializing Firestore:", err);
        setError(
          err instanceof Error ? err.message : "Failed to initialize database"
        );
        setIsInitialized(true); // Still set to true to not block the app
      }
    };

    initFirestore();
  }, []);

  return { isInitialized, error };
};
