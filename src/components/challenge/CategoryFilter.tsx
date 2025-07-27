import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
  count: number;
  icon: string;
}

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

const CategoryFilter = ({ categories, selectedCategory, onCategoryChange }: CategoryFilterProps) => {
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
            variant={selectedCategory === category.id ? "default" : "ghost"}
            className={cn(
              "w-full justify-start h-auto p-3",
              selectedCategory === category.id && "bg-gradient-primary"
            )}
            onClick={() => onCategoryChange(category.id)}
          >
            <span className="mr-2">{category.icon}</span>
            <span className="flex-1 text-left">{category.name}</span>
            <Badge variant="secondary" className="ml-auto">
              {category.count}
            </Badge>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;