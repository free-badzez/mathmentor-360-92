
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Brain, ChevronDown, ChevronUp, ChevronRight } from "lucide-react";
import { Problem } from "@/types/practice";

interface ProblemCardProps {
  problem: Problem;
  selectedAnswer?: string;
  onAnswerSelect: (problemId: number, selectedOption: string) => void;
  showExplanation: boolean;
  onToggleExplanation: () => void;
  onNextQuestion: () => void;
  hasNextQuestion: boolean;
}

const ProblemCard = ({
  problem,
  selectedAnswer,
  onAnswerSelect,
  showExplanation,
  onToggleExplanation,
  onNextQuestion,
  hasNextQuestion,
}: ProblemCardProps) => {
  return (
    <Card className="glass-card p-6 animate-fade-up hover-lift">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium text-gray-700">{problem.subject}</span>
              <span className="text-sm text-gray-500">•</span>
              <span className="text-sm text-gray-500">{problem.difficulty}</span>
              <span className="text-sm text-gray-500">•</span>
              <span className="text-sm text-gray-500">{problem.chapter}</span>
            </div>
            <p className="text-lg font-medium text-gray-800 mb-4">{problem.question}</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              {problem.options.map((option) => (
                <Button
                  key={option.id}
                  variant={selectedAnswer === option.id ? "default" : "outline"}
                  className={`justify-start ${
                    selectedAnswer === option.id &&
                    option.id === problem.correctAnswer
                      ? "bg-green-500 hover:bg-green-600"
                      : selectedAnswer === option.id
                      ? "bg-red-500 hover:bg-red-600"
                      : ""
                  }`}
                  onClick={() => onAnswerSelect(problem.id, option.id)}
                >
                  {option.id}. {option.text}
                </Button>
              ))}
            </div>

            {selectedAnswer && (
              <Button
                variant="outline"
                className="gap-2"
                onClick={onToggleExplanation}
              >
                <Brain className="h-4 w-4" />
                {showExplanation ? "Hide" : "Show"} Explanation
                {showExplanation ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            )}

            {showExplanation && (
              <div className="mt-4 p-4 bg-white/50 rounded-lg">
                <pre className="whitespace-pre-wrap font-mono text-sm text-gray-700">
                  {problem.explanation}
                </pre>
              </div>
            )}
          </div>
          {selectedAnswer && hasNextQuestion && (
            <Button
              variant="outline"
              size="icon"
              className="text-gray-700 hover:text-gray-900 hover:bg-gray-100"
              onClick={onNextQuestion}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ProblemCard;
