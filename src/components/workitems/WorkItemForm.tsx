"use client";

import { useActionState } from "react";
import Link from "next/link";
import {
  DEFAULT_WORK_ITEM_PRIORITY,
  DEFAULT_WORK_ITEM_STATUS,
  DEFAULT_WORK_ITEM_TYPE,
  WORK_ITEM_PRIORITIES,
  WORK_ITEM_STATUSES,
  WORK_ITEM_TYPES,
  WorkItem,
} from "@/lib/workitems/types";
import { ActionState } from "@/app/workitems/actions";

interface WorkItemFormProps {
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
  initialValues?: Partial<WorkItem>;
  submitLabel?: string;
  cancelHref?: string;
}

export function WorkItemForm({
  action,
  initialValues,
  submitLabel = "Save",
  cancelHref = "/workitems",
}: WorkItemFormProps) {
  const [state, formAction, isPending] = useActionState(action, {});

  // Form values prioritize error feedback values, then initialValues, then defaults
  const values = {
    summary: state?.values?.summary ?? initialValues?.summary ?? "",
    description: state?.values?.description ?? initialValues?.description ?? "",
    type: state?.values?.type ?? initialValues?.type ?? DEFAULT_WORK_ITEM_TYPE,
    status: state?.values?.status ?? initialValues?.status ?? DEFAULT_WORK_ITEM_STATUS,
    priority: state?.values?.priority ?? initialValues?.priority ?? DEFAULT_WORK_ITEM_PRIORITY,
    assignee: state?.values?.assignee ?? initialValues?.assignee ?? "",
    reporter: state?.values?.reporter ?? initialValues?.reporter ?? "",
  };

  return (
    <form
      action={formAction}
      className="space-y-6 max-w-2xl bg-white p-6 rounded-lg border border-gray-200 shadow-sm"
    >
      {state?.message && (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">{state.message}</div>
      )}

      {/* Summary */}
      <div>
        <label htmlFor="summary" className="block text-sm font-medium text-gray-700 mb-1">
          Summary <span className="text-red-500">*</span>
        </label>
        <input
          id="summary"
          name="summary"
          type="text"
          defaultValue={values.summary}
          aria-invalid={!!state?.errors?.summary}
          aria-describedby={state?.errors?.summary ? "summary-error" : undefined}
          className={`w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            state?.errors?.summary
              ? "border-red-500 text-red-900 focus:border-red-500"
              : "border-gray-300 text-gray-900"
          }`}
          placeholder="Brief summary of the work item"
        />
        {state?.errors?.summary && (
          <p id="summary-error" className="mt-1 text-sm text-red-600">
            {state.errors.summary}
          </p>
        )}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={values.description}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          placeholder="Detailed description..."
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Type */}
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
            Type
          </label>
          <select
            id="type"
            name="type"
            defaultValue={values.type}
            aria-invalid={!!state?.errors?.type}
            aria-describedby={state?.errors?.type ? "type-error" : undefined}
            className={`w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white ${
              state?.errors?.type
                ? "border-red-500 text-red-900 focus:border-red-500"
                : "border-gray-300"
            }`}
          >
            {WORK_ITEM_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          {state?.errors?.type && (
            <p id="type-error" className="mt-1 text-sm text-red-600">
              {state.errors.type}
            </p>
          )}
        </div>

        {/* Status */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            id="status"
            name="status"
            defaultValue={values.status}
            aria-invalid={!!state?.errors?.status}
            aria-describedby={state?.errors?.status ? "status-error" : undefined}
            className={`w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white ${
              state?.errors?.status
                ? "border-red-500 text-red-900 focus:border-red-500"
                : "border-gray-300"
            }`}
          >
            {WORK_ITEM_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          {state?.errors?.status && (
            <p id="status-error" className="mt-1 text-sm text-red-600">
              {state.errors.status}
            </p>
          )}
        </div>

        {/* Priority */}
        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
            Priority
          </label>
          <select
            id="priority"
            name="priority"
            defaultValue={values.priority}
            aria-invalid={!!state?.errors?.priority}
            aria-describedby={state?.errors?.priority ? "priority-error" : undefined}
            className={`w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white ${
              state?.errors?.priority
                ? "border-red-500 text-red-900 focus:border-red-500"
                : "border-gray-300"
            }`}
          >
            {WORK_ITEM_PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          {state?.errors?.priority && (
            <p id="priority-error" className="mt-1 text-sm text-red-600">
              {state.errors.priority}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Assignee */}
        <div>
          <label htmlFor="assignee" className="block text-sm font-medium text-gray-700 mb-1">
            Assignee
          </label>
          <input
            id="assignee"
            name="assignee"
            type="text"
            defaultValue={values.assignee}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            placeholder="e.g. Jane Doe"
          />
        </div>

        {/* Reporter */}
        <div>
          <label htmlFor="reporter" className="block text-sm font-medium text-gray-700 mb-1">
            Reporter
          </label>
          <input
            id="reporter"
            name="reporter"
            type="text"
            defaultValue={values.reporter}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            placeholder="e.g. John Doe"
          />
        </div>
      </div>

      {/* Form buttons */}
      <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50 transition-colors"
        >
          {isPending ? "Saving..." : submitLabel}
        </button>
        <Link
          href={cancelHref}
          className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
