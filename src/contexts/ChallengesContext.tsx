import { createContext, useContext, useReducer, ReactNode } from "react";
import { CHALLENGES_PER_PAGE } from "@/constants/challenges";

// Types
export interface Challenge {
  title: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  category: string;
  timeEstimate: string;
  solvedBy: number;
  points: number;
  tags: string[];
  companies: string[];
}

export interface Category {
  id: string;
  name: string;
  count: number;
  icon: string;
}

// State interface
interface ChallengesState {
  searchQuery: string;
  selectedCategory: string;
  difficultyFilter: string;
  selectedCompanies: string[];
  selectedStatus: string[];
  sortBy: string;
  visibleCount: number;
  challengesSectionRef: React.RefObject<HTMLDivElement> | null;
}

// Action types
type ChallengesAction =
  | { type: "SET_SEARCH_QUERY"; payload: string }
  | { type: "SET_CATEGORY"; payload: string }
  | { type: "SET_DIFFICULTY_FILTER"; payload: string }
  | { type: "SET_SELECTED_COMPANIES"; payload: string[] }
  | { type: "SET_SELECTED_STATUS"; payload: string[] }
  | { type: "SET_SORT_BY"; payload: string }
  | { type: "LOAD_MORE_CHALLENGES" }
  | {
      type: "SET_CHALLENGES_SECTION_REF";
      payload: React.RefObject<HTMLDivElement>;
    };

// Initial state
const initialState: ChallengesState = {
  searchQuery: "",
  selectedCategory: "all",
  difficultyFilter: "all",
  selectedCompanies: ["All"],
  selectedStatus: [],
  sortBy: "latest",
  visibleCount: CHALLENGES_PER_PAGE,
  challengesSectionRef: null,
};

// Reducer
function challengesReducer(
  state: ChallengesState,
  action: ChallengesAction
): ChallengesState {
  switch (action.type) {
    case "SET_SEARCH_QUERY":
      return { ...state, searchQuery: action.payload };
    case "SET_CATEGORY":
      return { ...state, selectedCategory: action.payload };
    case "SET_DIFFICULTY_FILTER":
      return { ...state, difficultyFilter: action.payload };
    case "SET_SELECTED_COMPANIES":
      return { ...state, selectedCompanies: action.payload };
    case "SET_SELECTED_STATUS":
      return { ...state, selectedStatus: action.payload };
    case "SET_SORT_BY":
      return { ...state, sortBy: action.payload };
    case "LOAD_MORE_CHALLENGES":
      return {
        ...state,
        visibleCount: state.visibleCount + CHALLENGES_PER_PAGE,
      };
    case "SET_CHALLENGES_SECTION_REF":
      return { ...state, challengesSectionRef: action.payload };
    default:
      return state;
  }
}

// Context interface
interface ChallengesContextType {
  state: ChallengesState;
  dispatch: React.Dispatch<ChallengesAction>;
  scrollToChallenges: () => void;
  filteredChallenges: Challenge[];
  visibleChallenges: Challenge[];
  hasMore: boolean;
  categories: Category[];
}

// Create context
const ChallengesContext = createContext<ChallengesContextType | undefined>(
  undefined
);

// Provider component
interface ChallengesProviderProps {
  children: ReactNode;
  allChallenges: Challenge[];
  categories: Category[];
}

export const ChallengesProvider = ({
  children,
  allChallenges,
  categories,
}: ChallengesProviderProps) => {
  const [state, dispatch] = useReducer(challengesReducer, initialState);

  // Scroll to challenges function
  const scrollToChallenges = () => {
    if (state.challengesSectionRef?.current) {
      state.challengesSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Filter challenges based on current state
  const filteredChallenges = allChallenges.filter((challenge) => {
    const matchesCategory =
      state.selectedCategory === "all" ||
      challenge.category.toLowerCase().replace(/\s+/g, "-") ===
        state.selectedCategory;
    const matchesDifficulty =
      state.difficultyFilter === "all" ||
      challenge.difficulty === state.difficultyFilter;
    const matchesSearch =
      state.searchQuery.trim() === "" ||
      challenge.title.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
      challenge.description
        .toLowerCase()
        .includes(state.searchQuery.toLowerCase());
    const matchesCompany =
      state.selectedCompanies.includes("All") ||
      (challenge.companies &&
        challenge.companies.some((c: string) =>
          state.selectedCompanies.includes(c)
        ));
    const isSolved = Math.random() > 0.6; // 40% chance of being solved (mock)
    const matchesStatus =
      state.selectedStatus.length === 0 ||
      (state.selectedStatus.includes("solved") && isSolved) ||
      (state.selectedStatus.includes("unsolved") && !isSolved);

    return (
      matchesCategory &&
      matchesDifficulty &&
      matchesSearch &&
      matchesCompany &&
      matchesStatus
    );
  });

  // Sort challenges
  let sortedChallenges = [...filteredChallenges];
  if (state.sortBy === "solved-desc") {
    sortedChallenges = sortedChallenges.sort((a, b) => b.solvedBy - a.solvedBy);
  } else if (state.sortBy === "solved-asc") {
    sortedChallenges = sortedChallenges.sort((a, b) => a.solvedBy - b.solvedBy);
  }

  // Get visible challenges
  const visibleChallenges = sortedChallenges.slice(0, state.visibleCount);
  const hasMore = state.visibleCount < sortedChallenges.length;

  const value: ChallengesContextType = {
    state,
    dispatch,
    scrollToChallenges,
    filteredChallenges: sortedChallenges,
    visibleChallenges,
    hasMore,
    categories,
  };

  return (
    <ChallengesContext.Provider value={value}>
      {children}
    </ChallengesContext.Provider>
  );
};

// Custom hook to use the context
export const useChallenges = () => {
  const context = useContext(ChallengesContext);
  if (context === undefined) {
    throw new Error("useChallenges must be used within a ChallengesProvider");
  }
  return context;
};
