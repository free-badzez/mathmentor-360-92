
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Brain, MessageCircle, Send, AlertTriangle, RefreshCw } from "lucide-react";
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
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleQuestionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) {
      toast({
        title: "No math question asked",
        description: "Please enter a math question to get help",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setError(null);
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: question,
      timestamp: new Date(),
    };
    
    setChatHistory(prev => [...prev, userMessage]);

    try {
      console.log("Sending question to gemini-tutor function:", question);
      
      const { data, error: functionError } = await supabase.functions.invoke('gemini-tutor', {
        body: { question: question }
      });

      if (functionError) {
        console.error('Function invocation error:', functionError);
        throw new Error(functionError.message || 'Error invoking function');
      }

      if (!data || !data.answer) {
        throw new Error('Invalid response format received');
      }

      console.log("Received response from gemini-tutor function");
      
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: data.answer,
        timestamp: new Date(),
      };
      
      setChatHistory(prev => [...prev, aiMessage]);
      setQuestion("");
    } catch (error: any) {
      console.error('Error:', error);
      
      let errorMessage = "Failed to get a response. Please try again later.";
      
      if (error.message && typeof error.message === 'string') {
        errorMessage = error.message;
      } else if (error.error_description) {
        errorMessage = error.error_description;
      } else if (error.statusText) {
        errorMessage = `Server error: ${error.statusText}`;
      }
      
      if (errorMessage.includes('API key')) {
        errorMessage = "Missing or invalid API key. Please check the Gemini API key configuration.";
      }
      
      setError(errorMessage);
      
      toast({
        title: "Error getting response",
        description: "Could not get an answer from the AI tutor",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setError(null);
    if (question) {
      handleQuestionSubmit(new Event('submit') as unknown as React.FormEvent);
    }
  };

  const renderFormulaSections = () => {
    if (chatHistory.length > 0) return null;
    
    return (
      <div className="mt-8 space-y-8">
        <h2 className="text-2xl font-bold text-center mb-4">Common Math Formulas</h2>
        {formulaSections.map((section, idx) => (
          <Card key={idx} className="glass-card">
            <CardContent className="p-4">
              <h3 className="text-xl font-semibold mb-2">{section.title}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {section.formulas.map((formula, fidx) => (
                  <div key={fidx} className="rounded-md bg-secondary/10 p-3">
                    <h4 className="font-medium text-primary">{formula.name}</h4>
                    <p className="font-mono text-sm my-1 whitespace-pre-wrap">{formula.formula}</p>
                    <p className="text-sm text-muted-foreground">{formula.explanation}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground pt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">AI Math Tutor</h1>
          <p className="text-muted-foreground">Get instant help with any math problem or concept</p>
        </div>

        <Card className="mb-8 glass-card">
          <CardContent className="p-6">
            <form onSubmit={handleQuestionSubmit} className="space-y-4">
              <div className="flex gap-4">
                <Input
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="e.g., How do I solve quadratic equations?"
                  className="flex-1 bg-background text-foreground"
                  disabled={loading}
                />
                <Button 
                  type="submit" 
                  className="gap-2"
                  disabled={loading}
                >
                  {loading ? <MessageCircle className="animate-spin" /> : <Send className="text-current" />}
                  {loading ? "Thinking..." : "Ask"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {error && (
          <Card className="mb-6 border-destructive glass-card">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-6 w-6 text-destructive" />
                <div className="flex-1">
                  <h3 className="font-medium text-destructive">Error getting AI response</h3>
                  <p className="text-muted-foreground">{error}</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2 gap-1"
                    onClick={handleRetry}
                  >
                    <RefreshCw className="h-3 w-3" /> Retry
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {chatHistory.length === 0 && !error && (
          <Card className="glass-card mb-6">
            <CardContent className="p-4 text-center text-muted-foreground">
              <MessageCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No math questions asked yet. Ask a question to get started!</p>
            </CardContent>
          </Card>
        )}

        <div className="space-y-6">
          {chatHistory.map((message) => (
            <Card 
              key={message.id} 
              className={`glass-card ${message.type === 'user' ? 'bg-secondary' : 'bg-primary/5'}`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  {message.type === 'user' ? (
                    <MessageCircle className="h-6 w-6 text-muted-foreground" />
                  ) : (
                    <Brain className="h-6 w-6 text-primary" />
                  )}
                  <div className="flex-1">
                    <p className="text-foreground whitespace-pre-wrap">{message.content}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {renderFormulaSections()}
      </div>
    </div>
  );
};

export default AiTutor;
