import { LeaderboardUser } from "@/constants/leaderboard";
import { Card, CardContent } from "@/components/ui/card";

interface LeaderboardTableProps {
  users: LeaderboardUser[];
  timeFilter: string;
  currentPage: number;
  usersPerPage: number;
}

const LeaderboardTable = ({
  users,
  timeFilter,
  currentPage,
  usersPerPage,
}: LeaderboardTableProps) => {
  return (
    <Card>
      <CardContent className="p-0">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Rank
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Points
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Problems Solved
              </th>
            </tr>
          </thead>
          <tbody className="bg-background divide-y divide-border">
            {users.map((user, idx) => (
              <tr key={user.id} className="hover:bg-muted/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-foreground">
                  {(currentPage - 1) * usersPerPage + idx + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap flex items-center gap-2">
                  <img
                    src={user.avatar}
                    alt={user.username}
                    className="h-8 w-8 rounded-full"
                  />
                  <span className="text-foreground">{user.username}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap font-semibold text-foreground">
                  {user.points[timeFilter]}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-foreground">
                  {user.problemsSolved[timeFilter]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
};

export default LeaderboardTable;
