import { Button } from "@/components/ui/button";
import ChallengeGrid from "@/components/challenge/ChallengeGrid";
import ChallengeSearchSortBar from "@/components/challenge/ChallengeSearchSortBar";
import CategoryFilter from "@/components/challenge/CategoryFilter";
import CompanyFilter from "@/components/challenge/CompanyFilter";
import DifficultyFilter from "@/components/filters/DifficultyFilter";
import StatusFilter from "@/components/filters/StatusFilter";
import { useChallenges } from "@/contexts/ChallengesContext";
import { COMPANY_LIST, SORT_OPTIONS } from "@/constants/challenges";
import type { ChallengesSectionProps } from "./type";
import { SearchX } from "lucide-react";

const ChallengesSection = ({
  onChallengeClick,
  onLoadMore,
}: ChallengesSectionProps) => {
  const {
    dispatch,
    visibleChallenges,
    hasMore,
    categories,
    selectedCompanies,
    selectedCategory,
    difficultyFilter,
    selectedStatus,
    searchQuery,
    sortBy,
  } = useChallenges();

  return (
    <section className="py-12">
      <div className="container">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1 space-y-6">
            <CompanyFilter
              companies={COMPANY_LIST}
              selected={selectedCompanies}
              onChange={(companies) =>
                dispatch({ type: "SET_SELECTED_COMPANIES", payload: companies })
              }
            />
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={(category) =>
                dispatch({ type: "SET_CATEGORY", payload: category })
              }
            />
            <DifficultyFilter
              difficultyFilter={difficultyFilter}
              setDifficultyFilter={(difficulty) =>
                dispatch({ type: "SET_DIFFICULTY_FILTER", payload: difficulty })
              }
            />
            <StatusFilter
              selectedStatus={selectedStatus}
              setSelectedStatus={(status) =>
                dispatch({ type: "SET_SELECTED_STATUS", payload: status })
              }
            />
          </div>

          {/* Challenge Grid */}
          <div className="lg:col-span-3 space-y-6">
            {/* Search and Filters */}
            <ChallengeSearchSortBar
              searchQuery={searchQuery}
              setSearchQuery={(query) =>
                dispatch({ type: "SET_SEARCH_QUERY", payload: query })
              }
              sortBy={sortBy}
              setSortBy={(sort) =>
                dispatch({ type: "SET_SORT_BY", payload: sort })
              }
              SORT_OPTIONS={SORT_OPTIONS}
            />

            {/* Results Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">
                {selectedCategory === "all"
                  ? "All Challenges"
                  : categories.find((c) => c.id === selectedCategory)?.name}
              </h2>
              <span className="text-muted-foreground">
                {visibleChallenges.length} challenges
              </span>
            </div>

            {/* Challenge Cards */}
            {visibleChallenges.length > 0 ? (
              <ChallengeGrid
                visibleChallenges={visibleChallenges}
                handleChallengeClick={(challenge) =>
                  onChallengeClick(challenge.id)
                }
              />
            ) : (
              <div className="text-center py-12">
                <SearchX className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="text-xl font-semibold mt-4">
                  No Challenges Found
                </h3>
                <p className="text-muted-foreground mt-2">
                  Try adjusting your filters or search query.
                </p>
              </div>
            )}

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
