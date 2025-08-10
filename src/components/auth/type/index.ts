// Centralized type definitions for the auth components

export interface GoogleAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: any) => void;
  onError: (error: string) => void;
}

// Export future types here as needed
