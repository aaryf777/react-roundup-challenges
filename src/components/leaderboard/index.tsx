import LeaderboardTable from "./LeaderboardTable";
import LeaderboardFilters from "./LeaderboardFilters";
import LeaderboardPagination from "./LeaderboardPagination";

interface LeaderboardProps {
  users: any[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  timeFilter: string;
  setTimeFilter: (filter: string) => void;
  currentPage: number;
  totalPages: number;
  paginatedUsers: any[];
  usersPerPage: number;
  handlePageChange: (page: number) => void;
}

const Leaderboard = ({
  users,
  searchQuery,
  setSearchQuery,
  timeFilter,
  setTimeFilter,
  currentPage,
  totalPages,
  paginatedUsers,
  usersPerPage,
  handlePageChange,
}: LeaderboardProps) => {
  return (
    <div className="container py-3">
      <h1 className="text-3xl font-bold mb-8">Leaderboard</h1>
      <LeaderboardFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        timeFilter={timeFilter}
        setTimeFilter={setTimeFilter}
      />
      <LeaderboardTable
        users={paginatedUsers}
        timeFilter={timeFilter}
        currentPage={currentPage}
        usersPerPage={usersPerPage}
      />
      <LeaderboardPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default Leaderboard;
