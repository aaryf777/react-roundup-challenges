import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-bg.jpg";
import { STATS } from "@/constants/stats";

interface HeroSectionProps {
  onStartCoding: () => void;
  onBrowseChallenges: () => void;
}

const HeroSection = ({
  onStartCoding,
  onBrowseChallenges,
}: HeroSectionProps) => {
  return (
    <section className="relative overflow-hidden bg-gradient-hero py-20">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="absolute inset-0 bg-black/50" />
      <div className="container relative z-10">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
            Master Coding Challenges
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-300 animate-fade-in">
            Sharpen your skills with real-world problems from top tech companies
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
            <Button
              size="lg"
              className="bg-gradient-primary hover:shadow-glow text-lg px-8"
              onClick={onStartCoding}
            >
              Start Coding
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-white/10 border-white/20 hover:bg-white/20 text-lg px-8"
              onClick={onBrowseChallenges}
            >
              Browse Challenges
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            {STATS.map((stat, index) => (
              <div
                key={index}
                className="text-center space-y-2 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div
                  className={`inline-flex p-3 rounded-full bg-white/10 ${stat.color}`}
                >
                  <stat.icon className="h-6 w-6" />
                </div>
                <div className="text-2xl font-bold text-white">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
