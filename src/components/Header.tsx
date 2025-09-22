import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu, X, ArrowLeft, User, LogOut, Settings } from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, profile, signOut } = useAuth();
  const { toast } = useToast();
  const isHomePage = location.pathname === "/";

  const handleSignOut = async () => {
    const result = await signOut();
    if (result.success) {
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account.",
      });
      navigate('/');
    } else {
      toast({
        title: "Sign out failed",
        description: result.error || "An error occurred while signing out.",
        variant: "destructive",
      });
    }
  };

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (profile?.full_name) {
      return profile.full_name
        .split(' ')
        .map(name => name.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  return (
    <header className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            {!isHomePage && (
              <Link to="/" className="flex items-center space-x-2 text-foreground hover:text-primary transition-colors">
                <ArrowLeft size={20} />
                <span className="font-ui text-sm">Back home</span>
              </Link>
            )}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">M</span>
              </div>
              <span className="text-xl font-bold text-foreground font-heading">MyDebate.ai</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-foreground hover:text-primary transition-colors font-medium font-ui">
              Home
            </Link>
            {isAuthenticated && (
              <>
                <Link to="/debate" className="text-foreground hover:text-primary transition-colors font-medium font-ui">
                  MyDebate World
                </Link>
                <Link to="/interview" className="text-foreground hover:text-primary transition-colors font-medium font-ui">
                  MyInterview World
                </Link>
                <Link to="/pitch" className="text-foreground hover:text-primary transition-colors font-medium font-ui">
                  MyPitch World
                </Link>
                <Link to="/dashboard" className="text-foreground hover:text-primary transition-colors font-medium font-ui">
                  Dashboard
                </Link>
              </>
            )}
            <Link to="/events" className="text-foreground hover:text-primary transition-colors font-medium font-ui">
              Events
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={profile?.avatar_url || ""} alt={profile?.full_name || ""} />
                      <AvatarFallback>{getUserInitials()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {profile?.full_name || 'User'}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      Profile Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" className="font-ui">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="font-ui bg-primary text-primary-foreground hover:bg-primary-hover rounded-xl">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-foreground hover:text-primary"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4 border-t border-border">
            <nav className="flex flex-col space-y-4">
              <Link to="/" className="text-foreground hover:text-primary transition-colors font-medium">
                Home
              </Link>
              {isAuthenticated && (
                <>
                  <Link to="/debate" className="text-foreground hover:text-primary transition-colors font-medium">
                    MyDebate World
                  </Link>
                  <Link to="/interview" className="text-foreground hover:text-primary transition-colors font-medium">
                    MyInterview World
                  </Link>
                  <Link to="/pitch" className="text-foreground hover:text-primary transition-colors font-medium">
                    MyPitch World
                  </Link>
                  <Link to="/dashboard" className="text-foreground hover:text-primary transition-colors font-medium">
                    Dashboard
                  </Link>
                </>
              )}
              <Link to="/events" className="text-foreground hover:text-primary transition-colors font-medium">
                Events
              </Link>
            </nav>
            <div className="flex flex-col space-y-2 pt-4">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center space-x-2 px-2 py-2 border-b border-border">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={profile?.avatar_url || ""} alt={profile?.full_name || ""} />
                      <AvatarFallback className="text-xs">{getUserInitials()}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{profile?.full_name || 'User'}</span>
                      <span className="text-xs text-muted-foreground">{user?.email}</span>
                    </div>
                  </div>
                  <Link to="/profile">
                    <Button variant="ghost" className="justify-start w-full">
                      <Settings className="mr-2 h-4 w-4" />
                      Profile Settings
                    </Button>
                  </Link>
                  <Button 
                    variant="ghost" 
                    className="justify-start w-full" 
                    onClick={handleSignOut}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="ghost" className="justify-start w-full">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button className="justify-start w-full bg-primary text-primary-foreground hover:bg-primary-hover rounded-xl">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;