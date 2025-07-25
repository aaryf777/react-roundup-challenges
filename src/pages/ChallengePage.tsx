import { ArrowLeft, BookOpen, Clock, Trophy, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CodeEditor from "@/components/CodeEditor";
import Header from "@/components/Header";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const ChallengePage = () => {
  const navigate = useNavigate();
  const challenge = {
    id: "array-two-sum",
    title: "Two Sum",
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    difficulty: "easy" as const,
    category: "Arrays",
    timeEstimate: "15 min",
    solvedBy: 2547,
    tags: ["Array", "Hash Table", "Two Pointers"],
    content: `
## Problem Statement

Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.

## Examples

### Example 1:
\`\`\`
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].
\`\`\`

### Example 2:
\`\`\`
Input: nums = [3,2,4], target = 6
Output: [1,2]
\`\`\`

### Example 3:
\`\`\`
Input: nums = [3,3], target = 6
Output: [0,1]
\`\`\`

## Constraints

- 2 ≤ nums.length ≤ 10⁴
- -10⁹ ≤ nums[i] ≤ 10⁹
- -10⁹ ≤ target ≤ 10⁹
- Only one valid answer exists.

## Follow-up
Can you come up with an algorithm that is less than O(n²) time complexity?
    `,
    hints: [
      "A really brute force way would be to search for all possible pairs of numbers but that would be too slow.",
      "Think about how you can use a hash table to solve this problem in O(n) time.",
      "While iterating through the array, check if the complement (target - current number) exists in the hash table."
    ]
  };

  const difficultyConfig = {
    easy: { color: "text-difficulty-easy", bg: "bg-difficulty-easy/10" },
    medium: { color: "text-difficulty-medium", bg: "bg-difficulty-medium/10" },
    hard: { color: "text-difficulty-hard", bg: "bg-difficulty-hard/10" }
  };

  const diffConfig = difficultyConfig[challenge.difficulty];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-6">
        <div className="flex items-center space-x-4 mb-6">
          <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Challenges
          </Button>
          <div className="h-4 w-px bg-border" />
          <Badge variant="secondary">{challenge.category}</Badge>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Problem Description */}
          <div className="space-y-6">
            <Card className="bg-gradient-card">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="text-2xl">{challenge.title}</CardTitle>
                    <p className="text-muted-foreground">{challenge.description}</p>
                  </div>
                  <Badge 
                    className={cn(
                      "px-3 py-1 font-medium capitalize",
                      diffConfig.color,
                      diffConfig.bg
                    )}
                  >
                    {challenge.difficulty}
                  </Badge>
                </div>
                
                <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{challenge.timeEstimate}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>{challenge.solvedBy.toLocaleString()} solved</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Trophy className="h-4 w-4 text-accent" />
                    <span>+50 XP</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {challenge.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardHeader>
            </Card>

            <Tabs defaultValue="description" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="description" className="flex items-center space-x-2">
                  <BookOpen className="h-4 w-4" />
                  <span>Description</span>
                </TabsTrigger>
                <TabsTrigger value="hints">Hints</TabsTrigger>
                <TabsTrigger value="solutions">Solutions</TabsTrigger>
              </TabsList>
              
              <TabsContent value="description">
                <Card>
                  <CardContent className="pt-6">
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                      <div dangerouslySetInnerHTML={{ __html: challenge.content.replace(/\n/g, '<br/>').replace(/```/g, '<pre><code>').replace(/`([^`]+)`/g, '<code>$1</code>') }} />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="hints">
                <Card>
                  <CardContent className="pt-6 space-y-4">
                    {challenge.hints.map((hint, index) => (
                      <div key={index} className="p-4 bg-muted rounded-lg">
                        <p className="text-sm">
                          <span className="font-medium">Hint {index + 1}:</span> {hint}
                        </p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="solutions">
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-muted-foreground text-center py-8">
                      Complete the challenge to unlock community solutions
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Code Editor */}
          <div className="space-y-6">
            <Card className="bg-gradient-card">
              <CardHeader>
                <CardTitle className="text-lg">Code Editor</CardTitle>
              </CardHeader>
              <CardContent>
                <CodeEditor 
                  initialCode={`/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    // Write your solution here
    
};`}
                />
              </CardContent>
            </Card>

            <div className="flex space-x-4">
              <Button variant="outline" className="flex-1">
                Save Progress
              </Button>
              <Button className="flex-1 bg-gradient-primary hover:shadow-glow">
                Submit Solution
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChallengePage;