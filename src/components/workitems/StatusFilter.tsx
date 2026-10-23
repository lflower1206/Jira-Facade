import Link from "next/link";
import { WORK_ITEM_STATUSES, WorkItemStatus } from "@/lib/workitems/types";

interface StatusFilterProps {
  currentStatus?: string;
}

export function StatusFilter({ currentStatus }: StatusFilterProps) {
  const activeStatus = currentStatus || "All";
  const options: Array<{ label: string; value: string }> = [
    { label: "All", value: "All" },
    ...WORK_ITEM_STATUSES.map((status: WorkItemStatus) => ({
      label: status,
      value: status,
    })),
  ];

  return (
    <div className="flex items-center gap-2" role="group" aria-label="Status filter">
      <span className="text-sm font-medium text-gray-700">Filter by Status:</span>
      <div className="flex flex-wrap gap-1">
        {options.map((option) => {
          const isActive = activeStatus.toLowerCase() === option.value.toLowerCase();
          const href = `/workitems?status=${encodeURIComponent(option.value)}`;

          return (
            <Link
              key={option.value}
              href={href}
              className={`rounded-md px-3 py-1 text-sm font-medium transition-colors ${
                isActive ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              {option.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
