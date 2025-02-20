
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const AiTutor = () => {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleQuestionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) {
      toast({
        title: "Please enter a question",
        description: "The question field cannot be empty",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    // Here we'll add the AI integration later
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Solution provided",
        description: "Check out the detailed explanation below",
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-tutor-background pt-20 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-tutor-text mb-4">AI Math Tutor</h1>
          <p className="text-gray-600">Get step-by-step solutions and explanations for any math problem</p>
        </div>

        <Card className="p-6 mb-8 animate-fade-up">
          <form onSubmit={handleQuestionSubmit} className="space-y-4">
            <div>
              <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-2">
                Enter your math question
              </label>
              <Input
                id="question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="e.g., Solve for x: 2x + 5 = 13"
                className="w-full"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-tutor-primary hover:bg-tutor-secondary transition-colors"
              disabled={loading}
            >
              {loading ? "Analyzing..." : "Get Solution"}
            </Button>
          </form>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 animate-fade-up" style={{ animationDelay: "0.1s" }}>
            <h2 className="text-xl font-semibold mb-4">Recent Questions</h2>
            <div className="space-y-3">
              <p className="text-gray-600 text-sm">No questions yet. Start by asking one above!</p>
            </div>
          </Card>

          <Card className="p-6 animate-fade-up" style={{ animationDelay: "0.2s" }}>
            <h2 className="text-xl font-semibold mb-4">Learning Progress</h2>
            <div className="space-y-3">
              <p className="text-gray-600 text-sm">Your learning journey will be tracked here</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AiTutor;
