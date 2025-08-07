import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Lightbulb, BookOpen, Target, Star, ArrowRight } from "lucide-react";

export const Insights = () => {
  const recommendations = [
    {
      title: "Morning Routine Optimization",
      description: "Your mood is 23% higher on days when you log before 9 AM. Consider establishing a consistent morning routine.",
      action: "Set morning reminder",
      priority: "high",
      icon: "☀️"
    },
    {
      title: "Social Connection Boost",
      description: "You show increased energy levels on days with social activities. Try scheduling one social interaction per day.",
      action: "Plan social time",
      priority: "medium",
      icon: "👥"
    },
    {
      title: "Productivity Patterns",
      description: "Your productivity peaks on Tuesdays and Thursdays. Consider scheduling important tasks on these days.",
      action: "Optimize schedule",
      priority: "medium",
      icon: "📈"
    },
    {
      title: "Weekend Wind-down",
      description: "Your stress levels tend to spike on Sunday evenings. Try implementing a weekend wind-down routine.",
      action: "Create routine",
      priority: "low",
      icon: "🧘"
    }
  ];

  const achievements = [
    {
      title: "7-Day Streak",
      description: "Consistent daily logging for a week",
      earned: true,
      date: "2 days ago"
    },
    {
      title: "Mood Master",
      description: "Logged 30 different mood entries",
      earned: true,
      date: "1 week ago"
    },
    {
      title: "Productivity Pro",
      description: "Achieved 8+ productivity score for 5 consecutive days",
      earned: false,
      progress: "3/5 days"
    },
    {
      title: "Wellness Warrior",
      description: "Complete 30-day tracking challenge",
      earned: false,
      progress: "23/30 days"
    }
  ];

  const reflectionPrompts = [
    "What made today particularly good or challenging?",
    "How did your morning routine affect your day?",
    "What activities gave you the most energy today?",
    "What patterns do you notice in your mood this week?",
    "How can you improve tomorrow based on today's experience?"
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-destructive/10 text-destructive border-destructive/20";
      case "medium": return "bg-accent/10 text-accent border-accent/20";
      case "low": return "bg-muted text-muted-foreground border-border";
      default: return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Insights & Growth</h1>
        <p className="text-muted-foreground">Personalized recommendations based on your data</p>
      </div>

      {/* Recommendations */}
      <Card className="bg-gradient-card border-0 shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-primary" />
            Personalized Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {recommendations.map((rec, index) => (
            <div key={index} className="border border-border rounded-lg p-4 space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-2xl">{rec.icon}</span>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-foreground">{rec.title}</h4>
                    <Badge variant="outline" className={getPriorityColor(rec.priority)}>
                      {rec.priority} priority
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{rec.description}</p>
                  <Button variant="outline" size="sm" className="mt-2">
                    {rec.action}
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card className="bg-gradient-card border-0 shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-secondary" />
            Achievements & Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {achievements.map((achievement, index) => (
              <div 
                key={index} 
                className={`border rounded-lg p-4 transition-all duration-300 ${
                  achievement.earned 
                    ? "border-accent bg-accent/5 shadow-soft" 
                    : "border-border bg-muted/30"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-foreground">{achievement.title}</h4>
                  {achievement.earned && (
                    <Badge variant="secondary" className="bg-accent text-accent-foreground">
                      ✓ Earned
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-2">{achievement.description}</p>
                {achievement.earned ? (
                  <p className="text-xs text-accent font-medium">Earned {achievement.date}</p>
                ) : (
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Progress: {achievement.progress}</p>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-gradient-primary h-2 rounded-full transition-all duration-500"
                        style={{ 
                          width: achievement.progress?.includes('/') 
                            ? `${(parseInt(achievement.progress.split('/')[0]) / parseInt(achievement.progress.split('/')[1])) * 100}%`
                            : '0%'
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Reflection Prompts */}
      <Card className="bg-gradient-wellness border-0 shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <BookOpen className="w-5 h-5" />
            Daily Reflection Prompts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {reflectionPrompts.map((prompt, index) => (
            <div key={index} className="bg-white/10 backdrop-blur rounded-lg p-3">
              <p className="text-white/90 text-sm">{prompt}</p>
            </div>
          ))}
          <Button variant="secondary" className="w-full mt-4 bg-white/20 text-white border-white/30 hover:bg-white/30">
            <Target className="w-4 h-4 mr-2" />
            Start Reflection Session
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};