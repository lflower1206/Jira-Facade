/**
 * @jest-environment node
 */
import { createPrismaClient } from "@/lib/db/prisma";
import { PrismaWorkItemRepository } from "./prisma-repository";

describe("PrismaWorkItemRepository Integration", () => {
  const prisma = createPrismaClient("file:./data/test.db");
  const repository = new PrismaWorkItemRepository(prisma);

  beforeAll(async () => {
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "WorkItem" (
        "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        "summary" TEXT NOT NULL,
        "description" TEXT,
        "type" TEXT NOT NULL DEFAULT 'Task',
        "status" TEXT NOT NULL DEFAULT 'To Do',
        "priority" TEXT NOT NULL DEFAULT 'Medium',
        "assignee" TEXT,
        "reporter" TEXT,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL
      );
    `);
    await prisma.$executeRawUnsafe(
      `CREATE INDEX IF NOT EXISTS "WorkItem_status_idx" ON "WorkItem"("status");`
    );
    await prisma.$executeRawUnsafe(
      `CREATE INDEX IF NOT EXISTS "WorkItem_updatedAt_idx" ON "WorkItem"("updatedAt");`
    );
  });

  beforeEach(async () => {
    await prisma.workItem.deleteMany({});
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("applies creation defaults and sets timestamps", async () => {
    const item = await repository.create({
      summary: "Test work item",
    });

    expect(item.key).toMatch(/^JF-\d+$/);
    expect(item.summary).toBe("Test work item");
    expect(item.type).toBe("Task");
    expect(item.status).toBe("To Do");
    expect(item.priority).toBe("Medium");
    expect(item.description).toBeNull();
    expect(item.assignee).toBeNull();
    expect(item.reporter).toBeNull();
    expect(item.createdAt).toBeInstanceOf(Date);
    expect(item.updatedAt).toBeInstanceOf(Date);
  });

  it("generates sequential keys and does not reuse keys after delete", async () => {
    const item1 = await repository.create({ summary: "Item 1" });
    const item2 = await repository.create({ summary: "Item 2" });

    expect(item1.id).toBeLessThan(item2.id);
    expect(item2.id).toBe(item1.id + 1);
    expect(item1.key).toBe(`JF-${item1.id}`);
    expect(item2.key).toBe(`JF-${item2.id}`);

    // Delete item2
    const deleted = await repository.delete(item2.key);
    expect(deleted).toBe(true);

    // Create item3 - id must be greater than item2.id (no key reuse)
    const item3 = await repository.create({ summary: "Item 3" });
    expect(item3.id).toBeGreaterThan(item2.id);
    expect(item3.key).not.toBe(item2.key);
  });

  it("updates fields, refreshes updatedAt while preserving key and createdAt", async () => {
    const created = await repository.create({
      summary: "Original summary",
      type: "Task",
      status: "To Do",
      priority: "Low",
    });

    // Small delay to ensure updatedAt timestamp difference
    await new Promise((resolve) => setTimeout(resolve, 50));

    const updated = await repository.update(created.key, {
      summary: "Updated summary",
      status: "In Progress",
      priority: "High",
    });

    expect(updated).not.toBeNull();
    expect(updated!.key).toBe(created.key);
    expect(updated!.createdAt.getTime()).toBe(created.createdAt.getTime());
    expect(updated!.updatedAt.getTime()).toBeGreaterThanOrEqual(created.updatedAt.getTime());
    expect(updated!.summary).toBe("Updated summary");
    expect(updated!.status).toBe("In Progress");
    expect(updated!.priority).toBe("High");
  });

  it("preserves optional fields when updating with undefined values", async () => {
    const created = await repository.create({
      summary: "Task with optional fields",
      description: "Keep this description",
      assignee: "Alice",
      reporter: "Bob",
    });

    const updated = await repository.update(created.key, {
      summary: "Updated summary only",
    });

    expect(updated).not.toBeNull();
    expect(updated!.summary).toBe("Updated summary only");
    expect(updated!.description).toBe("Keep this description");
    expect(updated!.assignee).toBe("Alice");
    expect(updated!.reporter).toBe("Bob");
  });

  it("deletes work item and returns false when deleting non-existent item", async () => {
    const item = await repository.create({ summary: "To be deleted" });
    expect(await repository.delete(item.key)).toBe(true);
    expect(await repository.getByKey(item.key)).toBeNull();
    expect(await repository.delete(item.key)).toBe(false);
    expect(await repository.delete("JF-999999")).toBe(false);
    expect(await repository.delete("malformed-key")).toBe(false);
  });

  it("returns null for non-existent or malformed keys", async () => {
    expect(await repository.getByKey("JF-999999")).toBeNull();
    expect(await repository.getByKey("JF-abc")).toBeNull();
    expect(await repository.getByKey("")).toBeNull();
  });

  it("orders list by updatedAt descending", async () => {
    const item1 = await repository.create({ summary: "First" });
    await new Promise((resolve) => setTimeout(resolve, 20));
    const item2 = await repository.create({ summary: "Second" });
    await new Promise((resolve) => setTimeout(resolve, 20));
    // Update item1 so it becomes the most recently updated
    await repository.update(item1.key, { summary: "First Updated" });

    const list = await repository.list();
    expect(list.length).toBe(2);
    expect(list[0].key).toBe(item1.key);
    expect(list[1].key).toBe(item2.key);
  });

  it("applies deterministic secondary sort by id descending when updatedAt is identical", async () => {
    const fixedDate = new Date("2026-01-01T00:00:00.000Z");
    await prisma.workItem.create({
      data: {
        summary: "Item A",
        createdAt: fixedDate,
        updatedAt: fixedDate,
      },
    });
    await prisma.workItem.create({
      data: {
        summary: "Item B",
        createdAt: fixedDate,
        updatedAt: fixedDate,
      },
    });

    const list = await repository.list();
    expect(list.length).toBe(2);
    expect(list[0].summary).toBe("Item B");
    expect(list[1].summary).toBe("Item A");
  });

  it("filters list by status", async () => {
    await repository.create({ summary: "Task 1", status: "To Do" });
    await repository.create({ summary: "Task 2", status: "In Progress" });
    await repository.create({ summary: "Task 3", status: "Done" });

    const inProgress = await repository.list({ status: "In Progress" });
    expect(inProgress.length).toBe(1);
    expect(inProgress[0].summary).toBe("Task 2");

    const allWithFilter = await repository.list({ status: "All" });
    expect(allWithFilter.length).toBe(3);

    const allWithoutFilter = await repository.list();
    expect(allWithoutFilter.length).toBe(3);
  });
});
