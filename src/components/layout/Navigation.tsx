import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  Home, 
  BarChart3, 
  User, 
  Smile, 
  Menu, 
  LogOut,
  TrendingUp
} from "lucide-react";

interface NavigationProps {
  onLogout: () => void;
}

export const Navigation = ({ onLogout }: NavigationProps) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Analytics", href: "/analytics", icon: BarChart3 },
    { name: "Insights", href: "/insights", icon: TrendingUp },
    { name: "Profile", href: "/profile", icon: User },
  ];

  // Admin navigation (would normally check user role)
  const adminNavigation = [
    { name: "Admin", href: "/admin", icon: BarChart3 },
  ];

  const NavLink = ({ item, mobile = false }: { item: typeof navigation[0], mobile?: boolean }) => {
    const isActive = location.pathname === item.href;
    const baseClasses = "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-300 font-medium";
    const activeClasses = isActive 
      ? "bg-primary text-primary-foreground shadow-soft" 
      : "text-muted-foreground hover:text-primary hover:bg-muted";
    const mobileClasses = mobile ? "text-lg" : "";

    return (
      <Link
        to={item.href}
        className={`${baseClasses} ${activeClasses} ${mobileClasses}`}
        onClick={() => mobile && setIsMobileMenuOpen(false)}
      >
        <item.icon className="w-5 h-5" />
        {item.name}
      </Link>
    );
  };

  return (
    <nav className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2 font-bold text-xl text-primary">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Smile className="w-5 h-5 text-white" />
            </div>
            MoodTrack
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navigation.map((item) => (
              <NavLink key={item.name} item={item} />
            ))}
            {adminNavigation.map((item) => (
              <NavLink key={item.name} item={item} />
            ))}
          </div>

          {/* Desktop Logout */}
          <div className="hidden md:flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onLogout}
              className="text-muted-foreground hover:text-destructive"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 p-6">
                <div className="flex flex-col gap-6">
                  <div className="flex items-center gap-2 font-bold text-xl text-primary">
                    <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                      <Smile className="w-5 h-5 text-white" />
                    </div>
                    MoodTrack
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    {navigation.map((item) => (
                      <NavLink key={item.name} item={item} mobile />
                    ))}
                    {adminNavigation.map((item) => (
                      <NavLink key={item.name} item={item} mobile />
                    ))}
                  </div>
                  
                  <div className="border-t border-border pt-4">
                    <Button
                      variant="ghost"
                      onClick={onLogout}
                      className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <LogOut className="w-5 h-5 mr-3" />
                      Logout
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};