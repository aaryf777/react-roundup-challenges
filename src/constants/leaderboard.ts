export interface LeaderboardUser {
  id: string;
  username: string;
  email: string;
  points: {
    today: number;
    lastWeek: number;
    lastMonth: number;
    allTime: number;
  };
  problemsSolved: {
    today: number;
    lastWeek: number;
    lastMonth: number;
    allTime: number;
  };
  rank: number;
  avatar: string;
}

export const LEADERBOARD_USERS: LeaderboardUser[] = [
  {
    id: "1",
    username: "alex_coder",
    email: "alex@example.com",
    points: { today: 150, lastWeek: 850, lastMonth: 3200, allTime: 12500 },
    problemsSolved: { today: 3, lastWeek: 17, lastMonth: 64, allTime: 245 },
    rank: 1,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex",
  },
  {
    id: "2",
    username: "sarah_dev",
    email: "sarah@example.com",
    points: { today: 120, lastWeek: 720, lastMonth: 2800, allTime: 11800 },
    problemsSolved: { today: 2, lastWeek: 14, lastMonth: 56, allTime: 230 },
    rank: 2,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
  },
  {
    id: "3",
    username: "mike_tech",
    email: "mike@example.com",
    points: { today: 100, lastWeek: 680, lastMonth: 2600, allTime: 11200 },
    problemsSolved: { today: 2, lastWeek: 13, lastMonth: 52, allTime: 218 },
    rank: 3,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mike",
  },
  {
    id: "4",
    username: "emma_hacker",
    email: "emma@example.com",
    points: { today: 90, lastWeek: 650, lastMonth: 2400, allTime: 10800 },
    problemsSolved: { today: 1, lastWeek: 12, lastMonth: 48, allTime: 205 },
    rank: 4,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emma",
  },
  {
    id: "5",
    username: "john_script",
    email: "john@example.com",
    points: { today: 80, lastWeek: 620, lastMonth: 2200, allTime: 10200 },
    problemsSolved: { today: 1, lastWeek: 11, lastMonth: 44, allTime: 195 },
    rank: 5,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
  },
  {
    id: "6",
    username: "lisa_code",
    email: "lisa@example.com",
    points: { today: 70, lastWeek: 590, lastMonth: 2000, allTime: 9800 },
    problemsSolved: { today: 1, lastWeek: 10, lastMonth: 40, allTime: 185 },
    rank: 6,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=lisa",
  },
  {
    id: "7",
    username: "david_byte",
    email: "david@example.com",
    points: { today: 60, lastWeek: 560, lastMonth: 1800, allTime: 9400 },
    problemsSolved: { today: 1, lastWeek: 9, lastMonth: 36, allTime: 175 },
    rank: 7,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=david",
  },
  {
    id: "8",
    username: "anna_stack",
    email: "anna@example.com",
    points: { today: 50, lastWeek: 530, lastMonth: 1600, allTime: 9000 },
    problemsSolved: { today: 1, lastWeek: 8, lastMonth: 32, allTime: 165 },
    rank: 8,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=anna",
  },
  {
    id: "9",
    username: "tom_queue",
    email: "tom@example.com",
    points: { today: 40, lastWeek: 500, lastMonth: 1400, allTime: 8600 },
    problemsSolved: { today: 0, lastWeek: 7, lastMonth: 28, allTime: 155 },
    rank: 9,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=tom",
  },
  {
    id: "10",
    username: "rachel_tree",
    email: "rachel@example.com",
    points: { today: 30, lastWeek: 470, lastMonth: 1200, allTime: 8200 },
    problemsSolved: { today: 0, lastWeek: 6, lastMonth: 24, allTime: 145 },
    rank: 10,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=rachel",
  },
  {
    id: "11",
    username: "chris_graph",
    email: "chris@example.com",
    points: { today: 25, lastWeek: 440, lastMonth: 1100, allTime: 7800 },
    problemsSolved: { today: 0, lastWeek: 5, lastMonth: 22, allTime: 135 },
    rank: 11,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=chris",
  },
  {
    id: "12",
    username: "jessica_heap",
    email: "jessica@example.com",
    points: { today: 20, lastWeek: 410, lastMonth: 1000, allTime: 7400 },
    problemsSolved: { today: 0, lastWeek: 4, lastMonth: 20, allTime: 125 },
    rank: 12,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jessica",
  },
];

export const TIME_FILTERS = [
  { label: "Today", value: "today" },
  { label: "Last Week", value: "lastWeek" },
  { label: "Last Month", value: "lastMonth" },
  { label: "All Time", value: "allTime" },
];

export const USERS_PER_PAGE = 10;
