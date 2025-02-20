
import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Timer, Brain } from "lucide-react";

interface GameProps {
  onComplete: () => void;
}

const MathGame = ({ onComplete }: GameProps) => {
  const [answer, setAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [currentProblem, setCurrentProblem] = useState({ num1: 0, num2: 0, operator: "+" });
  const { toast } = useToast();

  useEffect(() => {
    generateProblem();
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (timeLeft === 0) {
      endGame();
    }
  }, [timeLeft]);

  const generateProblem = () => {
    const operators = ["+", "-", "*"];
    const num1 = Math.floor(Math.random() * 12) + 1;
    const num2 = Math.floor(Math.random() * 12) + 1;
    const operator = operators[Math.floor(Math.random() * operators.length)];
    setCurrentProblem({ num1, num2, operator });
  };

  const checkAnswer = () => {
    let correctAnswer;
    switch (currentProblem.operator) {
      case "+":
        correctAnswer = currentProblem.num1 + currentProblem.num2;
        break;
      case "-":
        correctAnswer = currentProblem.num1 - currentProblem.num2;
        break;
      case "*":
        correctAnswer = currentProblem.num1 * currentProblem.num2;
        break;
      default:
        correctAnswer = 0;
    }

    if (Number(answer) === correctAnswer) {
      setScore((prev) => prev + 1);
      toast({
        title: "Correct! 🎉",
        description: "Keep going!",
      });
    } else {
      toast({
        title: "Not quite right",
        description: `The correct answer was ${correctAnswer}`,
        variant: "destructive",
      });
    }

    setAnswer("");
    generateProblem();
  };

  const endGame = () => {
    toast({
      title: "Game Over!",
      description: `Final score: ${score}`,
    });
    onComplete();
  };

  return (
    <Card className="max-w-md mx-auto glass-card animate-fade-up">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Quick Math Challenge</span>
          <div className="flex items-center gap-2">
            <Timer className="h-5 w-5" />
            <span>{timeLeft}s</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center mb-4">
          <p className="text-2xl font-bold">
            {currentProblem.num1} {currentProblem.operator} {currentProblem.num2} = ?
          </p>
          <p className="text-sm text-gray-500 mt-2">Score: {score}</p>
        </div>
        <div className="flex gap-2">
          <Input
            type="number"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Enter your answer"
            className="text-center"
            onKeyPress={(e) => e.key === "Enter" && checkAnswer()}
          />
          <Button onClick={checkAnswer}>Submit</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MathGame;
