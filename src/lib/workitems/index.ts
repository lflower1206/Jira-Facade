export * from "./types";
export * from "./validation";
export * from "./repository";
export * from "./prisma-repository";

import { WorkItemRepository } from "./repository";
import { PrismaWorkItemRepository } from "./prisma-repository";

let repositoryInstance: WorkItemRepository | null = null;

export function getWorkItemRepository(): WorkItemRepository {
  if (!repositoryInstance) {
    repositoryInstance = new PrismaWorkItemRepository();
  }
  return repositoryInstance;
}
