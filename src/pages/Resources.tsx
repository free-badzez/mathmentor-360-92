import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Video, FileText, Link as LinkIcon, Download, Play, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
interface Resource {
  id: string;
  title: string;
  type: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  icon: any;
  link: string;
  popularity: number;
}
const Resources = () => {
  const {
    toast
  } = useToast();
  const resources: Resource[] = [{
    id: "1",
    title: "Algebra Fundamentals",
    type: "Video Course",
    description: "Master the basics of algebra with interactive lessons",
    difficulty: "Beginner",
    icon: Video,
    link: "#",
    popularity: 95
  }, {
    id: "2",
    title: "Geometry Handbook",
    type: "PDF Guide",
    description: "Comprehensive guide to geometric principles and formulas",
    difficulty: "Intermediate",
    icon: FileText,
    link: "#",
    popularity: 88
  }, {
    id: "3",
    title: "Calculus Practice",
    type: "Interactive",
    description: "Practice calculus problems with instant feedback",
    difficulty: "Advanced",
    icon: BookOpen,
    link: "#",
    popularity: 92
  }, {
    id: "4",
    title: "Math Reference",
    type: "External Link",
    description: "Access to additional math learning resources",
    difficulty: "Intermediate",
    icon: LinkIcon,
    link: "#",
    popularity: 85
  }];
  const handleResourceClick = (resource: Resource) => {
    toast({
      title: `Opening ${resource.title}`,
      description: `Loading ${resource.type.toLowerCase()}...`
    });
  };
  return <div className="min-h-screen bg-tutor-background pt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-tutor-text mb-4">Learning Resources</h1>
          <p className="text-gray-600">Curated materials to support your learning journey</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map(resource => <Card key={resource.id} className="glass-card animate-fade-up hover-lift transition-all duration-300">
              <CardHeader className="border-color: red; rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 rounded-lg bg-tutor-primary/10">
                    <resource.icon className="h-5 w-5 text-tutor-primary" />
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-sm text-gray-600">{resource.popularity}%</span>
                  </div>
                </div>
                <CardTitle className="text-xl">{resource.title}</CardTitle>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-sm text-gray-500">{resource.type}</span>
                  <span className="text-sm text-gray-500">•</span>
                  <span className={`text-sm ${resource.difficulty === "Beginner" ? "text-green-500" : resource.difficulty === "Intermediate" ? "text-yellow-500" : "text-red-500"}`}>
                    {resource.difficulty}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{resource.description}</p>
                <div className="flex gap-2">
                  <Button onClick={() => handleResourceClick(resource)} className="flex-1 bg-tutor-primary hover:bg-tutor-secondary text-slate-50 bg-[#17b6f7]">
                    {resource.type === "Video Course" ? <Play className="h-4 w-4 mr-2" /> : resource.type === "PDF Guide" ? <Download className="h-4 w-4 mr-2" /> : <LinkIcon className="h-4 w-4 mr-2" />}
                    Access Resource
                  </Button>
                </div>
              </CardContent>
            </Card>)}
        </div>

        <Card className="mt-8 glass-card">
          <CardHeader>
            <CardTitle>Need Help?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Can't find what you're looking for? Our AI tutor is here to help you with personalized assistance.
            </p>
            <Button variant="outline" className="w-full bg-[#11bbf2] text-slate-50">Contact AI Tutor</Button>
          </CardContent>
        </Card>
      </div>
    </div>;
};
export default Resources;