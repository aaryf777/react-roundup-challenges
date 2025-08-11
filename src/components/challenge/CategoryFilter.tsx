import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Category } from "@/contexts/ChallengesContext";
import { LayoutGrid, Code, BrainCircuit } from "lucide-react";

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (categoryName: string) => void;
}

const getCategoryIcon = (categoryName: string) => {
  switch (categoryName.toLowerCase()) {
    case "algorithm":
      return <BrainCircuit className="h-5 w-5" />;
    case "output based":
      return <Code className="h-5 w-5" />;
    default:
      return <LayoutGrid className="h-5 w-5" />;
  }
};

const CategoryFilter = ({
  categories,
  selectedCategory,
  onCategoryChange,
}: CategoryFilterProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Categories</h3>
      <div className="space-y-2">
        <Button
          variant={selectedCategory === "all" ? "default" : "ghost"}
          className={cn(
            "w-full justify-start h-auto p-3",
            selectedCategory === "all" && "bg-gradient-primary"
          )}
          onClick={() => onCategoryChange("all")}
        >
          <span className="mr-2">🎯</span>
          <span className="flex-1 text-left">All Challenges</span>
          <Badge variant="secondary" className="ml-auto">
            {categories.reduce((sum, cat) => sum + cat.count, 0)}
          </Badge>
        </Button>

        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.name ? "default" : "ghost"}
            className={cn(
              "w-full justify-start h-auto p-3",
              selectedCategory === category.name && "bg-gradient-primary"
            )}
            onClick={() => onCategoryChange(category.name)}
          >
            <span className="flex-1 text-left">{category.name}</span>
            <span className="mr-2">{getCategoryIcon(category.name)}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
