import { Code2, Menu, User, LogOut, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { useChallenges } from "@/contexts/ChallengesContext";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { scrollToChallenges } = useChallenges();
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    logout();
  };

  const handleChallengesClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (location.pathname === "/") {
      scrollToChallenges();
    } else {
      navigate("/", { replace: false });
      setTimeout(() => {
        scrollToChallenges();
      }, 100); // Delay to ensure page renders
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/" className="flex items-center space-x-2">
            <Code2 className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">CodeMaster</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <a
              href="/"
              onClick={handleChallengesClick}
              className={`hover:text-primary transition-colors ${
                location.pathname === "/"
                  ? "text-foreground"
                  : "text-muted-foreground"
              }`}
            >
              Challenges
            </a>
            <Link
              to="/leaderboard"
              className={`hover:text-primary transition-colors ${
                location.pathname === "/leaderboard"
                  ? "text-foreground"
                  : "text-muted-foreground"
              }`}
            >
              Leaderboard
            </Link>
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="h-9 w-9 p-0"
          >
            {theme === "light" ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <User className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user?.username}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <span className="text-sm">Points: {user?.points}</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span className="text-sm">
                    Problems Solved: {user?.problemsSolved}
                  </span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-2">
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm">Get Started</Button>
              </Link>
            </div>
          )}

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="md:hidden">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col space-y-4 mt-8">
                <a
                  href="/"
                  onClick={handleChallengesClick}
                  className={`text-lg font-medium ${
                    location.pathname === "/"
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  Challenges
                </a>
                <Link
                  to="/leaderboard"
                  className={`text-lg font-medium ${
                    location.pathname === "/leaderboard"
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  Leaderboard
                </Link>
                {!isAuthenticated && (
                  <>
                    <Link to="/login" className="text-lg font-medium">
                      Sign In
                    </Link>
                    <Link to="/register" className="text-lg font-medium">
                      Get Started
                    </Link>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
