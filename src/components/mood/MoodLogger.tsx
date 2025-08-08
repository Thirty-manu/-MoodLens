import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";

// Define the moods with their corresponding database values
const moods = [
  { emoji: "😊", label: "Happy", value: "happy", mood_value: 4, color: "mood-happy" },
  { emoji: "😢", label: "Sad", value: "sad", mood_value: 1, color: "mood-sad" },
  { emoji: "😠", label: "Angry", value: "angry", mood_value: 2, color: "mood-angry" },
  { emoji: "😌", label: "Calm", value: "calm", mood_value: 3, color: "mood-calm" },
  { emoji: "🤩", label: "Excited", value: "excited", mood_value: 5, color: "mood-excited" },
];

export const MoodLogger = () => {
  const [selectedMoodValue, setSelectedMoodValue] = useState<string>("");
  const [productivity, setProductivity] = useState([5]);
  const [energy, setEnergy] = useState([5]);
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    // Find the full mood object based on the selected value
    const selectedMood = moods.find(m => m.value === selectedMoodValue);

    if (!selectedMood) {
      toast({
        title: "Please select a mood",
        description: "Choose how you're feeling today.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      // Get the current authenticated user from Supabase
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError || !user) {
        toast({
          title: "Authentication Error",
          description: "Could not find user session. Please log in again.",
          variant: "destructive"
        });
        return;
      }

      // Insert the user's data into the 'mood_logs' table
      const { error } = await supabase
        .from('mood_logs')
        .insert({
          user_id: user.id,
          mood: selectedMood.label, // e.g., "Happy"
          mood_value: selectedMood.mood_value, // e.g., 4
          productivity: productivity[0],
          energy: energy[0],
          notes,
        });

      if (error) {
        throw error;
      }
      
      toast({
        title: "Mood logged successfully!",
        description: "Your daily entry has been saved.",
      });
      
      // Reset form on success
      setSelectedMoodValue("");
      setProductivity([5]);
      setEnergy([5]);
      setNotes("");

    } catch (error: any) {
      console.error("Error logging mood:", error);
      toast({
        title: "Failed to log mood",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-gradient-card border-0 shadow-soft">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
          📝 Today's Check-in
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Mood Selection */}
        <div className="space-y-3">
          <Label className="text-base font-medium text-foreground">How are you feeling?</Label>
          <div className="flex gap-3 flex-wrap">
            {moods.map((mood) => (
              <button
                key={mood.value}
                onClick={() => setSelectedMoodValue(mood.value)}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-all duration-300 hover:scale-105 ${
                  selectedMoodValue === mood.value
                    ? `bg-${mood.color} shadow-mood`
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                <span className="text-3xl">{mood.emoji}</span>
                <span className={`text-sm font-medium ${
                  selectedMoodValue === mood.value ? "text-white" : "text-muted-foreground"
                }`}>
                  {mood.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Productivity Slider */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-base font-medium text-foreground">Productivity Level</Label>
            <span className="text-sm text-primary font-semibold">{productivity[0]}/10</span>
          </div>
          <Slider
            value={productivity}
            onValueChange={setProductivity}
            min={1}
            max={10}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Low</span>
            <span>High</span>
          </div>
        </div>

        {/* Energy Slider */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-base font-medium text-foreground">Energy Level</Label>
            <span className="text-sm text-secondary font-semibold">{energy[0]}/10</span>
          </div>
          <Slider
            value={energy}
            onValueChange={setEnergy}
            min={1}
            max={10}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Drained</span>
            <span>Energized</span>
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-3">
          <Label className="text-base font-medium text-foreground">Notes (Optional)</Label>
          <Textarea
            placeholder="How was your day? Any thoughts or reflections..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="min-h-[80px] resize-none transition-all duration-300 focus:shadow-soft"
          />
        </div>

        {/* Submit Button */}
        <Button 
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full bg-gradient-primary hover:opacity-90 transition-all duration-300 font-medium"
        >
          {isLoading ? "Saving..." : "Log Today's Mood"}
        </Button>
      </CardContent>
    </Card>
  );
};
