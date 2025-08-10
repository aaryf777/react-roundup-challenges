import {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useEffect,
  useState,
} from "react";
import {
  challengeService,
  categoryService,
  submissionService,
  FirestoreChallenge,
  FirestoreCategory,
  FirestoreSubmission,
} from "@/lib/firestore";
import { CHALLENGES_PER_PAGE } from "@/constants/challenges";
import { useAuth } from "@/contexts/AuthContext";

// Types
export interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  category: string;
  timeEstimate: number;
  solvedBy: number; // Mapped from 'completions'
  points?: number;
  tags: string[];
  companies: string[]; // Mapped from 'companyTags'
  instructions: string;
  starterCode: string;
  solutionCode: string;
  testCases: any[] | string; // Can be a string for special runners
  submissions: number;
  createdAt: any;
  updatedAt: any;
  status: string;
  createdBy: string;
  content: string;
  hints: string[];
  functionName: string;
}

export interface Category {
  id: string;
  name: string; // Mapped from 'category'
  count?: number;
  icon?: string;
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
interface ChallengesContextType extends ChallengesState {
  allChallenges: Challenge[];
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
}

export const ChallengesProvider = ({ children }: ChallengesProviderProps) => {
  const [allChallenges, setAllChallenges] = useState<Challenge[]>([]);
  const [allSubmissions, setAllSubmissions] = useState<FirestoreSubmission[]>(
    []
  );
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  console.log("allChallenges", allChallenges);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [challengesData, categoriesData, submissionsData] =
          await Promise.all([
            challengeService.getChallenges(),
            categoryService.getCategories(),
            submissionService.getAllSubmissions(),
          ]);
        console.log("challengesData", challengesData);
        setAllSubmissions(submissionsData);

        // Calculate submission counts for each challenge
        const submissionCounts = submissionsData.reduce(
          (acc, sub) => {
            acc[sub.challengeId] = (acc[sub.challengeId] || 0) + 1;
            return acc;
          },
          {} as Record<string, number>
        );

        const transformedChallenges = challengesData.map(
          (c: FirestoreChallenge) => {
            const functionNameMatch = (c.starterCode || "").match(
              /function\s+([a-zA-Z0-9_]+)\s*\(/
            );
            const functionName = functionNameMatch ? functionNameMatch[1] : "";

            return {
              ...c,
              timeEstimate: c.estimatedTime,
              solvedBy: c.completions,
              points: c.points || 0,
              submissions: submissionCounts[c.id] || 0,
              companies: c.companyTags,
              content: c.description,
              hints: [],
              functionName,
              testCases: c.testCases, // All challenges now provide a runnable script.
            };
          }
        );
        console.log("transformedChallenges", transformedChallenges);
        const categoryCounts = transformedChallenges.reduce(
          (acc, challenge) => {
            const categoryId = challenge.category
              .toLowerCase()
              .replace(/\s+/g, "-");
            acc[categoryId] = (acc[categoryId] || 0) + 1;
            return acc;
          },
          {} as Record<string, number>
        );

        const transformedCategories = categoriesData.map(
          (c: FirestoreCategory) => ({
            id: c.id,
            name: c.category,
            count: categoryCounts[c.id] || 0,
          })
        );

        setAllChallenges(transformedChallenges as Challenge[]);
        setCategories(transformedCategories as Category[]);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load challenges. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);
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
    const userSubmissions = allSubmissions.filter((s) => s.userId === user?.id);
    const challengeStatus = userSubmissions.find(
      (s) => s.challengeId === challenge.id
    )?.status;

    const matchesStatus =
      state.selectedStatus.length === 0 ||
      (state.selectedStatus.includes("unsolved") && !challengeStatus) ||
      (challengeStatus && state.selectedStatus.includes(challengeStatus));

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
  switch (state.sortBy) {
    case "latest":
      sortedChallenges.sort(
        (a, b) =>
          new Date(b.createdAt.seconds * 1000).getTime() -
          new Date(a.createdAt.seconds * 1000).getTime()
      );
      break;
    case "most-solved":
      sortedChallenges.sort((a, b) => b.solvedBy - a.solvedBy);
      break;
    case "solved-asc":
      sortedChallenges.sort((a, b) => a.solvedBy - b.solvedBy);
      break;
    case "solved-desc":
      sortedChallenges.sort((a, b) => b.solvedBy - a.solvedBy);
      break;
    default:
      break;
  }

  // Get visible challenges
  const visibleChallenges = sortedChallenges.slice(0, state.visibleCount);
  const hasMore = state.visibleCount < sortedChallenges.length;

  const value: ChallengesContextType = {
    ...state,
    allChallenges,
    dispatch,
    scrollToChallenges,
    filteredChallenges: sortedChallenges,
    visibleChallenges,
    hasMore,
    categories,
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading Challenges...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive">{error}</p>
        </div>
      </div>
    );
  }

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
