
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calculator, Brain, ChevronDown, ChevronUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Option {
  id: string;
  text: string;
}

interface Problem {
  id: number;
  question: string;
  options: Option[];
  correctAnswer: string;
  difficulty: string;
  subject: string;
  explanation: string;
}

const Practice = () => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [showExplanation, setShowExplanation] = useState<Record<number, boolean>>({});
  const { toast } = useToast();

  const problems: Problem[] = [
    {
      id: 1,
      question: "Solve for x: 2x + 5 = 15",
      options: [
        { id: "a", text: "x = 5" },
        { id: "b", text: "x = 10" },
        { id: "c", text: "x = 7.5" },
        { id: "d", text: "x = 6" },
      ],
      correctAnswer: "a",
      difficulty: "Easy",
      subject: "Algebra",
      explanation: `Step 1: Subtract 5 from both sides
2x + 5 - 5 = 15 - 5
2x = 10

Step 2: Divide both sides by 2
2x ÷ 2 = 10 ÷ 2
x = 5`,
    },
    {
      id: 2,
      question: "Find the area of a circle with radius 6",
      options: [
        { id: "a", text: "36π" },
        { id: "b", text: "12π" },
        { id: "c", text: "18π" },
        { id: "d", text: "24π" },
      ],
      correctAnswer: "a",
      difficulty: "Medium",
      subject: "Geometry",
      explanation: `Step 1: Recall the formula for circle area
Area = πr²

Step 2: Substitute r = 6
Area = π(6)²
Area = π(36)
Area = 36π square units`,
    },
    {
      id: 3,
      question: "Simplify: (x² + 2x + 1) - (x² - 2x + 4)",
      options: [
        { id: "a", text: "4x - 3" },
        { id: "b", text: "4x + 3" },
        { id: "c", text: "4x - 5" },
        { id: "d", text: "-3" },
      ],
      correctAnswer: "a",
      difficulty: "Hard",
      subject: "Algebra",
      explanation: `Step 1: Remove parentheses and combine like terms
(x² + 2x + 1) - (x² - 2x + 4)
= x² + 2x + 1 - x² + 2x - 4

Step 2: Cancel out x² terms
= 2x + 2x + 1 - 4

Step 3: Combine like terms
= 4x - 3`,
    },
  ];

  const checkAnswer = (problemId: number, selectedOption: string) => {
    setSelectedAnswers(prev => ({ ...prev, [problemId]: selectedOption }));
    const problem = problems.find(p => p.id === problemId);
    
    if (problem?.correctAnswer === selectedOption) {
      toast({
        title: "Correct! 🎉",
        description: "Great job solving this problem!",
      });
    } else {
      toast({
        title: "Not quite right",
        description: "Click 'Show Explanation' to see the solution steps.",
        variant: "destructive",
      });
    }
  };

  const toggleExplanation = (problemId: number) => {
    setShowExplanation(prev => ({ ...prev, [problemId]: !prev[problemId] }));
  };

  return (
    <div className="min-h-screen bg-tutor-background pt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-tutor-text mb-4">Practice Problems</h1>
          <p className="text-gray-600">Strengthen your math skills with these practice problems</p>
        </div>

        <div className="grid gap-6">
          {problems.map((problem) => (
            <Card key={problem.id} className="glass-card p-6 animate-fade-up hover-lift">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium text-tutor-primary">{problem.subject}</span>
                      <span className="text-sm text-gray-500">•</span>
                      <span className="text-sm text-gray-500">{problem.difficulty}</span>
                    </div>
                    <p className="text-lg font-medium text-tutor-text mb-4">{problem.question}</p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                      {problem.options.map((option) => (
                        <Button
                          key={option.id}
                          variant={selectedAnswers[problem.id] === option.id ? "default" : "outline"}
                          className={`justify-start ${
                            selectedAnswers[problem.id] === option.id &&
                            option.id === problem.correctAnswer
                              ? "bg-green-500 hover:bg-green-600"
                              : selectedAnswers[problem.id] === option.id
                              ? "bg-red-500 hover:bg-red-600"
                              : ""
                          }`}
                          onClick={() => checkAnswer(problem.id, option.id)}
                        >
                          {option.id}. {option.text}
                        </Button>
                      ))}
                    </div>

                    {selectedAnswers[problem.id] && (
                      <Button
                        variant="outline"
                        className="gap-2"
                        onClick={() => toggleExplanation(problem.id)}
                      >
                        <Brain className="h-4 w-4" />
                        {showExplanation[problem.id] ? "Hide" : "Show"} Explanation
                        {showExplanation[problem.id] ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    )}

                    {showExplanation[problem.id] && (
                      <div className="mt-4 p-4 bg-white/50 rounded-lg">
                        <pre className="whitespace-pre-wrap font-mono text-sm text-gray-700">
                          {problem.explanation}
                        </pre>
                      </div>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    className="text-tutor-primary hover:text-tutor-secondary"
                  >
                    <Calculator className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Practice;
