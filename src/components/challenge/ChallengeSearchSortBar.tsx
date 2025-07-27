import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ChallengeSearchSortBarProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  sortBy: string;
  setSortBy: (val: string) => void;
  SORT_OPTIONS: { label: string; value: string }[];
}

const ChallengeSearchSortBar = ({
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
  SORT_OPTIONS,
}: ChallengeSearchSortBarProps) => (
  <div className="flex flex-col sm:flex-row gap-4">
    <div className="relative flex-1">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search challenges..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="pl-10"
      />
    </div>
    <Select value={sortBy} onValueChange={setSortBy}>
      <SelectTrigger className="sm:w-48">
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        {SORT_OPTIONS.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);

export default ChallengeSearchSortBar;
