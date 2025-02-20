
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, BookOpen, Clock, Brain } from "lucide-react";

const Profile = () => {
  const stats = [
    { icon: Trophy, label: "Problems Solved", value: "124" },
    { icon: BookOpen, label: "Topics Mastered", value: "8" },
    { icon: Clock, label: "Study Hours", value: "32" },
    { icon: Brain, label: "Current Streak", value: "5 days" },
  ];

  return (
    <div className="min-h-screen bg-tutor-background pt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-20 w-20 rounded-full bg-gradient-to-r from-tutor-primary to-tutor-secondary flex items-center justify-center text-white text-2xl font-bold">
              JS
            </div>
            <div>
              <h1 className="text-3xl font-bold text-tutor-text">John Smith</h1>
              <p className="text-gray-600">Mathematics Enthusiast</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => (
              <Card key={index} className="glass-card animate-fade-up hover-lift">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <stat.icon className="h-8 w-8 text-tutor-primary mb-2" />
                    <div className="text-2xl font-bold text-tutor-text mb-1">{stat.value}</div>
                    <div className="text-sm text-gray-500">{stat.label}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="h-2 w-2 rounded-full bg-tutor-primary"></div>
                    <div>
                      <p className="text-sm font-medium">Completed Algebra Quiz</p>
                      <p className="text-xs text-gray-500">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="h-2 w-2 rounded-full bg-tutor-secondary"></div>
                    <div>
                      <p className="text-sm font-medium">Mastered Trigonometry</p>
                      <p className="text-xs text-gray-500">Yesterday</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Learning Path</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Calculus</span>
                    <span className="text-sm text-gray-500">45% Complete</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full">
                    <div className="h-2 bg-tutor-primary rounded-full w-[45%]"></div>
                  </div>
                  <Button className="w-full bg-tutor-primary hover:bg-tutor-secondary">
                    Continue Learning
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
