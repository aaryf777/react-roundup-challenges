import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";

interface GoogleAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: any) => void;
  onError: (error: string) => void;
}

const GoogleAuthModal: React.FC<GoogleAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onError,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      // Try popup first, fallback to redirect if popup is blocked
      let result;
      try {
        result = await signInWithPopup(auth, googleProvider);
      } catch (popupError: any) {
        // If popup is blocked, show error message
        if (popupError.code === "auth/popup-blocked") {
          onError(
            "Popup blocked by browser. Please allow popups for this site and try again."
          );
          return;
        }
        throw popupError;
      }

      // Extract user data from Google result
      const firstName = result.user.displayName?.split(" ")[0] || "";
      const lastName =
        result.user.displayName?.split(" ").slice(1).join(" ") || "";
      const username = result.user.email?.split("@")[0] || "User";
      const email = result.user.email || "";

      // Check if user exists in Firestore, if not create them
      try {
        const { userService } = await import("@/lib/firestore");
        const existingUser = await userService.getUser(result.user.uid);

        if (!existingUser) {
          // Create new user in Firestore with complete data
          const newUserData = {
            uid: result.user.uid,
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
        } else {
          // Update existing user with latest data from Google
          await userService.updateUser(result.user.uid, {
            username: username,
            email: email,
            firstName: firstName,
            lastName: lastName,
          });
        }
      } catch (firestoreError) {
        console.error(
          "Error handling Firestore user creation:",
          firestoreError
        );
        // Continue with sign-in even if Firestore fails
      }

      onSuccess(result.user);
      onClose();
    } catch (error: any) {
      console.error("Google sign-in error:", error);
      onError(error.message || "Google sign-in failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Sign in with Google</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center space-y-4 py-4">
          <p className="text-sm text-muted-foreground text-center">
            Choose your Google account to continue
          </p>
          <Button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full"
            variant="outline"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Continue with Google
              </>
            )}
          </Button>
          <Button
            onClick={onClose}
            variant="ghost"
            className="w-full"
            disabled={isLoading}
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GoogleAuthModal;
