import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DifficultyFilterProps {
  difficultyFilter: string;
  setDifficultyFilter: (val: string) => void;
}

const DifficultyFilter = ({
  difficultyFilter,
  setDifficultyFilter,
}: DifficultyFilterProps) => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold">Difficulty</h3>
    <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
      <SelectTrigger>
        <SelectValue placeholder="Select difficulty" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Levels</SelectItem>
        <SelectItem value="easy">Easy</SelectItem>
        <SelectItem value="medium">Medium</SelectItem>
        <SelectItem value="hard">Hard</SelectItem>
      </SelectContent>
    </Select>
  </div>
);

export default DifficultyFilter;
