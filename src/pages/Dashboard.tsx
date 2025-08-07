import { MoodLogger } from "@/components/mood/MoodLogger";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, TrendingUp, Target, Award } from "lucide-react";

export const Dashboard = () => {
  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const stats = [
    {
      title: "Current Streak",
      value: "7 days",
      icon: CalendarDays,
      color: "text-primary",
      bg: "bg-primary/10"
    },
    {
      title: "Weekly Average",
      value: "7.2/10",
      icon: TrendingUp,
      color: "text-secondary",
      bg: "bg-secondary/10"
    },
    {
      title: "Monthly Goal",
      value: "23/30",
      icon: Target,
      color: "text-accent",
      bg: "bg-accent/10"
    },
    {
      title: "Achievements",
      value: "12",
      icon: Award,
      color: "text-mood-excited",
      bg: "bg-mood-excited/10"
    }
  ];

  const recentEntries = [
    { date: "Yesterday", mood: "😊", productivity: 8, energy: 7 },
    { date: "2 days ago", mood: "😌", productivity: 6, energy: 8 },
    { date: "3 days ago", mood: "🤩", productivity: 9, energy: 9 },
  ];

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Welcome Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Good morning! 👋</h1>
        <p className="text-muted-foreground">{today}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-gradient-card border-0 shadow-soft animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${stat.bg}`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-xl font-semibold text-foreground">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Mood Logger */}
        <div className="lg:col-span-2">
          <MoodLogger />
        </div>

        {/* Recent Entries */}
        <div className="space-y-6">
          <Card className="bg-gradient-card border-0 shadow-soft">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-foreground">Recent Entries</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentEntries.map((entry, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{entry.mood}</span>
                    <div>
                      <p className="text-sm font-medium text-foreground">{entry.date}</p>
                      <div className="flex gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          P: {entry.productivity}/10
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          E: {entry.energy}/10
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Tips */}
          <Card className="bg-gradient-mood border-0 shadow-mood">
            <CardContent className="p-6 text-white">
              <h3 className="font-semibold mb-2">💡 Daily Tip</h3>
              <p className="text-sm opacity-90">
                Try to log your mood at the same time each day to build a consistent habit. 
                Morning entries often provide the most authentic reflection of your state.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};