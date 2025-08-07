import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, TrendingUp, Calendar, Activity } from "lucide-react";

export const Analytics = () => {
  const weeklyData = [
    { day: "Mon", mood: 7, productivity: 8, energy: 6 },
    { day: "Tue", mood: 8, productivity: 7, energy: 8 },
    { day: "Wed", mood: 6, productivity: 6, energy: 5 },
    { day: "Thu", mood: 9, productivity: 9, energy: 9 },
    { day: "Fri", mood: 8, productivity: 8, energy: 7 },
    { day: "Sat", mood: 9, productivity: 5, energy: 8 },
    { day: "Sun", mood: 7, productivity: 4, energy: 6 }
  ];

  const monthlyInsights = [
    { label: "Most Common Mood", value: "Happy 😊", percentage: "45%" },
    { label: "Avg Productivity", value: "7.2/10", trend: "+0.8" },
    { label: "Avg Energy", value: "6.8/10", trend: "+1.2" },
    { label: "Best Day", value: "Thursday", streak: "3 weeks" }
  ];

  const patterns = [
    {
      title: "Morning Person",
      description: "You tend to be most productive in the morning hours",
      confidence: "85%"
    },
    {
      title: "Weekday Warrior",
      description: "Your energy levels are consistently higher on weekdays",
      confidence: "72%"
    },
    {
      title: "Social Boost",
      description: "Your mood improves on days with social activities",
      confidence: "90%"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Analytics & Insights</h1>
        <p className="text-muted-foreground">Discover patterns in your mood and productivity</p>
      </div>

      {/* Tabs for different time periods */}
      <Tabs defaultValue="week" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="week">This Week</TabsTrigger>
          <TabsTrigger value="month">This Month</TabsTrigger>
          <TabsTrigger value="year">This Year</TabsTrigger>
        </TabsList>

        <TabsContent value="week" className="space-y-6">
          {/* Weekly Chart */}
          <Card className="bg-gradient-card border-0 shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                Weekly Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Simple Bar Chart Representation */}
                <div className="grid grid-cols-7 gap-2">
                  {weeklyData.map((day, index) => (
                    <div key={index} className="text-center space-y-2">
                      <p className="text-xs text-muted-foreground font-medium">{day.day}</p>
                      
                      {/* Mood Bar */}
                      <div className="relative">
                        <div className="w-full h-16 bg-muted rounded-md overflow-hidden">
                          <div 
                            className="bg-gradient-primary rounded-md transition-all duration-500"
                            style={{ height: `${(day.mood / 10) * 100}%`, marginTop: 'auto' }}
                          />
                        </div>
                        <p className="text-xs mt-1 font-semibold text-primary">{day.mood}</p>
                      </div>
                      
                      {/* Productivity Bar */}
                      <div className="relative">
                        <div className="w-full h-12 bg-muted rounded-md overflow-hidden">
                          <div 
                            className="bg-secondary rounded-md transition-all duration-500"
                            style={{ height: `${(day.productivity / 10) * 100}%`, marginTop: 'auto' }}
                          />
                        </div>
                        <p className="text-xs mt-1 font-semibold text-secondary">{day.productivity}</p>
                      </div>
                      
                      {/* Energy Bar */}
                      <div className="relative">
                        <div className="w-full h-12 bg-muted rounded-md overflow-hidden">
                          <div 
                            className="bg-accent rounded-md transition-all duration-500"
                            style={{ height: `${(day.energy / 10) * 100}%`, marginTop: 'auto' }}
                          />
                        </div>
                        <p className="text-xs mt-1 font-semibold text-accent">{day.energy}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Legend */}
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
          {/* Monthly Insights */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {monthlyInsights.map((insight, index) => (
              <Card key={index} className="bg-gradient-card border-0 shadow-soft">
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">{insight.label}</p>
                    <p className="text-xl font-semibold text-foreground">{insight.value}</p>
                    {insight.trend && (
                      <Badge variant="secondary" className="text-xs">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        {insight.trend}
                      </Badge>
                    )}
                    {insight.percentage && (
                      <Badge variant="outline" className="text-xs">
                        {insight.percentage}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
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