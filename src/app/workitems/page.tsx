import Link from "next/link";
import { getWorkItemRepository } from "@/lib/workitems";
import { WORK_ITEM_STATUSES, WorkItemStatus } from "@/lib/workitems/types";
import { WorkItemTable } from "@/components/workitems/WorkItemTable";
import { StatusFilter } from "@/components/workitems/StatusFilter";

export const dynamic = "force-dynamic";

interface WorkItemsPageProps {
  searchParams?: Promise<{ status?: string | string[] }>;
}

export default async function WorkItemsPage(props: WorkItemsPageProps) {
  const resolvedSearchParams = (await props.searchParams) || {};
  const rawStatus = Array.isArray(resolvedSearchParams.status)
    ? resolvedSearchParams.status[0]
    : resolvedSearchParams.status;

  let selectedStatus: string | undefined = undefined;
  if (rawStatus && rawStatus !== "All") {
    if (WORK_ITEM_STATUSES.includes(rawStatus as WorkItemStatus)) {
      selectedStatus = rawStatus;
    }
  }

  const repo = getWorkItemRepository();
  const items = await repo.list(selectedStatus ? { status: selectedStatus } : undefined);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Work Items</h1>
          <p className="text-sm text-gray-600 mt-1">Manage and track all project work items.</p>
        </div>
        <Link
          href="/workitems/new"
          className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors"
        >
          Create Work Item
        </Link>
      </div>

      <div className="mb-6">
        <StatusFilter currentStatus={selectedStatus ?? "All"} />
      </div>

      <WorkItemTable items={items} />
    </div>
  );
}
