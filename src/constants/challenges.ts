import { Challenge, Category } from "@/contexts/ChallengesContext";

export const COMPANY_LIST = [
  "Spotify",
  "Oyo",
  "Nvidia",
  "Snapchat",
  "Infosys",
  "Meta",
  "Slack",
  "Twitch",
  "Stripe",
  "Google",
  "Oracle",
  "Meesho",
  "Microsoft",
  "Zomato",
  "Wipro",
  "Paypal",
  "Linkedin",
  "Flipkart",
  "Ola",
];

export const CATEGORIES: Category[] = [
  { id: "javascript", name: "JavaScript", count: 45, icon: "🟨" },
  { id: "react", name: "React", count: 32, icon: "⚛️" },
  { id: "algorithms", name: "Algorithms", count: 78, icon: "🧠" },
  { id: "data-structures", name: "Data Structures", count: 56, icon: "🗃️" },
  { id: "frontend", name: "Frontend", count: 23, icon: "🎨" },
];

export const SORT_OPTIONS = [
  { label: "Latest", value: "latest" },
  { label: "Most Solved", value: "solved-asc" },
];

export const CHALLENGES_PER_PAGE = 6;
