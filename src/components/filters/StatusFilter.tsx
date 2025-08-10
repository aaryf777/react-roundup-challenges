import { CheckCircle, XCircle, AlertCircle, Circle } from "lucide-react";

interface StatusFilterProps {
  selectedStatus: string[];
  setSelectedStatus: (status: string[]) => void;
}

const STATUSES = [
  { id: 'accepted', label: 'Accepted', icon: CheckCircle, color: 'text-green-500' },
  { id: 'partial_accepted', label: 'Partial Accepted', icon: AlertCircle, color: 'text-yellow-500' },
  { id: 'failed', label: 'Failed', icon: XCircle, color: 'text-red-500' },
  { id: 'unsolved', label: 'Unsolved', icon: Circle, color: 'text-gray-400' },
];

const StatusFilter = ({
  selectedStatus,
  setSelectedStatus,
}: StatusFilterProps) => {
  const handleStatusChange = (statusId: string, checked: boolean) => {
    if (checked) {
      setSelectedStatus([...selectedStatus, statusId]);
    } else {
      setSelectedStatus(selectedStatus.filter((s) => s !== statusId));
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Status</h3>
      <div className="space-y-2">
        {STATUSES.map(status => {
          const Icon = status.icon;
          return (
            <div key={status.id} className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={status.id}
                checked={selectedStatus.includes(status.id)}
                onChange={(e) => handleStatusChange(status.id, e.target.checked)}
                className="rounded"
              />
              <label htmlFor={status.id} className="text-sm flex items-center gap-1">
                <Icon className={`h-3 w-3 ${status.color}`} />
                {status.label}
              </label>
            </div>
          )
        })}
      </div>
    </div>
  );
}

export default StatusFilter;
