import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Brain, ChevronDown, ChevronUp, ChevronRight, XCircle } from "lucide-react";
import { Problem } from "@/types/practice";
import { useEffect } from "react";
interface ProblemCardProps {
  problem: Problem;
  selectedAnswer?: string;
  onAnswerSelect: (problemId: number, selectedOption: string) => void;
  showExplanation: boolean;
  onToggleExplanation: () => void;
  onNextQuestion: () => void;
  onEndPractice: () => void;
  hasNextQuestion: boolean;
}
const ProblemCard = ({
  problem,
  selectedAnswer,
  onAnswerSelect,
  showExplanation,
  onToggleExplanation,
  onNextQuestion,
  onEndPractice,
  hasNextQuestion
}: ProblemCardProps) => {
  useEffect(() => {
    // Reset selected answer when problem changes
    const buttons = document.querySelectorAll('button[data-option]');
    buttons.forEach(button => {
      button.classList.remove('bg-green-500', 'bg-red-500', 'hover:bg-green-600', 'hover:bg-red-600');
    });
  }, [problem.id]);
  return <Card className="glass-card p-6 animate-fade-up hover-lift bg-slate-50">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium text-gray-700">{problem.subject}</span>
              <span className="text-sm text-gray-500">•</span>
              <span className="text-sm text-yellow-300">{problem.difficulty}</span>
              <span className="text-sm text-gray-500">•</span>
              <span className="text-sm text-gray-500">{problem.chapter}</span>
            </div>
            <p className="text-lg font-medium mb-4 text-slate-50">{problem.question}</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              {problem.options.map(option => <Button key={option.id} data-option={option.id} variant={selectedAnswer === option.id ? "default" : "outline"} onClick={() => onAnswerSelect(problem.id, option.id)} className="bg-slate-50 text-zinc-950">
                  {option.id}. {option.text}
                </Button>)}
            </div>

            {selectedAnswer && <div className="flex gap-2">
                <Button variant="outline" className="gap-2" onClick={onToggleExplanation}>
                  <Brain className="h-4 w-4" />
                  {showExplanation ? "Hide" : "Show"} Explanation
                  {showExplanation ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
                <Button variant="destructive" className="gap-2" onClick={onEndPractice}>
                  <XCircle className="h-4 w-4" />
                  End Practice
                </Button>
                {hasNextQuestion && <Button variant="outline" className="gap-2" onClick={onNextQuestion}>
                    Next Question
                    <ChevronRight className="h-4 w-4" />
                  </Button>}
              </div>}

            {selectedAnswer && showExplanation && <div className="mt-4 p-4 rounded-lg bg-slate-50">
                <pre className="whitespace-pre-wrap font-mono text-sm text-gray-700">
                  {problem.explanation}
                </pre>
              </div>}
          </div>
        </div>
      </div>
    </Card>;
};
export default ProblemCard;