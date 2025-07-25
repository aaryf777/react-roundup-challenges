import { Code2, Menu, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/" className="flex items-center space-x-2">
            <Code2 className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">CodeMaster</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link 
              to="/" 
              className={`hover:text-primary transition-colors ${
                location.pathname === "/" ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              Challenges
            </Link>
            <Link 
              to="/playground" 
              className={`hover:text-primary transition-colors ${
                location.pathname === "/playground" ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              Playground
            </Link>
            <Link 
              to="/leaderboard" 
              className={`hover:text-primary transition-colors ${
                location.pathname === "/leaderboard" ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              Leaderboard
            </Link>
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" className="hidden md:flex">
            <User className="h-4 w-4 mr-2" />
            Sign In
          </Button>
          <Button size="sm" className="bg-gradient-primary hover:shadow-glow transition-all duration-300">
            Get Started
          </Button>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="md:hidden">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <nav className="flex flex-col space-y-4">
                <Link to="/" className="text-lg font-medium">Challenges</Link>
                <Link to="/playground" className="text-lg font-medium">Playground</Link>
                <Link to="/leaderboard" className="text-lg font-medium">Leaderboard</Link>
                <Button className="mt-4">Sign In</Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;