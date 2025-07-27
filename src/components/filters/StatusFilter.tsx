import { CheckCircle, Circle } from "lucide-react";

interface StatusFilterProps {
  selectedStatus: string[];
  setSelectedStatus: (status: string[]) => void;
}

const StatusFilter = ({
  selectedStatus,
  setSelectedStatus,
}: StatusFilterProps) => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold">Status</h3>
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="solved"
          checked={selectedStatus.includes("solved")}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedStatus([...selectedStatus, "solved"]);
            } else {
              setSelectedStatus(selectedStatus.filter((s) => s !== "solved"));
            }
          }}
          className="rounded"
        />
        <label htmlFor="solved" className="text-sm flex items-center gap-1">
          <CheckCircle className="h-3 w-3 text-green-500" />
          Solved
        </label>
      </div>
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="unsolved"
          checked={selectedStatus.includes("unsolved")}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedStatus([...selectedStatus, "unsolved"]);
            } else {
              setSelectedStatus(selectedStatus.filter((s) => s !== "unsolved"));
            }
          }}
          className="rounded"
        />
        <label htmlFor="unsolved" className="text-sm flex items-center gap-1">
          <Circle className="h-3 w-3 text-gray-400" />
          Unsolved
        </label>
      </div>
    </div>
  </div>
);

export default StatusFilter;
