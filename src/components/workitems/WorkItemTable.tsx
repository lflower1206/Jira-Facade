import Link from "next/link";
import { WorkItem } from "@/lib/workitems/types";

interface WorkItemTableProps {
  items: WorkItem[];
}

export function WorkItemTable({ items }: WorkItemTableProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 p-8 text-center bg-white shadow-sm">
        <p className="text-gray-500 mb-4">No work items found.</p>
        <Link
          href="/workitems/new"
          className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors"
        >
          Create Work Item
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm bg-white">
      <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
        <thead className="bg-gray-50 text-gray-700">
          <tr>
            <th scope="col" className="px-4 py-3 font-semibold">
              Key
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
              Summary
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
              Type
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
              Status
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
              Priority
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
              Assignee
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
              Updated
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {items.map((item) => (
            <tr key={item.key} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3 font-medium text-blue-600">
                <Link href={`/workitems/${item.key}`} className="hover:underline">
                  {item.key}
                </Link>
              </td>
              <td className="px-4 py-3 text-gray-900">
                <Link href={`/workitems/${item.key}`} className="hover:underline">
                  {item.summary}
                </Link>
              </td>
              <td className="px-4 py-3 text-gray-600">{item.type}</td>
              <td className="px-4 py-3">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    item.status === "Done"
                      ? "bg-green-100 text-green-800"
                      : item.status === "In Progress"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {item.status}
                </span>
              </td>
              <td className="px-4 py-3 text-gray-600">{item.priority}</td>
              <td className="px-4 py-3 text-gray-600">{item.assignee || "Unassigned"}</td>
              <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                {item.updatedAt instanceof Date
                  ? item.updatedAt.toISOString().slice(0, 10)
                  : String(item.updatedAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
