
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Brain, Target, TrendingUp, Clock } from "lucide-react";
import TodoList from "@/components/TodoList";
import PomodoroTimer from "@/components/PomodoroTimer";

const Dashboard = () => {
  const [performanceData] = useState([
    { day: 'Mon', score: 85 },
    { day: 'Tue', score: 72 },
    { day: 'Wed', score: 90 },
    { day: 'Thu', score: 88 },
    { day: 'Fri', score: 95 },
    { day: 'Sat', score: 87 },
    { day: 'Sun', score: 92 },
  ]);

  const stats = [
    { icon: Brain, label: "Problems Solved", value: "156" },
    { icon: Target, label: "Accuracy Rate", value: "89%" },
    { icon: TrendingUp, label: "Weekly Progress", value: "+12%" },
    { icon: Clock, label: "Study Time", value: "24h" },
  ];

  return (
    <div className="min-h-screen bg-tutor-background pt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-tutor-text mb-8">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="glass-card animate-fade-up hover-lift">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{stat.label}</p>
                    <p className="text-2xl font-bold text-tutor-text">{stat.value}</p>
                  </div>
                  <stat.icon className="h-8 w-8 text-tutor-primary opacity-80" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <Card className="glass-card col-span-2">
            <CardHeader>
              <CardTitle>Weekly Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="score" 
                      stroke="#2DD4BF" 
                      strokeWidth={2}
                      dot={{ fill: '#2DD4BF' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Study Timer</CardTitle>
            </CardHeader>
            <CardContent>
              <PomodoroTimer />
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>To-Do List</CardTitle>
            </CardHeader>
            <CardContent>
              <TodoList />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
