import { prisma as defaultPrisma } from "@/lib/db/prisma";
import type { PrismaClient } from "@/generated/prisma/client";
import { WorkItem, WorkItemInput, parseKey, toKey } from "./types";
import { ListWorkItemsOptions, WorkItemRepository } from "./repository";

export class PrismaWorkItemRepository implements WorkItemRepository {
  private client: PrismaClient;

  constructor(client: PrismaClient = defaultPrisma) {
    this.client = client;
  }

  private mapRecordToWorkItem(record: {
    id: number;
    summary: string;
    description: string | null;
    type: string;
    status: string;
    priority: string;
    assignee: string | null;
    reporter: string | null;
    createdAt: Date;
    updatedAt: Date;
  }): WorkItem {
    return {
      id: record.id,
      key: toKey(record.id),
      summary: record.summary,
      description: record.description,
      type: record.type as WorkItem["type"],
      status: record.status as WorkItem["status"],
      priority: record.priority as WorkItem["priority"],
      assignee: record.assignee,
      reporter: record.reporter,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };
  }

  async list(options?: ListWorkItemsOptions): Promise<WorkItem[]> {
    const where: { status?: string } = {};
    if (options?.status && options.status !== "All") {
      where.status = options.status;
    }

    const records = await this.client.workItem.findMany({
      where,
      orderBy: [{ updatedAt: "desc" }, { id: "desc" }],
    });

    return records.map((r) => this.mapRecordToWorkItem(r));
  }

  async getByKey(key: string): Promise<WorkItem | null> {
    const id = parseKey(key);
    if (id === null) {
      return null;
    }

    const record = await this.client.workItem.findUnique({
      where: { id },
    });

    if (!record) {
      return null;
    }

    return this.mapRecordToWorkItem(record);
  }

  async create(input: WorkItemInput): Promise<WorkItem> {
    const record = await this.client.workItem.create({
      data: {
        summary: input.summary,
        description: input.description ?? null,
        type: input.type ?? "Task",
        status: input.status ?? "To Do",
        priority: input.priority ?? "Medium",
        assignee: input.assignee ?? null,
        reporter: input.reporter ?? null,
      },
    });

    return this.mapRecordToWorkItem(record);
  }

  async update(key: string, input: WorkItemInput): Promise<WorkItem | null> {
    const id = parseKey(key);
    if (id === null) {
      return null;
    }

    try {
      const record = await this.client.workItem.update({
        where: { id },
        data: {
          ...(input.summary !== undefined ? { summary: input.summary } : {}),
          ...(input.description !== undefined ? { description: input.description } : {}),
          ...(input.type !== undefined ? { type: input.type } : {}),
          ...(input.status !== undefined ? { status: input.status } : {}),
          ...(input.priority !== undefined ? { priority: input.priority } : {}),
          ...(input.assignee !== undefined ? { assignee: input.assignee } : {}),
          ...(input.reporter !== undefined ? { reporter: input.reporter } : {}),
        },
      });

      return this.mapRecordToWorkItem(record);
    } catch (e: unknown) {
      if ((e as { code?: string })?.code === "P2025") {
        return null;
      }
      throw e;
    }
  }

  async delete(key: string): Promise<boolean> {
    const id = parseKey(key);
    if (id === null) {
      return false;
    }

    try {
      await this.client.workItem.delete({
        where: { id },
      });
      return true;
    } catch (e: unknown) {
      if ((e as { code?: string })?.code === "P2025") {
        return false;
      }
      throw e;
    }
  }
}
