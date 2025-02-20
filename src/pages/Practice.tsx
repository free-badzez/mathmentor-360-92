
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import ProblemCard from "@/components/ProblemCard";
import MathGame from "@/components/MathGame";
import FloatingCalculator from "@/components/FloatingCalculator";
import ChapterSelector from "@/components/ChapterSelector";
import { Problem, Chapter } from "@/types/practice";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

const Practice = () => {
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [showExplanation, setShowExplanation] = useState<Record<number, boolean>>({});
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [showGame, setShowGame] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const chapters: Chapter[] = [
    { id: "algebra-1", name: "Algebra Basics", subject: "Algebra" },
    { id: "algebra-2", name: "Equations", subject: "Algebra" },
    { id: "geometry-1", name: "Circles", subject: "Geometry" },
    { id: "geometry-2", name: "Triangles", subject: "Geometry" },
    { id: "polynomial", name: "Polynomials", subject: "Algebra" },
    { id: "trigonometry", name: "Trigonometry", subject: "Trigonometry" },
  ];

  const generateProblems = async (chapterId: string) => {
    setIsLoading(true);
    try {
      const chapter = chapters.find(c => c.id === chapterId)?.name;
      const { data, error } = await supabase.functions.invoke('generate-math-questions', {
        body: { chapter }
      });

      if (error) throw error;
      setProblems(data.questions);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error generating questions",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const checkAnswer = (problemId: number, selectedOption: string) => {
    setSelectedAnswers(prev => ({ ...prev, [problemId]: selectedOption }));
    const problem = problems.find(p => p.id === problemId);
    
    if (problem?.correctAnswer === selectedOption) {
      setCorrectAnswersCount(prev => prev + 1);
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

  const handleGameComplete = () => {
    setShowGame(false);
  };

  const handleNextQuestion = () => {
    if (currentProblemIndex < problems.length - 1) {
      setCurrentProblemIndex(prev => prev + 1);
    }
  };

  const handleEndPractice = () => {
    setIsFinished(true);
  };

  const toggleExplanation = (problemId: number) => {
    setShowExplanation(prev => ({ ...prev, [problemId]: !prev[problemId] }));
  };

  const handleChapterSelect = async (chapterId: string) => {
    setSelectedChapter(chapterId);
    setCurrentProblemIndex(0);
    setSelectedAnswers({});
    setShowExplanation({});
    setCorrectAnswersCount(0);
    setIsFinished(false);
    await generateProblems(chapterId);
  };

  const calculateAccuracy = () => {
    if (Object.keys(selectedAnswers).length === 0) return 0;
    return (correctAnswersCount / Object.keys(selectedAnswers).length) * 100;
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
        ) : isLoading ? (
          <Card className="p-8 text-center">
            <p>Generating questions...</p>
          </Card>
        ) : showGame ? (
          <MathGame onComplete={handleGameComplete} />
        ) : isFinished ? (
          <Card className="p-8">
            <CardContent>
              <h2 className="text-2xl font-bold mb-4">Practice Results</h2>
              <div className="space-y-4">
                <p>Total Questions: {problems.length}</p>
                <p>Correct Answers: {correctAnswersCount}</p>
                <p>Accuracy: {calculateAccuracy().toFixed(1)}%</p>
                <button
                  onClick={() => setSelectedChapter(null)}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Try Another Chapter
                </button>
              </div>
            </CardContent>
          </Card>
        ) : problems.length > 0 ? (
          <ProblemCard
            problem={problems[currentProblemIndex]}
            selectedAnswer={selectedAnswers[problems[currentProblemIndex].id]}
            onAnswerSelect={checkAnswer}
            showExplanation={showExplanation[problems[currentProblemIndex].id]}
            onToggleExplanation={() => toggleExplanation(problems[currentProblemIndex].id)}
            onNextQuestion={handleNextQuestion}
            onEndPractice={handleEndPractice}
            hasNextQuestion={currentProblemIndex < problems.length - 1}
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
