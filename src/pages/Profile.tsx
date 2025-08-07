import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  User, 
  Bell, 
  Shield, 
  Download, 
  Trash2, 
  Calendar,
  TrendingUp,
  Award
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const Profile = () => {
  const [profile, setProfile] = useState({
    name: "Manu Thirty",
    email: "serem695@gmail.com",
    timezone: "EAT"
  });
  
  const [notifications, setNotifications] = useState({
    dailyReminder: true,
    weeklyReport: true,
    achievements: true,
    insights: false
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleProfileUpdate = async () => {
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Profile updated",
        description: "Your profile settings have been saved successfully.",
      });
    }, 1000);
  };

  const handleDataExport = () => {
    toast({
      title: "Export started",
      description: "Your data export will be ready for download in a few minutes.",
    });
  };

  const handleDeleteAccount = () => {
    toast({
      title: "Account deletion",
      description: "Please contact support to delete your account.",
      variant: "destructive"
    });
  };

  const stats = [
    { label: "Days Tracked", value: "127", icon: Calendar },
    { label: "Average Mood", value: "7.4/10", icon: TrendingUp },
    { label: "Achievements", value: "12", icon: Award }
  ];

  return (
    <div className="container mx-auto px-4 py-6 space-y-6 max-w-4xl">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Profile & Settings</h1>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </div>

      {/* Profile Overview */}
      <Card className="bg-gradient-card border-0 shadow-soft">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <Avatar className="w-20 h-20">
              <AvatarFallback className="text-2xl bg-gradient-primary text-white">
                {profile.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-2xl font-semibold text-foreground">{profile.name}</h2>
              <p className="text-muted-foreground">{profile.email}</p>
              <div className="flex gap-2 mt-2">
                <Badge variant="secondary">Premium Member</Badge>
                <Badge variant="outline">127 Days Tracking</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-gradient-card border-0 shadow-soft">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <stat.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-xl font-semibold text-foreground">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Settings */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Profile Settings */}
        <Card className="bg-gradient-card border-0 shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Input
                id="timezone"
                value={profile.timezone}
                onChange={(e) => setProfile(prev => ({ ...prev, timezone: e.target.value }))}
              />
            </div>
            
            <Button 
              onClick={handleProfileUpdate}
              disabled={isLoading}
              className="w-full bg-gradient-primary hover:opacity-90"
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="bg-gradient-card border-0 shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="font-medium text-foreground">Daily Reminder</p>
                <p className="text-sm text-muted-foreground">Get reminded to log your mood</p>
              </div>
              <Switch
                checked={notifications.dailyReminder}
                onCheckedChange={(checked) => 
                  setNotifications(prev => ({ ...prev, dailyReminder: checked }))
                }
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="font-medium text-foreground">Weekly Report</p>
                <p className="text-sm text-muted-foreground">Receive weekly insights</p>
              </div>
              <Switch
                checked={notifications.weeklyReport}
                onCheckedChange={(checked) => 
                  setNotifications(prev => ({ ...prev, weeklyReport: checked }))
                }
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="font-medium text-foreground">Achievements</p>
                <p className="text-sm text-muted-foreground">Celebration notifications</p>
              </div>
              <Switch
                checked={notifications.achievements}
                onCheckedChange={(checked) => 
                  setNotifications(prev => ({ ...prev, achievements: checked }))
                }
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="font-medium text-foreground">Insights</p>
                <p className="text-sm text-muted-foreground">Personalized recommendations</p>
              </div>
              <Switch
                checked={notifications.insights}
                onCheckedChange={(checked) => 
                  setNotifications(prev => ({ ...prev, insights: checked }))
                }
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Management */}
      <Card className="bg-gradient-card border-0 shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Data & Privacy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div className="space-y-1">
              <p className="font-medium text-foreground">Export Your Data</p>
              <p className="text-sm text-muted-foreground">Download all your mood tracking data</p>
            </div>
            <Button variant="outline" onClick={handleDataExport}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between p-4 border border-destructive/20 rounded-lg bg-destructive/5">
            <div className="space-y-1">
              <p className="font-medium text-foreground">Delete Account</p>
              <p className="text-sm text-muted-foreground">Permanently delete your account and all data</p>
            </div>
            <Button variant="destructive" onClick={handleDeleteAccount}>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};