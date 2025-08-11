import React, { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { Challenge } from "../../contexts/ChallengesContext";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../ui/use-toast";

interface MCQChallengeProps {
  challenge: Challenge;
  onSubmit: (submissionData: any) => Promise<void>;
}

// MCQ options interface
interface MCQOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

const MCQChallenge: React.FC<MCQChallengeProps> = ({ challenge, onSubmit }) => {
  console.log("Challenge data received:", challenge);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Dynamically parse options from challenge data
  const getCorrectOptionId = () => {
    if (!challenge.explanation) return null;
    const match = challenge.explanation.match(/([A-Z])\..*✅/);
    return match ? match[1].toLowerCase() : null;
  };

  const correctOptionId = getCorrectOptionId();

  const options: MCQOption[] = (challenge.options || []).map((optionString) => {
    const id = optionString.charAt(0).toLowerCase();
    const text = optionString.substring(3);
    return {
      id,
      text,
      isCorrect: id === correctOptionId,
    };
  });

  const correctOption = options.find((opt) => opt.isCorrect);

  const handleOptionSelect = (optionId: string) => {
    if (!isSubmitted) {
      setSelectedOption(optionId);
    }
  };

  const handleSubmit = async () => {
    if (!selectedOption || !user) {
      toast({
        title: "Please select an option",
        description: "You must select an answer before submitting.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const selectedOptionData = options.find(
        (opt) => opt.id === selectedOption
      );
      const isCorrect = selectedOptionData?.isCorrect || false;

      const submissionData = {
        challengeId: challenge.id,
        userId: user.id,
        code: `Selected option: ${selectedOption} - ${selectedOptionData?.text}`,
        status: isCorrect ? "accepted" : ("wrong_answer" as const),
        testCasesPassed: isCorrect ? 1 : 0,
        totalTestCases: 1,
        executionTime: 0,
        language: "mcq",
        submittedAt: new Date(),
      };

      await onSubmit(submissionData);
      setIsSubmitted(true);

      if (isCorrect) {
        toast({
          title: "Correct!",
          description: `Great job! You earned ${challenge.points || 25} points.`,
          variant: "default",
        });
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast({
        title: "Submission failed",
        description:
          "There was an error submitting your answer. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-full w-full p-6 overflow-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Multiple Choice Question</span>
            <Badge variant="outline" className="ml-2">
              {challenge.points || 25} points
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Question */}
          <div
            className="prose prose-sm max-w-none dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: challenge.instructions }}
          />

          {/* Options */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">
              Choose the correct output:
            </h3>
            {options.map((option) => {
              const isSelected = selectedOption === option.id;
              const isCorrect = option.isCorrect;
              const showResult = isSubmitted;

              let cardClass =
                "cursor-pointer border-2 transition-all hover:border-primary/50";
              let iconElement = null;

              if (showResult) {
                if (isCorrect) {
                  cardClass +=
                    " border-green-500 bg-green-50 dark:bg-green-900/20";
                  iconElement = (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  );
                } else if (isSelected && !isCorrect) {
                  cardClass += " border-red-500 bg-red-50 dark:bg-red-900/20";
                  iconElement = <XCircle className="h-5 w-5 text-red-600" />;
                } else {
                  cardClass += " border-gray-300 dark:border-gray-600";
                }
              } else if (isSelected) {
                cardClass += " border-primary bg-primary/10";
                iconElement = <AlertCircle className="h-5 w-5 text-primary" />;
              } else {
                cardClass += " border-gray-300 dark:border-gray-600";
              }

              return (
                <Card
                  key={option.id}
                  className={cardClass}
                  onClick={() => handleOptionSelect(option.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="font-semibold text-lg">
                          {option.id.toUpperCase()}.
                        </span>
                        <code className="bg-muted px-2 py-1 rounded text-sm">
                          {option.text}
                        </code>
                      </div>
                      {iconElement}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-4">
            <Button
              onClick={handleSubmit}
              disabled={!selectedOption || isSubmitting || isSubmitted}
              size="lg"
              className="min-w-[120px]"
            >
              {isSubmitting
                ? "Submitting..."
                : isSubmitted
                  ? "Submitted"
                  : "Submit Answer"}
            </Button>
          </div>

          {/* Explanation */}
          {isSubmitted && challenge.explanation && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  Explanation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className="prose prose-sm max-w-none dark:prose-invert"
                  dangerouslySetInnerHTML={{ __html: challenge.explanation }}
                />
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MCQChallenge;
