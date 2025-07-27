import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CompanyFilterProps {
  companies: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  companiesPerPage?: number;
}

const CompanyFilter = ({
  companies,
  selected,
  onChange,
  companiesPerPage = 8,
}: CompanyFilterProps) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filteredCompanies = useMemo(() => {
    return companies.filter((c) =>
      c.toLowerCase().includes(search.toLowerCase())
    );
  }, [companies, search]);

  const totalPages =
    Math.ceil(filteredCompanies.length / companiesPerPage) || 1;
  const paginatedCompanies = filteredCompanies.slice(
    (page - 1) * companiesPerPage,
    page * companiesPerPage
  );

  const isAllSelected = selected.length === 0 || selected.includes("All");

  const handleToggle = (company: string) => {
    if (company === "All") {
      onChange(["All"]);
    } else {
      let newSelected = selected.includes(company)
        ? selected.filter((c) => c !== company && c !== "All")
        : [...selected.filter((c) => c !== "All"), company];
      if (newSelected.length === 0) newSelected = ["All"];
      onChange(newSelected);
    }
  };

  const handleAll = () => {
    onChange(["All"]);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handlePage = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <div className="bg-card rounded-xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <span className="font-medium">Filter by Company</span>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Button
            variant="ghost"
            size="icon"
            disabled={page === 1}
            onClick={() => handlePage(page - 1)}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span>
            {page}/{totalPages}
          </span>
          <Button
            variant="ghost"
            size="icon"
            disabled={page === totalPages}
            onClick={() => handlePage(page + 1)}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <Input
        placeholder="Search companies..."
        value={search}
        onChange={handleSearch}
        className="mb-3"
      />
      <div className="flex flex-wrap gap-2">
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={isAllSelected}
            onChange={handleAll}
            className="accent-primary mr-1"
          />
          <span className="px-3 py-1 rounded-full border text-xs font-medium bg-muted/50 border-border {isAllSelected ? 'bg-primary/10 border-primary' : ''}">
            All
          </span>
        </label>
        {paginatedCompanies.map((company) => (
          <label key={company} className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isAllSelected ? false : selected.includes(company)}
              onChange={() => handleToggle(company)}
              className="accent-primary mr-1"
            />
            <span
              className={`px-3 py-1 rounded-full border text-xs font-medium bg-muted/50 border-border ${selected.includes(company) && !isAllSelected ? "bg-primary/10 border-primary" : ""}`}
            >
              {company}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default CompanyFilter;
