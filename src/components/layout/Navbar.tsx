import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Calendar, Home, User, Menu, ChevronDown, Bell, Activity } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCycleContext } from "@/context/CycleContext";

interface NavbarProps {
  onLogout: () => void;
}

export const Navbar = ({ onLogout }: NavbarProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();
  const { userProfile } = useCycleContext();
  const navigate = useNavigate();
  
  const isActive = (path: string) => location.pathname === path;
  
  const navItems = [
    { label: "Home", path: "/dashboard", icon: Home },
    { label: "Calendar", path: "/calendar", icon: Calendar },
    { label: "PCOS Assessment", path: "/pcos-predictor", icon: Activity },
    { label: "Profile", path: "/profile", icon: User },
  ];

  // Get user initials for the avatar
  const getUserInitials = () => {
    if (!user) return "?";
    
    // Try to use name from userProfile first
    if (userProfile?.name) {
      return userProfile.name
        .split(' ')
        .map(part => part.charAt(0))
        .join('')
        .toUpperCase()
        .substring(0, 2);
    }
    
    // Fall back to email or metadata
    const name = user.user_metadata?.name || user.email || "";
    if (name.includes('@')) {
      return name.charAt(0).toUpperCase();
    }
    
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-gray-200">
      <div className="container flex items-center justify-between h-16 px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-cycle-purple flex items-center justify-center">
              <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-cycle-purple rounded-full"></div>
              </div>
            </div>
            <span className="hidden md:inline-block text-lg font-semibold">
              CycleSense
            </span>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive(item.path)
                  ? "bg-cycle-purple-light text-cycle-purple-dark"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative"
            asChild
          >
            <Link to="/notifications">
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </Link>
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-cycle-purple-light text-cycle-purple-dark flex items-center justify-center text-sm font-medium">
                  {getUserInitials()}
                </span>
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/profile">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/settings">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onLogout}>
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200">
          <div className="container py-3 px-4">
            <nav className="flex flex-col space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                    isActive(item.path)
                      ? "bg-cycle-purple-light text-cycle-purple-dark"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};
