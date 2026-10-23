import { WorkItemForm } from "@/components/workitems/WorkItemForm";
import { createWorkItem } from "@/app/workitems/actions";

export const dynamic = "force-dynamic";

export default function NewWorkItemPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Create Work Item</h1>
        <p className="text-sm text-gray-600 mt-1">
          Create a new work item with summary, description, and status.
        </p>
      </div>
      <WorkItemForm
        action={createWorkItem}
        submitLabel="Create Work Item"
        cancelHref="/workitems"
      />
    </div>
  );
}
