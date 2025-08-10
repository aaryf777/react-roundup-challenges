import { Building, Building2, Clock, Trophy, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ChallengeCardProps } from "./type";

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
  instructions,
  difficulty,
  category,
  timeEstimate,
  submissions,
  points,
  tags,
  companies,
  onClick,
}: ChallengeCardProps) => {
  const diffConfig = difficultyConfig[difficulty];

  return (
    <Card
      className="group cursor-pointer hover:shadow-medium transition-all duration-300 hover:-translate-y-1 bg-gradient-card border-border/50 flex flex-col"
      onClick={onClick}
    >
      <CardHeader className="pb-3 flex-shrink-0">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1 min-w-0">
            <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-1 leading-tight">
              {title}
            </CardTitle>
            <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <Badge variant="secondary" className="text-xs">
                {category}
              </Badge>
              <div className="flex items-center space-x-1">
                <Clock className="h-3 w-3" />
                <span>{timeEstimate}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="h-3 w-3" />
                <span>{submissions} Submissions</span>
              </div>
            </div>
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
        <div
          className="text-sm text-muted-foreground line-clamp-2 prose prose-sm prose-invert max-w-full"
          dangerouslySetInnerHTML={{ __html: instructions }}
        />

        {companies && companies.length > 0 && (
          <div className="flex items-center space-x-2 text-xs text-muted-foreground flex-shrink-0">
            <div className="flex flex-wrap gap-1">
              {companies.map((company) => (
                <Badge
                  key={company}
                  variant="outline"
                  className="text-xs flex items-center gap-1"
                >
                  <Building2 className="h-3 w-3" />
                  {company}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ChallengeCard;
