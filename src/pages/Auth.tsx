import { useState } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { SignupForm } from "@/components/auth/SignupForm";

interface AuthProps {
  onAuthSuccess: () => void;
}

export const Auth = ({ onAuthSuccess }: AuthProps) => {
  const [isLoginMode, setIsLoginMode] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-wellness flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {isLoginMode ? (
          <LoginForm
            onSwitchToSignup={() => setIsLoginMode(false)}
            onLoginSuccess={onAuthSuccess}
          />
        ) : (
          <SignupForm
            onSwitchToLogin={() => setIsLoginMode(true)}
            onSignupSuccess={onAuthSuccess}
          />
        )}
      </div>
    </div>
  );
};