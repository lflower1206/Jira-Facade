import {
  DEFAULT_WORK_ITEM_PRIORITY,
  DEFAULT_WORK_ITEM_STATUS,
  DEFAULT_WORK_ITEM_TYPE,
  WORK_ITEM_PRIORITIES,
  WORK_ITEM_STATUSES,
  WORK_ITEM_TYPES,
  WorkItemInput,
  WorkItemPriority,
  WorkItemStatus,
  WorkItemType,
} from "./types";

export type WorkItemFieldErrors = {
  summary?: string;
  type?: string;
  status?: string;
  priority?: string;
  assignee?: string;
  reporter?: string;
  description?: string;
};

export type ValidationResult =
  | {
      ok: true;
      data: WorkItemInput;
      values: Record<string, string>;
    }
  | {
      ok: false;
      errors: WorkItemFieldErrors;
      values: Record<string, string>;
    };

function getString(source: FormData | Record<string, unknown>, key: string): string {
  if (source instanceof FormData) {
    const val = source.get(key);
    return typeof val === "string" ? val : "";
  }
  const val = source[key];
  return typeof val === "string" ? val : "";
}

export function validateWorkItemInput(input: FormData | Record<string, unknown>): ValidationResult {
  const rawSummary = getString(input, "summary");
  const rawDescription = getString(input, "description");
  const rawType = getString(input, "type");
  const rawStatus = getString(input, "status");
  const rawPriority = getString(input, "priority");
  const rawAssignee = getString(input, "assignee");
  const rawReporter = getString(input, "reporter");

  const values: Record<string, string> = {
    summary: rawSummary,
    description: rawDescription,
    type: rawType,
    status: rawStatus,
    priority: rawPriority,
    assignee: rawAssignee,
    reporter: rawReporter,
  };

  const errors: WorkItemFieldErrors = {};

  const summary = rawSummary.trim();
  if (!summary) {
    errors.summary = "Summary is required";
  } else if (summary.length > 255) {
    errors.summary = "Summary must not exceed 255 characters";
  }

  let type: WorkItemType = DEFAULT_WORK_ITEM_TYPE;
  if (rawType.trim()) {
    if (WORK_ITEM_TYPES.includes(rawType as WorkItemType)) {
      type = rawType as WorkItemType;
    } else {
      errors.type = "Invalid work item type";
    }
  }

  let status: WorkItemStatus = DEFAULT_WORK_ITEM_STATUS;
  if (rawStatus.trim()) {
    if (WORK_ITEM_STATUSES.includes(rawStatus as WorkItemStatus)) {
      status = rawStatus as WorkItemStatus;
    } else {
      errors.status = "Invalid work item status";
    }
  }

  let priority: WorkItemPriority = DEFAULT_WORK_ITEM_PRIORITY;
  if (rawPriority.trim()) {
    if (WORK_ITEM_PRIORITIES.includes(rawPriority as WorkItemPriority)) {
      priority = rawPriority as WorkItemPriority;
    } else {
      errors.priority = "Invalid work item priority";
    }
  }

  if (Object.keys(errors).length > 0) {
    return {
      ok: false,
      errors,
      values,
    };
  }

  const description = rawDescription.trim() ? rawDescription : null;
  const assignee = rawAssignee.trim() ? rawAssignee.trim() : null;
  const reporter = rawReporter.trim() ? rawReporter.trim() : null;

  return {
    ok: true,
    data: {
      summary,
      description,
      type,
      status,
      priority,
      assignee,
      reporter,
    },
    values,
  };
}
