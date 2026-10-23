import { WorkItem, WorkItemInput } from "./types";

export interface ListWorkItemsOptions {
  status?: string;
}

export interface WorkItemRepository {
  list(options?: ListWorkItemsOptions): Promise<WorkItem[]>;
  getByKey(key: string): Promise<WorkItem | null>;
  create(input: WorkItemInput): Promise<WorkItem>;
  update(key: string, input: WorkItemInput): Promise<WorkItem | null>;
  delete(key: string): Promise<boolean>;
}
