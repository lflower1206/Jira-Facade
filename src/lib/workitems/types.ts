export const WORK_ITEM_TYPES = ["Task", "Bug", "Story", "Epic"] as const;
export type WorkItemType = (typeof WORK_ITEM_TYPES)[number];
export const DEFAULT_WORK_ITEM_TYPE: WorkItemType = "Task";

export const WORK_ITEM_STATUSES = ["To Do", "In Progress", "Done"] as const;
export type WorkItemStatus = (typeof WORK_ITEM_STATUSES)[number];
export const DEFAULT_WORK_ITEM_STATUS: WorkItemStatus = "To Do";

export const WORK_ITEM_PRIORITIES = ["Highest", "High", "Medium", "Low", "Lowest"] as const;
export type WorkItemPriority = (typeof WORK_ITEM_PRIORITIES)[number];
export const DEFAULT_WORK_ITEM_PRIORITY: WorkItemPriority = "Medium";

export interface WorkItem {
  id: number;
  key: string;
  summary: string;
  description: string | null;
  type: WorkItemType;
  status: WorkItemStatus;
  priority: WorkItemPriority;
  assignee: string | null;
  reporter: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkItemInput {
  summary: string;
  description?: string | null;
  type?: WorkItemType;
  status?: WorkItemStatus;
  priority?: WorkItemPriority;
  assignee?: string | null;
  reporter?: string | null;
}

export const KEY_PREFIX = "JF-";

export function toKey(id: number): string {
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error(`Invalid work item id for key: ${id}`);
  }
  return `${KEY_PREFIX}${id}`;
}

export function parseKey(key: string): number | null {
  if (typeof key !== "string" || !key.startsWith(KEY_PREFIX)) {
    return null;
  }
  const idStr = key.slice(KEY_PREFIX.length);
  if (!/^[1-9]\d*$/.test(idStr)) {
    return null;
  }
  const num = Number(idStr);
  return Number.isSafeInteger(num) ? num : null;
}
