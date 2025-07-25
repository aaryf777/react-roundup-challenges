import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter, ArrowRight, Code2, Zap, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/Header";
import ChallengeCard from "@/components/ChallengeCard";
import CategoryFilter from "@/components/CategoryFilter";
import heroImage from "@/assets/hero-bg.jpg";

const Index = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("all");

  const handleChallengeClick = (challengeId: string) => {
    navigate(`/challenge/${challengeId}`);
  };

  const categories = [
    { id: "javascript", name: "JavaScript", count: 45, icon: "🟨" },
    { id: "react", name: "React", count: 32, icon: "⚛️" },
    { id: "algorithms", name: "Algorithms", count: 78, icon: "🧠" },
    { id: "data-structures", name: "Data Structures", count: 56, icon: "🗃️" },
    { id: "frontend", name: "Frontend", count: 23, icon: "🎨" },
  ];

  const challenges = [
    {
      title: "Two Sum",
      description: "Find two numbers in an array that add up to a target sum. A classic introduction to hash tables and array manipulation.",
      difficulty: "easy" as const,
      category: "Arrays",
      timeEstimate: "15 min",
      solvedBy: 2547,
      tags: ["Array", "Hash Table", "Two Pointers"]
    },
    {
      title: "React useState Hook",
      description: "Build a counter component using React's useState hook. Learn the fundamentals of state management in functional components.",
      difficulty: "easy" as const,
      category: "React",
      timeEstimate: "10 min",
      solvedBy: 1832,
      tags: ["React", "Hooks", "State"]
    },
    {
      title: "Binary Tree Traversal",
      description: "Implement inorder, preorder, and postorder traversal algorithms for binary trees using both recursive and iterative approaches.",
      difficulty: "medium" as const,
      category: "Data Structures",
      timeEstimate: "30 min",
      solvedBy: 1205,
      tags: ["Binary Tree", "Recursion", "Stack"]
    },
    {
      title: "Async/Await Promise Chain",
      description: "Handle multiple asynchronous operations with proper error handling. Master modern JavaScript async patterns.",
      difficulty: "medium" as const,
      category: "JavaScript",
      timeEstimate: "25 min",
      solvedBy: 987,
      tags: ["Async", "Promises", "Error Handling"]
    },
    {
      title: "Custom React Hook",
      description: "Create a reusable custom hook for API data fetching with loading states, error handling, and caching.",
      difficulty: "hard" as const,
      category: "React",
      timeEstimate: "45 min",
      solvedBy: 543,
      tags: ["React", "Custom Hooks", "API"]
    },
    {
      title: "Merge Sort Algorithm",
      description: "Implement the merge sort algorithm with O(n log n) time complexity. Understand divide and conquer strategies.",
      difficulty: "hard" as const,
      category: "Algorithms",
      timeEstimate: "40 min",
      solvedBy: 721,
      tags: ["Sorting", "Divide & Conquer", "Recursion"]
    }
  ];

  const stats = [
    { icon: Code2, label: "Total Challenges", value: "234", color: "text-primary" },
    { icon: Zap, label: "Active Users", value: "12.5K", color: "text-accent" },
    { icon: Trophy, label: "Solutions Submitted", value: "45.2K", color: "text-difficulty-medium" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero py-20">
        <div 
          className="absolute inset-0 opacity-20 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="container relative">
          <div className="mx-auto max-w-4xl text-center space-y-8">
            <div className="space-y-4 animate-fade-in">
              <h1 className="text-4xl md:text-6xl font-bold text-white">
                Master <span className="text-primary-glow">JavaScript</span> & <span className="text-primary-glow">React</span>
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Sharpen your coding skills with curated challenges, real-world projects, and interactive learning experiences.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-scale-in">
              <Button size="lg" className="bg-gradient-primary hover:shadow-glow text-lg px-8">
                Start Coding
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 text-lg px-8">
                Browse Challenges
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              {stats.map((stat, index) => (
                <div key={index} className="text-center space-y-2 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className={`inline-flex p-3 rounded-full bg-white/10 ${stat.color}`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-gray-300">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar Filters */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                <CategoryFilter 
                  categories={categories}
                  selectedCategory={selectedCategory}
                  onCategoryChange={setSelectedCategory}
                />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Difficulty</h3>
                  <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Levels</SelectItem>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Challenge Grid */}
            <div className="lg:col-span-3 space-y-6">
              {/* Search and Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search challenges..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline" className="sm:w-auto">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </div>

              {/* Results Header */}
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">
                  {selectedCategory === "all" ? "All Challenges" : categories.find(c => c.id === selectedCategory)?.name}
                </h2>
                <span className="text-muted-foreground">
                  {challenges.length} challenges
                </span>
              </div>

              {/* Challenge Cards */}
              <div className="grid md:grid-cols-2 gap-6">
                {challenges.map((challenge, index) => (
                  <div key={index} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                    <ChallengeCard 
                      {...challenge} 
                      onClick={() => handleChallengeClick(`${challenge.title.toLowerCase().replace(/\s+/g, '-')}`)}
                    />
                  </div>
                ))}
              </div>

              {/* Load More */}
              <div className="text-center pt-8">
                <Button variant="outline" size="lg">
                  Load More Challenges
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
