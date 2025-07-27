import { Button } from "@/components/ui/button";
import ChallengeGrid from "@/components/challenge/ChallengeGrid";
import ChallengeSearchSortBar from "@/components/challenge/ChallengeSearchSortBar";
import CategoryFilter from "@/components/challenge/CategoryFilter";
import CompanyFilter from "@/components/challenge/CompanyFilter";
import DifficultyFilter from "@/components/filters/DifficultyFilter";
import StatusFilter from "@/components/filters/StatusFilter";
import { useChallenges } from "@/contexts/ChallengesContext";
import { COMPANY_LIST, SORT_OPTIONS } from "@/constants/challenges";

interface ChallengesSectionProps {
  onChallengeClick: (challengeId: string) => void;
  onLoadMore: () => void;
}

const ChallengesSection = ({
  onChallengeClick,
  onLoadMore,
}: ChallengesSectionProps) => {
  const { state, dispatch, visibleChallenges, hasMore, categories } =
    useChallenges();

  return (
    <section className="py-12">
      <div className="container">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1 space-y-6">
            <CompanyFilter
              companies={COMPANY_LIST}
              selected={state.selectedCompanies}
              onChange={(companies) =>
                dispatch({ type: "SET_SELECTED_COMPANIES", payload: companies })
              }
            />
            <CategoryFilter
              categories={categories}
              selectedCategory={state.selectedCategory}
              onCategoryChange={(category) =>
                dispatch({ type: "SET_CATEGORY", payload: category })
              }
            />
            <DifficultyFilter
              difficultyFilter={state.difficultyFilter}
              setDifficultyFilter={(difficulty) =>
                dispatch({ type: "SET_DIFFICULTY_FILTER", payload: difficulty })
              }
            />
            <StatusFilter
              selectedStatus={state.selectedStatus}
              setSelectedStatus={(status) =>
                dispatch({ type: "SET_SELECTED_STATUS", payload: status })
              }
            />
          </div>

          {/* Challenge Grid */}
          <div className="lg:col-span-3 space-y-6">
            {/* Search and Filters */}
            <ChallengeSearchSortBar
              searchQuery={state.searchQuery}
              setSearchQuery={(query) =>
                dispatch({ type: "SET_SEARCH_QUERY", payload: query })
              }
              sortBy={state.sortBy}
              setSortBy={(sort) =>
                dispatch({ type: "SET_SORT_BY", payload: sort })
              }
              SORT_OPTIONS={SORT_OPTIONS}
            />

            {/* Results Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">
                {state.selectedCategory === "all"
                  ? "All Challenges"
                  : categories.find((c) => c.id === state.selectedCategory)
                      ?.name}
              </h2>
              <span className="text-muted-foreground">
                {visibleChallenges.length} challenges
              </span>
            </div>

            {/* Challenge Cards */}
            <ChallengeGrid
              visibleChallenges={visibleChallenges}
              handleChallengeClick={onChallengeClick}
            />

            {/* Load More Button */}
            {hasMore && (
              <div className="flex justify-center">
                <Button variant="outline" onClick={onLoadMore}>
                  Load More Challenges
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChallengesSection;
