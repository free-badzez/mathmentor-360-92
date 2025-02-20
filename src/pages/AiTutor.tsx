import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Brain, MessageCircle, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface FormulaSection {
  title: string;
  formulas: Array<{
    name: string;
    formula: string;
    explanation: string;
    example: string;
  }>;
}

const formulaSections: FormulaSection[] = [
  {
    title: "Algebra Basics",
    formulas: [
      {
        name: "Quadratic Formula",
        formula: "x = (-b ± √(b² - 4ac)) / 2a",
        explanation: "Used to solve quadratic equations in the form ax² + bx + c = 0",
        example: "For x² + 5x + 6 = 0:\na = 1, b = 5, c = 6\nx = (-5 ± √(25 - 24)) / 2\nx = -2 or -3"
      },
      {
        name: "FOIL Method",
        formula: "(a + b)(c + d) = ac + ad + bc + bd",
        explanation: "Used to multiply two binomials: First, Outer, Inner, Last",
        example: "(x + 2)(x + 3) = x² + 3x + 2x + 6 = x² + 5x + 6"
      }
    ]
  },
  {
    title: "Polynomial",
    formulas: [
      {
        name: "Polynomial Long Division",
        formula: "Dividend ÷ Divisor = Quotient + Remainder/Divisor",
        explanation: "Used to divide polynomials by factoring step by step",
        example: "(x³ + 2x² - 4) ÷ (x + 2) = x² - 2x + 6"
      },
      {
        name: "Synthetic Division",
        formula: "Quick method for dividing by (x - r)",
        explanation: "Used when dividing by a linear factor x - r",
        example: "x³ - 6x² + 11x - 6 divided by x - 1"
      }
    ]
  },
  {
    title: "Areas and Perimeters",
    formulas: [
      {
        name: "Rectangle",
        formula: "Area = length × width\nPerimeter = 2(length + width)",
        explanation: "Basic formulas for rectangular shapes",
        example: "For a rectangle with length 5 and width 3:\nArea = 5 × 3 = 15\nPerimeter = 2(5 + 3) = 16"
      },
      {
        name: "Circle",
        formula: "Area = πr²\nCircumference = 2πr",
        explanation: "r is the radius of the circle",
        example: "For a circle with radius 4:\nArea = π(4²) = 50.27\nCircumference = 2π(4) = 25.13"
      },
      {
        name: "Triangle",
        formula: "Area = ½ × base × height\nPerimeter = a + b + c",
        explanation: "a, b, c are the sides of the triangle",
        example: "For a triangle with base 6 and height 4:\nArea = ½ × 6 × 4 = 12"
      }
    ]
  }
];

const AiTutor = () => {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
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
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: question,
      timestamp: new Date(),
    };
    
    setChatHistory(prev => [...prev, userMessage]);

    try {
      const { data, error } = await supabase.functions.invoke('gemini-tutor', {
        body: { question: question }
      });

      if (error) throw error;

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: data.answer,
        timestamp: new Date(),
      };
      
      setChatHistory(prev => [...prev, aiMessage]);
      setQuestion("");
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error getting response",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">AI Math Tutor</h1>
          <p className="text-gray-600">Get instant help with any math problem or concept</p>
        </div>

        <Card className="mb-8">
          <CardContent className="p-6">
            <form onSubmit={handleQuestionSubmit} className="space-y-4">
              <div className="flex gap-4">
                <Input
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="e.g., How do I solve quadratic equations?"
                  className="flex-1"
                />
                <Button 
                  type="submit" 
                  className="bg-blue-600 hover:bg-blue-700 transition-colors gap-2"
                  disabled={loading}
                >
                  {loading ? <MessageCircle className="animate-spin" /> : <Send />}
                  {loading ? "Thinking..." : "Ask"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {chatHistory.map((message) => (
            <Card 
              key={message.id} 
              className={message.type === 'user' ? 'bg-white' : 'bg-blue-50'}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  {message.type === 'user' ? (
                    <MessageCircle className="h-6 w-6 text-gray-500" />
                  ) : (
                    <Brain className="h-6 w-6 text-blue-500" />
                  )}
                  <div className="flex-1">
                    <p className="text-gray-700 whitespace-pre-wrap">{message.content}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AiTutor;
