import { TIME_FILTERS } from "@/constants/leaderboard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface LeaderboardFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  timeFilter: string;
  setTimeFilter: (filter: string) => void;
}

const LeaderboardFilters = ({
  searchQuery,
  setSearchQuery,
  timeFilter,
  setTimeFilter,
}: LeaderboardFiltersProps) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
      <Input
        type="text"
        placeholder="Search by username..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full md:w-64"
      />
      <div className="flex gap-2 justify-end">
        {TIME_FILTERS.map((filter) => (
          <Button
            key={filter.value}
            variant={timeFilter === filter.value ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeFilter(filter.value)}
          >
            {filter.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default LeaderboardFilters;
