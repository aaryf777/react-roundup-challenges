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

export const ALL_CHALLENGES: Challenge[] = [
  {
    title: "Two Sum",
    description:
      "Find two numbers in an array that add up to a target sum. A classic introduction to hash tables and array manipulation.",
    difficulty: "easy",
    category: "Arrays",
    timeEstimate: "15 min",
    solvedBy: 2547,
    points: 10,
    tags: ["Array", "Hash Table", "Two Pointers"],
    companies: ["Google", "Microsoft", "Meta"],
  },
  {
    title: "React useState Hook",
    description:
      "Build a counter component using React's useState hook. Learn the fundamentals of state management in functional components.",
    difficulty: "easy",
    category: "React",
    timeEstimate: "10 min",
    solvedBy: 1832,
    points: 10,
    tags: ["React", "Hooks", "State"],
    companies: ["Meta", "Spotify", "Slack"],
  },
  {
    title: "Binary Tree Traversal",
    description:
      "Implement inorder, preorder, and postorder traversal algorithms for binary trees using both recursive and iterative approaches.",
    difficulty: "medium",
    category: "Data Structures",
    timeEstimate: "30 min",
    solvedBy: 1205,
    points: 25,
    tags: ["Binary Tree", "Recursion", "Stack"],
    companies: ["Google", "Oracle", "Infosys"],
  },
  {
    title: "Async/Await Promise Chain",
    description:
      "Handle multiple asynchronous operations with proper error handling. Master modern JavaScript async patterns.",
    difficulty: "medium",
    category: "JavaScript",
    timeEstimate: "25 min",
    solvedBy: 987,
    points: 25,
    tags: ["Async", "Promises", "Error Handling"],
    companies: ["Stripe", "Paypal", "Snapchat"],
  },
  {
    title: "Custom React Hook",
    description:
      "Create a reusable custom hook for API data fetching with loading states, error handling, and caching.",
    difficulty: "hard",
    category: "React",
    timeEstimate: "45 min",
    solvedBy: 543,
    points: 50,
    tags: ["React", "Custom Hooks", "API"],
    companies: ["Meta", "Slack", "Meesho"],
  },
  {
    title: "Merge Sort Algorithm",
    description:
      "Implement the merge sort algorithm with O(n log n) time complexity. Understand divide and conquer strategies.",
    difficulty: "hard",
    category: "Algorithms",
    timeEstimate: "40 min",
    solvedBy: 721,
    points: 50,
    tags: ["Sorting", "Divide & Conquer", "Recursion"],
    companies: ["Google", "Microsoft", "Flipkart"],
  },
  {
    title: "Palindrome Checker",
    description: "Check if a string is a palindrome using two pointers.",
    difficulty: "easy",
    category: "Strings",
    timeEstimate: "10 min",
    solvedBy: 2100,
    points: 10,
    tags: ["String", "Two Pointers"],
    companies: ["Oyo", "Zomato", "Ola"],
  },
  {
    title: "FizzBuzz",
    description: "Classic FizzBuzz problem for loops and conditionals.",
    difficulty: "easy",
    category: "Math",
    timeEstimate: "5 min",
    solvedBy: 3000,
    points: 10,
    tags: ["Math", "Loop"],
    companies: ["Infosys", "Wipro", "Flipkart"],
  },
  {
    title: "LRU Cache",
    description: "Design and implement a Least Recently Used (LRU) cache.",
    difficulty: "hard",
    category: "Data Structures",
    timeEstimate: "60 min",
    solvedBy: 350,
    points: 50,
    tags: ["Cache", "Design", "Linked List"],
    companies: ["Oracle", "Paypal", "Stripe"],
  },
  {
    title: "Debounce Function",
    description: "Implement a debounce utility for function calls.",
    difficulty: "medium",
    category: "JavaScript",
    timeEstimate: "20 min",
    solvedBy: 800,
    points: 25,
    tags: ["Function", "Debounce", "Timing"],
    companies: ["Snapchat", "Slack", "Meta"],
  },
  {
    title: "Find Peak Element",
    description: "Find a peak element in an array using binary search.",
    difficulty: "medium",
    category: "Algorithms",
    timeEstimate: "25 min",
    solvedBy: 900,
    points: 25,
    tags: ["Array", "Binary Search"],
    companies: ["Nvidia", "Google", "Microsoft"],
  },
  {
    title: "Valid Parentheses",
    description: "Check if a string of parentheses is valid using a stack.",
    difficulty: "easy",
    category: "Stack",
    timeEstimate: "10 min",
    solvedBy: 1800,
    points: 10,
    tags: ["Stack", "String"],
    companies: ["Paypal", "Stripe", "Meesho"],
  },
  {
    title: "Deep Clone Object",
    description: "Implement a deep clone function for objects and arrays.",
    difficulty: "medium",
    category: "JavaScript",
    timeEstimate: "30 min",
    solvedBy: 700,
    points: 25,
    tags: ["Object", "Recursion", "Clone"],
    companies: ["Meta", "Google", "Microsoft"],
  },
  {
    title: "Throttle Function",
    description: "Implement a throttle utility for function calls.",
    difficulty: "medium",
    category: "JavaScript",
    timeEstimate: "20 min",
    solvedBy: 650,
    points: 25,
    tags: ["Function", "Throttle", "Timing"],
    companies: ["Slack", "Stripe", "Paypal"],
  },
  {
    title: "Find Missing Number",
    description: "Find the missing number in an array of 1..n.",
    difficulty: "easy",
    category: "Math",
    timeEstimate: "10 min",
    solvedBy: 1500,
    points: 10,
    tags: ["Math", "Array"],
    companies: ["Infosys", "Wipro", "Ola"],
  },
  {
    title: "Longest Substring Without Repeating Characters",
    description:
      "Find the length of the longest substring without repeating characters.",
    difficulty: "medium",
    category: "Strings",
    timeEstimate: "30 min",
    solvedBy: 850,
    points: 25,
    tags: ["String", "Sliding Window", "Hash Set"],
    companies: ["Google", "Microsoft", "Meta"],
  },
  {
    title: "Reverse Linked List",
    description: "Reverse a singly linked list.",
    difficulty: "medium",
    category: "Linked List",
    timeEstimate: "25 min",
    solvedBy: 750,
    points: 25,
    tags: ["Linked List", "Recursion"],
    companies: ["Microsoft", "Google", "Oracle"],
  },
  {
    title: "Implement Queue Using Stacks",
    description: "Implement a queue using two stacks.",
    difficulty: "medium",
    category: "Stack",
    timeEstimate: "20 min",
    solvedBy: 600,
    points: 25,
    tags: ["Stack", "Queue", "Design"],
    companies: ["Amazon", "Microsoft", "Google"],
  },
  {
    title: "Find Intersection Node",
    description: "Find the intersection node of two linked lists.",
    difficulty: "medium",
    category: "Linked List",
    timeEstimate: "30 min",
    solvedBy: 500,
    points: 25,
    tags: ["Linked List", "Two Pointers"],
    companies: ["Google", "Microsoft", "Amazon"],
  },
  {
    title: "Maximum Subarray",
    description: "Find the contiguous subarray with the largest sum.",
    difficulty: "medium",
    category: "Array",
    timeEstimate: "20 min",
    solvedBy: 950,
    points: 25,
    tags: ["Array", "Dynamic Programming"],
    companies: ["Google", "Microsoft", "Amazon"],
  },
  {
    title: "Implement Stack Using Queues",
    description: "Implement a stack using two queues.",
    difficulty: "medium",
    category: "Queue",
    timeEstimate: "20 min",
    solvedBy: 450,
    points: 25,
    tags: ["Queue", "Stack", "Design"],
    companies: ["Microsoft", "Google", "Amazon"],
  },
  {
    title: "Binary Search Tree Validation",
    description: "Check if a binary tree is a valid binary search tree.",
    difficulty: "medium",
    category: "Data Structures",
    timeEstimate: "25 min",
    solvedBy: 680,
    points: 25,
    tags: ["Binary Tree", "BST", "Recursion"],
    companies: ["Google", "Microsoft", "Amazon"],
  },
  {
    title: "React Context API",
    description: "Build a theme switcher using React Context API.",
    difficulty: "medium",
    category: "React",
    timeEstimate: "30 min",
    solvedBy: 720,
    points: 25,
    tags: ["React", "Context", "State Management"],
    companies: ["Meta", "Spotify", "Slack"],
  },
  {
    title: "Memoization with useMemo",
    description: "Optimize expensive calculations using React's useMemo hook.",
    difficulty: "medium",
    category: "React",
    timeEstimate: "25 min",
    solvedBy: 580,
    points: 25,
    tags: ["React", "Performance", "Hooks"],
    companies: ["Meta", "Google", "Microsoft"],
  },
  {
    title: "Event Loop Understanding",
    description:
      "Demonstrate understanding of JavaScript's event loop with async operations.",
    difficulty: "hard",
    category: "JavaScript",
    timeEstimate: "35 min",
    solvedBy: 320,
    points: 50,
    tags: ["JavaScript", "Event Loop", "Async"],
    companies: ["Google", "Microsoft", "Meta"],
  },
  {
    title: "Graph Traversal - BFS",
    description: "Implement breadth-first search for graph traversal.",
    difficulty: "medium",
    category: "Algorithms",
    timeEstimate: "30 min",
    solvedBy: 420,
    points: 25,
    tags: ["Graph", "BFS", "Queue"],
    companies: ["Google", "Microsoft", "Amazon"],
  },
  {
    title: "Graph Traversal - DFS",
    description: "Implement depth-first search for graph traversal.",
    difficulty: "medium",
    category: "Algorithms",
    timeEstimate: "30 min",
    solvedBy: 380,
    points: 25,
    tags: ["Graph", "DFS", "Recursion"],
    companies: ["Google", "Microsoft", "Amazon"],
  },
  {
    title: "Dijkstra's Algorithm",
    description: "Implement Dijkstra's shortest path algorithm.",
    difficulty: "hard",
    category: "Algorithms",
    timeEstimate: "50 min",
    solvedBy: 280,
    points: 50,
    tags: ["Graph", "Shortest Path", "Priority Queue"],
    companies: ["Google", "Microsoft", "Amazon"],
  },
  {
    title: "React Performance Optimization",
    description:
      "Optimize a React component using React.memo, useCallback, and other performance techniques.",
    difficulty: "hard",
    category: "React",
    timeEstimate: "45 min",
    solvedBy: 350,
    points: 50,
    tags: ["React", "Performance", "Optimization"],
    companies: ["Meta", "Google", "Microsoft"],
  },
  {
    title: "WebSocket Implementation",
    description: "Build a real-time chat application using WebSockets.",
    difficulty: "hard",
    category: "JavaScript",
    timeEstimate: "60 min",
    solvedBy: 250,
    points: 50,
    tags: ["WebSocket", "Real-time", "Communication"],
    companies: ["Slack", "Discord", "Meta"],
  },
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
