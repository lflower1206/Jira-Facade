import { notFound } from "next/navigation";
import { getWorkItemRepository } from "@/lib/workitems";
import { WorkItemForm } from "@/components/workitems/WorkItemForm";
import { updateWorkItem } from "@/app/workitems/actions";

export const dynamic = "force-dynamic";

interface EditWorkItemPageProps {
  params: Promise<{ key: string }>;
}

export default async function EditWorkItemPage(props: EditWorkItemPageProps) {
  const { key } = await props.params;
  const repo = getWorkItemRepository();
  const workItem = await repo.getByKey(key);

  if (!workItem) {
    notFound();
  }

  const boundUpdateAction = updateWorkItem.bind(null, key);

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Edit {workItem.key}</h1>
        <p className="text-sm text-gray-600 mt-1">Update details for this work item.</p>
      </div>
      <WorkItemForm
        action={boundUpdateAction}
        initialValues={workItem}
        submitLabel="Save Changes"
        cancelHref={`/workitems/${workItem.key}`}
      />
    </div>
  );
}
