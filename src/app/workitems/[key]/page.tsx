import Link from "next/link";
import { notFound } from "next/navigation";
import { getWorkItemRepository } from "@/lib/workitems";
import { DeleteWorkItemButton } from "@/components/workitems/DeleteWorkItemButton";

export const dynamic = "force-dynamic";

interface WorkItemDetailPageProps {
  params: Promise<{ key: string }>;
}

export default async function WorkItemDetailPage(props: WorkItemDetailPageProps) {
  const { key } = await props.params;
  const repo = getWorkItemRepository();
  const item = await repo.getByKey(key);

  if (!item) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Top navigation / breadcrumbs */}
      <div className="mb-4">
        <Link href="/workitems" className="text-sm font-medium text-blue-600 hover:underline">
          &larr; Back to Work Items
        </Link>
      </div>

      {/* Main card */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-gray-200">
          <div>
            <span className="inline-block px-2.5 py-0.5 rounded text-xs font-semibold uppercase tracking-wider bg-gray-100 text-gray-800 mb-2">
              {item.key}
            </span>
            <h1 className="text-2xl font-bold text-gray-900">{item.summary}</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href={`/workitems/${item.key}/edit`}
              className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 transition-colors"
            >
              Edit
            </Link>
            <DeleteWorkItemButton itemKey={item.key} />
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6 border-b border-gray-200">
          <div>
            <h2 className="text-sm font-medium text-gray-500">Details</h2>
            <dl className="mt-3 space-y-3 text-sm">
              <div className="flex justify-between sm:justify-start sm:gap-8">
                <dt className="text-gray-500 w-24">Type</dt>
                <dd className="font-medium text-gray-900">{item.type}</dd>
              </div>
              <div className="flex justify-between sm:justify-start sm:gap-8">
                <dt className="text-gray-500 w-24">Status</dt>
                <dd>
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
                </dd>
              </div>
              <div className="flex justify-between sm:justify-start sm:gap-8">
                <dt className="text-gray-500 w-24">Priority</dt>
                <dd className="font-medium text-gray-900">{item.priority}</dd>
              </div>
            </dl>
          </div>

          <div>
            <h2 className="text-sm font-medium text-gray-500">People & Dates</h2>
            <dl className="mt-3 space-y-3 text-sm">
              <div className="flex justify-between sm:justify-start sm:gap-8">
                <dt className="text-gray-500 w-24">Assignee</dt>
                <dd className="font-medium text-gray-900">{item.assignee || "Unassigned"}</dd>
              </div>
              <div className="flex justify-between sm:justify-start sm:gap-8">
                <dt className="text-gray-500 w-24">Reporter</dt>
                <dd className="font-medium text-gray-900">{item.reporter || "None"}</dd>
              </div>
              <div className="flex justify-between sm:justify-start sm:gap-8">
                <dt className="text-gray-500 w-24">Created</dt>
                <dd className="text-gray-600">
                  {item.createdAt instanceof Date
                    ? item.createdAt.toISOString().slice(0, 10)
                    : String(item.createdAt)}
                </dd>
              </div>
              <div className="flex justify-between sm:justify-start sm:gap-8">
                <dt className="text-gray-500 w-24">Updated</dt>
                <dd className="text-gray-600">
                  {item.updatedAt instanceof Date
                    ? item.updatedAt.toISOString().slice(0, 10)
                    : String(item.updatedAt)}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Description Section */}
        <div className="pt-6">
          <h2 className="text-sm font-medium text-gray-500 mb-2">Description</h2>
          <div className="text-sm text-gray-900 whitespace-pre-wrap bg-gray-50 rounded-md p-4 border border-gray-100">
            {item.description ? (
              item.description
            ) : (
              <span className="italic text-gray-500">No description provided.</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
