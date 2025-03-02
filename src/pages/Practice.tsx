
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import ProblemCard from "@/components/ProblemCard";
import MathGame from "@/components/MathGame";
import FloatingCalculator from "@/components/FloatingCalculator";
import ChapterSelector from "@/components/ChapterSelector";
import { Problem, Chapter } from "@/types/practice";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { AlertTriangle } from "lucide-react";

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
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
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
    setErrorDetails(null);
    
    try {
      const chapter = chapters.find(c => c.id === chapterId)?.name;
      
      if (!chapter) {
        throw new Error("Invalid chapter selected");
      }
      
      console.log(`Generating questions for chapter: ${chapter}`);
      
      const { data, error } = await supabase.functions.invoke('generate-math-questions', {
        body: { chapter }
      });

      if (error) {
        console.error("Function invocation error:", error);
        throw error;
      }
      
      if (!data || !data.questions || !Array.isArray(data.questions)) {
        throw new Error("Invalid response format received");
      }
      
      console.log(`Received ${data.questions.length} questions`);
      setProblems(data.questions);
      
      toast({
        title: "Questions generated",
        description: `${data.questions.length} questions ready for practice`,
      });
    } catch (error: any) {
      console.error('Error generating questions:', error);
      
      // Set detailed error message
      if (error.message && typeof error.message === 'string') {
        setErrorDetails(error.message);
      } else if (error.error_description) {
        setErrorDetails(error.error_description);
      } else {
        setErrorDetails("Unknown error occurred. Please try again.");
      }
      
      toast({
        title: "Error generating questions",
        description: "Could not generate practice problems",
        variant: "destructive",
      });
      
      // Reset selected chapter if there's an error
      setSelectedChapter(null);
    } finally {
      setIsLoading(false);
    }
  };

  const checkAnswer = (problemId: number, selectedOption: string) => {
    setSelectedAnswers(prev => ({ ...prev, [problemId]: selectedOption }));
    const problem = problems.find(p => p.id === problemId);
    
    if (problem?.correctAnswer === selectedOption) {
      setCorrectAnswersCount(prev => prev + 1);
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

  const handleRetry = async () => {
    if (selectedChapter) {
      await generateProblems(selectedChapter);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 pt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 space-y-4">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">
            Practice Problems
          </h1>
          <p className="text-muted-foreground text-lg">
            Strengthen your math skills with these practice problems
            {correctAnswersCount > 0 && (
              <span className="ml-2 text-primary">
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
          <Card className="p-8 text-center glass-card animate-pulse">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
              <p className="text-foreground">Generating questions...</p>
              <p className="text-sm text-muted-foreground">This may take a moment</p>
            </div>
          </Card>
        ) : errorDetails ? (
          <Card className="glass-card animate-fade-up p-6">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <AlertTriangle className="h-12 w-12 text-destructive" />
                <h2 className="text-xl font-semibold text-destructive">Error Generating Questions</h2>
                <p className="text-muted-foreground">{errorDetails}</p>
                <div className="flex gap-4 mt-4">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedChapter(null)}
                  >
                    Try Another Chapter
                  </Button>
                  <Button
                    variant="default"
                    onClick={handleRetry}
                  >
                    Retry
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : showGame ? (
          <MathGame onComplete={handleGameComplete} />
        ) : isFinished ? (
          <Card className="glass-card animate-fade-up">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4 text-foreground">Practice Results</h2>
              <div className="space-y-4 text-foreground">
                <p>Total Questions: {problems.length}</p>
                <p>Correct Answers: {correctAnswersCount}</p>
                <p>Accuracy: {calculateAccuracy().toFixed(1)}%</p>
                <Button
                  onClick={() => setSelectedChapter(null)}
                  className="mt-4 w-full"
                  variant="default"
                >
                  Try Another Chapter
                </Button>
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
          <div className="text-center py-8 text-muted-foreground">
            No problems available for this chapter yet.
          </div>
        )}
      </div>
      <FloatingCalculator />
    </div>
  );
};

export default Practice;
