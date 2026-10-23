import { createWorkItem, updateWorkItem, deleteWorkItem } from "./actions";
import { getWorkItemRepository } from "@/lib/workitems";
import { redirect, notFound } from "next/navigation";
import { revalidatePath } from "next/cache";

jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
  notFound: jest.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
}));

jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
}));

jest.mock("@/lib/workitems", () => ({
  getWorkItemRepository: jest.fn(),
}));

describe("Work Item Server Actions", () => {
  const mockRepo = {
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    list: jest.fn(),
    getByKey: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (getWorkItemRepository as jest.Mock).mockReturnValue(mockRepo);
  });

  describe("createWorkItem", () => {
    it("redirects to detail page and revalidates /workitems on valid submission", async () => {
      mockRepo.create.mockResolvedValue({
        id: 1,
        key: "JF-1",
        summary: "New work item",
        type: "Task",
        status: "To Do",
        priority: "Medium",
        description: null,
        assignee: null,
        reporter: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const formData = new FormData();
      formData.append("summary", "New work item");

      await createWorkItem({}, formData);

      expect(mockRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          summary: "New work item",
          type: "Task",
          status: "To Do",
          priority: "Medium",
        })
      );
      expect(revalidatePath).toHaveBeenCalledWith("/workitems");
      expect(redirect).toHaveBeenCalledWith("/workitems/JF-1");
    });

    it("returns errors and preserved values on validation failure without calling repository", async () => {
      const formData = new FormData();
      formData.append("summary", "");
      formData.append("type", "Bug");

      const result = await createWorkItem({}, formData);

      expect(mockRepo.create).not.toHaveBeenCalled();
      expect(revalidatePath).not.toHaveBeenCalled();
      expect(redirect).not.toHaveBeenCalled();
      expect(result.errors?.summary).toBe("Summary is required");
      expect(result.values?.type).toBe("Bug");
    });

    it("returns error message and preserves values when repository throws unexpected error", async () => {
      mockRepo.create.mockRejectedValue(new Error("Database connection failed"));

      const formData = new FormData();
      formData.append("summary", "New work item");

      const result = await createWorkItem({}, formData);

      expect(result.message).toMatch(/unexpected error occurred/i);
      expect(result.values?.summary).toBe("New work item");
      expect(redirect).not.toHaveBeenCalled();
    });
  });

  describe("updateWorkItem", () => {
    it("updates work item and redirects on valid submission", async () => {
      mockRepo.update.mockResolvedValue({
        id: 1,
        key: "JF-1",
        summary: "Updated summary",
        type: "Bug",
        status: "In Progress",
        priority: "High",
        description: "Updated desc",
        assignee: null,
        reporter: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const formData = new FormData();
      formData.append("summary", "Updated summary");
      formData.append("type", "Bug");
      formData.append("status", "In Progress");
      formData.append("priority", "High");

      await updateWorkItem("JF-1", {}, formData);

      expect(mockRepo.update).toHaveBeenCalledWith(
        "JF-1",
        expect.objectContaining({
          summary: "Updated summary",
          type: "Bug",
          status: "In Progress",
          priority: "High",
        })
      );
      expect(revalidatePath).toHaveBeenCalledWith("/workitems");
      expect(revalidatePath).toHaveBeenCalledWith("/workitems/JF-1");
      expect(redirect).toHaveBeenCalledWith("/workitems/JF-1");
    });

    it("returns errors without updating when validation fails", async () => {
      const formData = new FormData();
      formData.append("summary", "   ");

      const result = await updateWorkItem("JF-1", {}, formData);

      expect(mockRepo.update).not.toHaveBeenCalled();
      expect(result.errors?.summary).toBe("Summary is required");
    });

    it("calls notFound when repository returns null", async () => {
      mockRepo.update.mockResolvedValue(null);

      const formData = new FormData();
      formData.append("summary", "Valid summary");

      await expect(updateWorkItem("JF-999", {}, formData)).rejects.toThrow("NEXT_NOT_FOUND");

      expect(notFound).toHaveBeenCalled();
      expect(redirect).not.toHaveBeenCalled();
    });

    it("returns error message and preserves values when repository throws unexpected error", async () => {
      mockRepo.update.mockRejectedValue(new Error("Disk error"));

      const formData = new FormData();
      formData.append("summary", "Updated summary");

      const result = await updateWorkItem("JF-1", {}, formData);

      expect(result.message).toMatch(/unexpected error occurred/i);
      expect(result.values?.summary).toBe("Updated summary");
      expect(redirect).not.toHaveBeenCalled();
    });
  });

  describe("deleteWorkItem", () => {
    it("deletes work item, revalidates and redirects to /workitems", async () => {
      mockRepo.delete.mockResolvedValue(true);

      await deleteWorkItem("JF-1");

      expect(mockRepo.delete).toHaveBeenCalledWith("JF-1");
      expect(revalidatePath).toHaveBeenCalledWith("/workitems");
      expect(redirect).toHaveBeenCalledWith("/workitems");
    });

    it("supports FormData input with key", async () => {
      mockRepo.delete.mockResolvedValue(true);

      const formData = new FormData();
      formData.append("key", "JF-2");

      await deleteWorkItem(formData);

      expect(mockRepo.delete).toHaveBeenCalledWith("JF-2");
      expect(redirect).toHaveBeenCalledWith("/workitems");
    });

    it("calls notFound when deletion fails or item does not exist", async () => {
      mockRepo.delete.mockResolvedValue(false);

      await expect(deleteWorkItem("JF-999")).rejects.toThrow("NEXT_NOT_FOUND");

      expect(mockRepo.delete).toHaveBeenCalledWith("JF-999");
      expect(notFound).toHaveBeenCalled();
      expect(redirect).not.toHaveBeenCalled();
    });
  });
});
