
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import ProblemCard from "@/components/ProblemCard";
import MathGame from "@/components/MathGame";
import FloatingCalculator from "@/components/FloatingCalculator";
import ChapterSelector from "@/components/ChapterSelector";
import { Problem, Chapter } from "@/types/practice";

const Practice = () => {
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [showExplanation, setShowExplanation] = useState<Record<number, boolean>>({});
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [showGame, setShowGame] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null);
  const { toast } = useToast();

  const chapters: Chapter[] = [
    { id: "algebra-1", name: "Algebra Basics", subject: "Algebra" },
    { id: "algebra-2", name: "Equations", subject: "Algebra" },
    { id: "geometry-1", name: "Circles", subject: "Geometry" },
    { id: "geometry-2", name: "Triangles", subject: "Geometry" },
  ];

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
      chapter: "Equations",
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
      chapter: "Circles",
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
      chapter: "Equations",
      explanation: `Step 1: Remove parentheses and combine like terms
(x² + 2x + 1) - (x² - 2x + 4)
= x² + 2x + 1 - x² + 2x - 4

Step 2: Cancel out x² terms
= 2x + 2x + 1 - 4

Step 3: Combine like terms
= 4x - 3`,
    },
  ];

  const filteredProblems = selectedChapter
    ? problems.filter(p => p.chapter === chapters.find(c => c.id === selectedChapter)?.name)
    : [];

  const checkAnswer = (problemId: number, selectedOption: string) => {
    setSelectedAnswers(prev => ({ ...prev, [problemId]: selectedOption }));
    const problem = problems.find(p => p.id === problemId);
    
    if (problem?.correctAnswer === selectedOption) {
      const newCorrectCount = correctAnswersCount + 1;
      setCorrectAnswersCount(newCorrectCount);
      
      toast({
        title: "Correct! 🎉",
        description: "Great job solving this problem!",
      });

      if (newCorrectCount % 3 === 0) {
        setShowGame(true);
      }
    } else {
      toast({
        title: "Not quite right",
        description: "Click 'Show Explanation' to see the solution steps.",
        variant: "destructive",
      });
    }
  };

  const handleGameComplete = () => {
    setShowGame(false);
  };

  const handleNextQuestion = () => {
    if (currentProblemIndex < filteredProblems.length - 1) {
      setCurrentProblemIndex(prev => prev + 1);
    }
  };

  const toggleExplanation = (problemId: number) => {
    setShowExplanation(prev => ({ ...prev, [problemId]: !prev[problemId] }));
  };

  const handleChapterSelect = (chapterId: string) => {
    setSelectedChapter(chapterId);
    setCurrentProblemIndex(0);
    setSelectedAnswers({});
    setShowExplanation({});
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Practice Problems</h1>
          <p className="text-gray-600">
            Strengthen your math skills with these practice problems
            {correctAnswersCount > 0 && (
              <span className="ml-2">
                • Score: {correctAnswersCount} ✨
              </span>
            )}
          </p>
        </div>

        {!selectedChapter ? (
          <ChapterSelector
            chapters={chapters}
            selectedChapter={selectedChapter}
            onChapterSelect={handleChapterSelect}
          />
        ) : showGame ? (
          <MathGame onComplete={handleGameComplete} />
        ) : filteredProblems.length > 0 ? (
          <ProblemCard
            problem={filteredProblems[currentProblemIndex]}
            selectedAnswer={selectedAnswers[filteredProblems[currentProblemIndex].id]}
            onAnswerSelect={checkAnswer}
            showExplanation={showExplanation[filteredProblems[currentProblemIndex].id]}
            onToggleExplanation={() => toggleExplanation(filteredProblems[currentProblemIndex].id)}
            onNextQuestion={handleNextQuestion}
            hasNextQuestion={currentProblemIndex < filteredProblems.length - 1}
          />
        ) : (
          <div className="text-center py-8 text-gray-600">
            No problems available for this chapter yet.
          </div>
        )}
      </div>
      <FloatingCalculator />
    </div>
  );
};

export default Practice;
