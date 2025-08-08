import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Smile, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";

interface SignupFormProps {
  onSwitchToLogin: () => void;
  onSignupSuccess: () => void;
}

export const SignupForm = ({ onSwitchToLogin, onSignupSuccess }: SignupFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "Please make sure your passwords match.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    const { email, password } = formData;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    
    setIsLoading(false);

    if (error) {
      console.error("Signup error:", error);
      toast({
        title: "Signup failed",
        description: error.message,
        variant: "destructive"
      });
    } else {
      // Step 2: After successful signup, create a profile entry
      if (data.user) {
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert({ 
            id: data.user.id, 
            display_name: formData.name 
          });

        if (profileError) {
          console.error("Profile creation error:", profileError);
          // Still show success toast as the user is created, but log the profile error
          toast({
            title: "Signup successful, but profile could not be created.",
            description: "Please contact support.",
            variant: "destructive"
          });
          onSignupSuccess();
        } else {
          toast({
            title: "Check your email",
            description: "A verification link has been sent to your email address.",
          });
          onSignupSuccess();
        }
      } else {
        toast({
          title: "Signup successful",
          description: "An unexpected error occurred. Please check your email for verification.",
        });
        onSignupSuccess();
      }
    }
  };

  return (
    <Card className="w-full max-w-md bg-gradient-card border-0 shadow-soft animate-scale-in">
      <CardHeader className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 bg-gradient-wellness rounded-full flex items-center justify-center animate-float">
          <Smile className="w-8 h-8 text-white" />
        </div>
        <CardTitle className="text-2xl font-semibold text-foreground">Start Your Journey</CardTitle>
        <CardDescription className="text-muted-foreground">
          Create your account to begin tracking your daily wellness
        </CardDescription>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground font-medium">Full Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleInputChange("name")}
              required
              className="transition-all duration-300 focus:shadow-soft"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground font-medium">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleInputChange("email")}
              required
              className="transition-all duration-300 focus:shadow-soft"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password" className="text-foreground font-medium">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                value={formData.password}
                onChange={handleInputChange("password")}
                required
                className="pr-10 transition-all duration-300 focus:shadow-soft"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-foreground font-medium">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleInputChange("confirmPassword")}
              required
              className="transition-all duration-300 focus:shadow-soft"
            />
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-4">
          <Button 
            type="submit" 
            className="w-full bg-gradient-wellness hover:opacity-90 transition-all duration-300 font-medium"
            disabled={isLoading}
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </Button>
          
          <p className="text-sm text-muted-foreground text-center">
            Already have an account?{" "}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-primary hover:text-primary-glow font-medium transition-colors"
            >
              Sign in
            </button>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
};
