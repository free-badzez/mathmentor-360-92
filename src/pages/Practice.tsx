
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calculator } from "lucide-react";

const Practice = () => {
  const [answer, setAnswer] = useState("");

  const problems = [
    {
      id: 1,
      question: "Solve for x: 2x + 5 = 15",
      difficulty: "Easy",
      subject: "Algebra",
    },
    {
      id: 2,
      question: "Find the area of a circle with radius 6",
      difficulty: "Medium",
      subject: "Geometry",
    },
    {
      id: 3,
      question: "Simplify: (x² + 2x + 1) - (x² - 2x + 4)",
      difficulty: "Hard",
      subject: "Algebra",
    },
  ];

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
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-tutor-primary">{problem.subject}</span>
                    <span className="text-sm text-gray-500">•</span>
                    <span className="text-sm text-gray-500">{problem.difficulty}</span>
                  </div>
                  <p className="text-lg font-medium text-tutor-text mb-4">{problem.question}</p>
                  <div className="flex gap-4 items-center">
                    <Input
                      placeholder="Enter your answer"
                      className="max-w-xs"
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                    />
                    <Button variant="outline">Check Answer</Button>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  className="text-tutor-primary hover:text-tutor-secondary"
                >
                  <Calculator className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Practice;
