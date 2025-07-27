import { useState, useMemo } from "react";
import { LEADERBOARD_USERS, USERS_PER_PAGE } from "@/constants/leaderboard";
import Leaderboard from "@/components/leaderboard";

const LeaderboardPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [timeFilter, setTimeFilter] = useState("allTime");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredUsers = useMemo(() => {
    return LEADERBOARD_USERS.filter((user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase())
    ).sort((a, b) => b.points[timeFilter] - a.points[timeFilter]);
  }, [searchQuery, timeFilter]);

  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * USERS_PER_PAGE,
    currentPage * USERS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <Leaderboard
      users={filteredUsers}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      timeFilter={timeFilter}
      setTimeFilter={setTimeFilter}
      currentPage={currentPage}
      totalPages={totalPages}
      paginatedUsers={paginatedUsers}
      usersPerPage={USERS_PER_PAGE}
      handlePageChange={handlePageChange}
    />
  );
};

export default LeaderboardPage;
