import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, TrendingUp, Calendar, Activity } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

// Define a type for a mood log entry to ensure type safety
interface MoodLog {
  created_at: string;
  mood: string;
  mood_value: number;
  productivity: number;
  energy: number;
}

// Define the shape of our aggregated weekly data
interface WeeklyData {
  day: string;
  mood: number;
  productivity: number;
  energy: number;
}

export const Analytics = () => {
  // State to hold our dynamic data
  const [weeklyData, setWeeklyData] = useState<WeeklyData[]>([]);
  const [monthlyInsights, setMonthlyInsights] = useState({
    mostCommonMood: "N/A",
    avgProductivity: "N/A",
    avgEnergy: "N/A",
    bestDay: "N/A",
  });
  const [patterns, setPatterns] = useState([
    { title: "No patterns discovered yet", description: "Log more moods to unlock insights.", confidence: "0%" }
  ]);
  const [isLoading, setIsLoading] = useState(true);

  // Helper function to get the start of the week (Sunday)
  const getStartOfWeek = () => {
    const today = new Date();
    const day = today.getDay(); // 0 for Sunday, 1 for Monday, etc.
    const diff = today.getDate() - day;
    return new Date(today.setDate(diff));
  };
  
  // Helper function to get the start of the month
  const getStartOfMonth = () => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  };
  
  // Helper function to map mood values to emojis
  const getMoodEmoji = (mood: string) => {
    switch (mood) {
      case "terrible": return "😔";
      case "bad": return "😕";
      case "okay": return "�";
      case "good": return "😊";
      case "great": return "🤩";
      default: return "";
    }
  };

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        // --- Fetch all mood logs for the last month to cover both weekly and monthly views ---
        const startOfMonth = getStartOfMonth();
        const { data: moodLogs, error: logsError } = await supabase
          .from('mood_logs')
          .select('created_at, mood, mood_value, productivity, energy')
          .eq('user_id', user.id)
          .gte('created_at', startOfMonth.toISOString());

        if (logsError) {
          console.error("Error fetching mood logs:", logsError);
          setIsLoading(false);
          return;
        }

        if (moodLogs && moodLogs.length > 0) {
          // --- Calculate Weekly Data ---
          const startOfWeek = getStartOfWeek();
          const weeklyLogs = moodLogs.filter(log => new Date(log.created_at) >= startOfWeek);
          const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
          const weeklyDataMap: { [key: string]: { moodSum: number, prodSum: number, energySum: number, count: number } } = {};

          daysOfWeek.forEach(day => {
            weeklyDataMap[day] = { moodSum: 0, prodSum: 0, energySum: 0, count: 0 };
          });

          weeklyLogs.forEach(log => {
            const dayName = new Date(log.created_at).toLocaleDateString('en-US', { weekday: 'short' });
            weeklyDataMap[dayName].moodSum += log.mood_value;
            weeklyDataMap[dayName].prodSum += log.productivity;
            weeklyDataMap[dayName].energySum += log.energy;
            weeklyDataMap[dayName].count += 1;
          });

          const calculatedWeeklyData: WeeklyData[] = daysOfWeek.map(day => ({
            day,
            mood: weeklyDataMap[day].count > 0 ? parseFloat((weeklyDataMap[day].moodSum / weeklyDataMap[day].count).toFixed(1)) : 0,
            productivity: weeklyDataMap[day].count > 0 ? parseFloat((weeklyDataMap[day].prodSum / weeklyDataMap[day].count).toFixed(1)) : 0,
            energy: weeklyDataMap[day].count > 0 ? parseFloat((weeklyDataMap[day].energySum / weeklyDataMap[day].count).toFixed(1)) : 0,
          }));
          setWeeklyData(calculatedWeeklyData);

          // --- Calculate Monthly Insights ---
          const totalMoodValue = moodLogs.reduce((sum, log) => sum + log.mood_value, 0);
          const totalProdValue = moodLogs.reduce((sum, log) => sum + log.productivity, 0);
          const totalEnergyValue = moodLogs.reduce((sum, log) => sum + log.energy, 0);
          
          const moodCounts: { [key: string]: number } = moodLogs.reduce((acc, log) => {
            acc[log.mood] = (acc[log.mood] || 0) + 1;
            return acc;
          }, {});
          
          let mostCommonMood = "N/A";
          let mostCommonMoodCount = 0;
          for (const mood in moodCounts) {
            if (moodCounts[mood] > mostCommonMoodCount) {
              mostCommonMoodCount = moodCounts[mood];
              mostCommonMood = `${mood.charAt(0).toUpperCase() + mood.slice(1)} ${getMoodEmoji(mood)}`;
            }
          }
          
          const bestDay = calculatedWeeklyData.reduce((prev, curr) => (prev.mood > curr.mood ? prev : curr)).day;

          setMonthlyInsights({
            mostCommonMood,
            avgProductivity: `${(totalProdValue / moodLogs.length).toFixed(1)}/10`,
            avgEnergy: `${(totalEnergyValue / moodLogs.length).toFixed(1)}/10`,
            bestDay: bestDay !== "N/A" ? bestDay : "N/A",
          });
          
          // --- Generate Patterns (basic logic) ---
          const calculatedPatterns = [];
          
          const morningLogs = moodLogs.filter(log => {
            const hour = new Date(log.created_at).getHours();
            return hour >= 6 && hour < 12;
          });
          if (morningLogs.length > moodLogs.length / 3) {
            const morningMoodAvg = morningLogs.reduce((sum, log) => sum + log.mood_value, 0) / morningLogs.length;
            const overallMoodAvg = totalMoodValue / moodLogs.length;
            if (morningMoodAvg > overallMoodAvg * 1.1) {
              calculatedPatterns.push({
                title: "Morning Person",
                description: "You tend to be happier and more energetic in the mornings.",
                confidence: "80%"
              });
            }
          }
          
          const weekdayLogs = moodLogs.filter(log => {
            const day = new Date(log.created_at).getDay();
            return day >= 1 && day <= 5; // Monday to Friday
          });
          const weekendLogs = moodLogs.filter(log => {
            const day = new Date(log.created_at).getDay();
            return day === 0 || day === 6; // Sunday or Saturday
          });
          if (weekdayLogs.length > 0 && weekendLogs.length > 0) {
            const weekdayAvgProd = weekdayLogs.reduce((sum, log) => sum + log.productivity, 0) / weekdayLogs.length;
            const weekendAvgProd = weekendLogs.reduce((sum, log) => sum + log.productivity, 0) / weekendLogs.length;
            if (weekdayAvgProd > weekendAvgProd * 1.1) {
              calculatedPatterns.push({
                title: "Weekday Warrior",
                description: "Your productivity is consistently higher on weekdays.",
                confidence: "75%"
              });
            }
          }

          if (calculatedPatterns.length > 0) {
            setPatterns(calculatedPatterns);
          }
        }
      }
      setIsLoading(false);
    };
    fetchAnalyticsData();
  }, []);

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Analytics & Insights</h1>
        <p className="text-muted-foreground">Discover patterns in your mood and productivity</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64 text-muted-foreground">
          <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="ml-4">Loading analytics...</span>
        </div>
      ) : (
        <Tabs defaultValue="week" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="week">This Week</TabsTrigger>
            <TabsTrigger value="month">This Month</TabsTrigger>
            <TabsTrigger value="year">This Year</TabsTrigger>
          </TabsList>

          <TabsContent value="week" className="space-y-6">
            <Card className="bg-gradient-card border-0 shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  Weekly Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-7 gap-2">
                    {weeklyData.length > 0 ? weeklyData.map((day, index) => (
                      <div key={index} className="text-center space-y-2">
                        <p className="text-xs text-muted-foreground font-medium">{day.day}</p>
                        
                        <div className="relative">
                          <div className="w-full h-16 bg-muted rounded-md overflow-hidden flex flex-col justify-end">
                            <div 
                              className="bg-gradient-primary rounded-md transition-all duration-500"
                              style={{ height: `${(day.mood / 10) * 100}%` }}
                            />
                          </div>
                          <p className="text-xs mt-1 font-semibold text-primary">{day.mood}</p>
                        </div>
                        
                        <div className="relative">
                          <div className="w-full h-12 bg-muted rounded-md overflow-hidden flex flex-col justify-end">
                            <div 
                              className="bg-secondary rounded-md transition-all duration-500"
                              style={{ height: `${(day.productivity / 10) * 100}%` }}
                            />
                          </div>
                          <p className="text-xs mt-1 font-semibold text-secondary">{day.productivity}</p>
                        </div>
                        
                        <div className="relative">
                          <div className="w-full h-12 bg-muted rounded-md overflow-hidden flex flex-col justify-end">
                            <div 
                              className="bg-accent rounded-md transition-all duration-500"
                              style={{ height: `${(day.energy / 10) * 100}%` }}
                            />
                          </div>
                          <p className="text-xs mt-1 font-semibold text-accent">{day.energy}</p>
                        </div>
                      </div>
                    )) : (
                      <div className="col-span-7 text-center text-muted-foreground py-8">No data for this week. Log a mood to see your stats!</div>
                    )}
                  </div>
                  
                  <div className="flex justify-center gap-6 pt-4 border-t border-border">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-gradient-primary rounded"></div>
                      <span className="text-sm text-muted-foreground">Mood</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-secondary rounded"></div>
                      <span className="text-sm text-muted-foreground">Productivity</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-accent rounded"></div>
                      <span className="text-sm text-muted-foreground">Energy</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="month" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-gradient-card border-0 shadow-soft">
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Most Common Mood</p>
                    <p className="text-xl font-semibold text-foreground">{monthlyInsights.mostCommonMood}</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-card border-0 shadow-soft">
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Avg Productivity</p>
                    <p className="text-xl font-semibold text-foreground">{monthlyInsights.avgProductivity}</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-card border-0 shadow-soft">
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Avg Energy</p>
                    <p className="text-xl font-semibold text-foreground">{monthlyInsights.avgEnergy}</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-card border-0 shadow-soft">
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Best Day This Week</p>
                    <p className="text-xl font-semibold text-foreground">{monthlyInsights.bestDay}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="year" className="space-y-6">
            <Card className="bg-gradient-card border-0 shadow-soft">
              <CardContent className="p-8 text-center">
                <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Yearly Insights Coming Soon</h3>
                <p className="text-muted-foreground">
                  Keep logging your daily mood to unlock comprehensive yearly analytics and trends.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {/* Patterns & Insights */}
      <Card className="bg-gradient-mood border-0 shadow-mood">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Activity className="w-5 h-5" />
            Discovered Patterns
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {patterns.map((pattern, index) => (
            <div key={index} className="bg-white/10 backdrop-blur rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h4 className="font-semibold text-white">{pattern.title}</h4>
                  <p className="text-sm text-white/80">{pattern.description}</p>
                </div>
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  {pattern.confidence}
                </Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};