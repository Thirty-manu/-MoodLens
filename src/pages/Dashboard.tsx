import { useState, useEffect } from "react";
import { MoodLogger } from "@/components/mood/MoodLogger";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, TrendingUp, Target, Award } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

// Define a type for a mood log entry to ensure type safety
interface MoodLog {
  created_at: string;
  mood: string;
  mood_value: number;
  productivity: number;
  energy: number;
}

export const Dashboard = () => {
  const [userName, setUserName] = useState("User");
  const [recentEntries, setRecentEntries] = useState<MoodLog[]>([]);
  const [streakCount, setStreakCount] = useState(0);

  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  // useEffect to fetch data when the component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        // Fetch user profile to get the display name and streak count
        const { data: profileData, error: profileError } = await supabase
          .from('user_profiles')
          .select('display_name, streak_count')
          .eq('id', user.id)
          .single();
        
        if (profileError) {
          console.error("Error fetching user profile:", profileError);
        } else if (profileData) {
          setUserName(profileData.display_name || user.email?.split('@')[0] || "User");
          setStreakCount(profileData.streak_count);
        }

        // Fetch the 3 most recent mood logs for the user
        const { data: logsData, error: logsError } = await supabase
          .from('mood_logs')
          .select('created_at, mood, mood_value, productivity, energy')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(3);

        if (logsError) {
          console.error("Error fetching recent mood logs:", logsError);
        } else if (logsData) {
          setRecentEntries(logsData);
        }
      }
    };
    fetchUserData();
  }, []);

  // Map mood_value to an emoji for displaying
  const getMoodEmoji = (value: number) => {
    switch (value) {
      case 1: return "😔";
      case 2: return "😕";
      case 3: return "�";
      case 4: return "😊";
      case 5: return "🤩";
      default: return "🙂";
    }
  };

  const stats = [
    {
      title: "Current Streak",
      value: `${streakCount} days`,
      icon: CalendarDays,
      color: "text-primary",
      bg: "bg-primary/10"
    },
    {
      title: "Weekly Average",
      value: "N/A", // This requires a query with an aggregation function
      icon: TrendingUp,
      color: "text-secondary",
      bg: "bg-secondary/10"
    },
    {
      title: "Monthly Goal",
      value: "N/A", // This requires more complex logic
      icon: Target,
      color: "text-accent",
      bg: "bg-accent/10"
    },
    {
      title: "Achievements",
      value: "N/A", // This requires fetching data from the achievements table
      icon: Award,
      color: "text-mood-excited",
      bg: "bg-mood-excited/10"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Welcome Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Good morning, {userName}! 👋</h1>
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
              {recentEntries.length > 0 ? (
                recentEntries.map((entry, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{getMoodEmoji(entry.mood_value)}</span>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {new Date(entry.created_at).toLocaleDateString()}
                        </p>
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
                ))
              ) : (
                <p className="text-muted-foreground text-sm text-center py-4">No recent entries found. Log your first mood!</p>
              )}
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