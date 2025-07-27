import { Clock, Trophy, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ChallengeCardProps {
  title: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  category: string;
  timeEstimate: string;
  solvedBy: number;
  points: number;
  tags: string[];
  onClick: () => void;
}

const difficultyConfig = {
  easy: {
    color: "text-difficulty-easy",
    bg: "bg-difficulty-easy/10",
    label: "Easy",
  },
  medium: {
    color: "text-difficulty-medium",
    bg: "bg-difficulty-medium/10",
    label: "Medium",
  },
  hard: {
    color: "text-difficulty-hard",
    bg: "bg-difficulty-hard/10",
    label: "Hard",
  },
};

const ChallengeCard = ({
  title,
  description,
  difficulty,
  category,
  timeEstimate,
  solvedBy,
  points,
  tags,
  onClick,
}: ChallengeCardProps) => {
  const diffConfig = difficultyConfig[difficulty];

  return (
    <Card
      className="group cursor-pointer hover:shadow-medium transition-all duration-300 hover:-translate-y-1 bg-gradient-card border-border/50 h-[240px] flex flex-col"
      onClick={onClick}
    >
      <CardHeader className="pb-3 flex-shrink-0">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1 min-w-0">
            <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-1 leading-tight">
              {title}
            </CardTitle>
            <Badge variant="secondary" className="text-xs">
              {category}
            </Badge>
          </div>
          <Badge
            className={cn(
              "px-3 py-1 text-xs font-medium flex-shrink-0 ml-2",
              diffConfig.color,
              diffConfig.bg
            )}
          >
            {diffConfig.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 flex-1 flex flex-col">
        <p className="text-sm text-muted-foreground line-clamp-2 flex-shrink-0">
          {description}
        </p>

        <div className="flex items-center justify-between text-xs text-muted-foreground flex-shrink-0">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Clock className="h-3 w-3" />
              <span>{timeEstimate}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="h-3 w-3" />
              <span>{solvedBy.toLocaleString()}</span>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Trophy className="h-4 w-4 text-accent" />
            <span>+{points} XP</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mt-auto">
          {tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{tags.length - 3}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ChallengeCard;
