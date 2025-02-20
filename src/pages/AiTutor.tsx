
import { useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Brain, MessageCircle, History, Sparkles, Send } from "lucide-react";

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

const AiTutor = () => {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const { toast } = useToast();

  const sampleResponses = [
    "Let's break this down step by step...",
    "Here's how we can solve this problem...",
    "Think about it this way...",
    "Let me explain with an example...",
  ];

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
    
    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: question,
      timestamp: new Date(),
    };
    
    setChatHistory(prev => [...prev, userMessage]);

    // Simulate AI response
    setTimeout(() => {
      const randomResponse = sampleResponses[Math.floor(Math.random() * sampleResponses.length)];
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: randomResponse + " " + question,
        timestamp: new Date(),
      };
      
      setChatHistory(prev => [...prev, aiMessage]);
      setLoading(false);
      setQuestion("");
      
      toast({
        title: "Response received",
        description: "Check out the detailed explanation below",
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-tutor-background pt-20 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-tutor-text mb-4">AI Math Tutor</h1>
          <p className="text-gray-600">Get personalized help with any math problem</p>
        </div>

        <Card className="p-6 mb-8 animate-fade-up">
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
                className="bg-tutor-primary hover:bg-tutor-secondary transition-colors gap-2"
                disabled={loading}
              >
                {loading ? <MessageCircle className="animate-spin" /> : <Send />}
                {loading ? "Thinking..." : "Ask"}
              </Button>
            </div>
          </form>
        </Card>

        <div className="space-y-6">
          {chatHistory.map((message) => (
            <Card 
              key={message.id} 
              className={`animate-fade-up ${
                message.type === 'user' ? 'bg-white/50' : 'bg-tutor-primary/10'
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  {message.type === 'user' ? (
                    <MessageCircle className="h-6 w-6 text-gray-500" />
                  ) : (
                    <Brain className="h-6 w-6 text-tutor-primary" />
                  )}
                  <div className="flex-1">
                    <p className="text-gray-700">{message.content}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-8 p-6 animate-fade-up bg-tutor-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Quick Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-gray-700">
              <li>• Ask specific questions for better answers</li>
              <li>• Include relevant context and formulas</li>
              <li>• Request step-by-step explanations</li>
              <li>• Ask for examples if needed</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AiTutor;
