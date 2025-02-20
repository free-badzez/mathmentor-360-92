
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Video, FileText, Link as LinkIcon } from "lucide-react";

const Resources = () => {
  const resources = [
    {
      title: "Algebra Fundamentals",
      type: "Video Tutorial",
      description: "Learn the basics of algebra with step-by-step explanations",
      icon: Video,
    },
    {
      title: "Geometry Handbook",
      type: "PDF Guide",
      description: "Comprehensive guide to geometric principles and formulas",
      icon: FileText,
    },
    {
      title: "Calculus Practice",
      type: "Interactive",
      description: "Practice calculus problems with instant feedback",
      icon: BookOpen,
    },
    {
      title: "Math Reference",
      type: "External Link",
      description: "Access to additional math learning resources",
      icon: LinkIcon,
    },
  ];

  return (
    <div className="min-h-screen bg-tutor-background pt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-tutor-text mb-4">Learning Resources</h1>
          <p className="text-gray-600">Access comprehensive materials to support your learning journey</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {resources.map((resource, index) => (
            <Card key={index} className="glass-card animate-fade-up hover-lift">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-tutor-primary/10">
                    <resource.icon className="h-5 w-5 text-tutor-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{resource.title}</CardTitle>
                    <p className="text-sm text-gray-500">{resource.type}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{resource.description}</p>
                <Button
                  className="w-full bg-gradient-to-r from-tutor-primary to-tutor-secondary text-white"
                  variant="default"
                >
                  Access Resource
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="glass-card mt-8 animate-fade-up">
          <CardHeader>
            <CardTitle>Need Help?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Can't find what you're looking for? Our AI tutor is here to help you with personalized assistance.
            </p>
            <Button variant="outline" className="w-full">Contact AI Tutor</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Resources;
