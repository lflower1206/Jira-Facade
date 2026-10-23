import { render, screen } from "@testing-library/react";
import EditWorkItemPage from "./page";
import { getWorkItemRepository } from "@/lib/workitems";
import { notFound } from "next/navigation";

jest.mock("next/navigation", () => ({
  notFound: jest.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
}));

jest.mock("@/lib/workitems", () => ({
  getWorkItemRepository: jest.fn(),
}));

describe("EditWorkItemPage", () => {
  const mockRepo = {
    getByKey: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (getWorkItemRepository as jest.Mock).mockReturnValue(mockRepo);
  });

  it("pre-fills values when item exists", async () => {
    mockRepo.getByKey.mockResolvedValue({
      id: 1,
      key: "JF-1",
      summary: "Sample Existing Task",
      description: "Sample Description",
      type: "Story",
      status: "In Progress",
      priority: "High",
      assignee: "Alice",
      reporter: "Bob",
      createdAt: new Date("2026-10-23T10:00:00Z"),
      updatedAt: new Date("2026-10-23T11:00:00Z"),
    });

    const pageElement = await EditWorkItemPage({
      params: Promise.resolve({ key: "JF-1" }),
    });
    render(pageElement);

    expect(mockRepo.getByKey).toHaveBeenCalledWith("JF-1");
    expect(screen.getByText("Edit JF-1")).toBeInTheDocument();
    expect(screen.getByLabelText(/Summary/i)).toHaveValue("Sample Existing Task");
    expect(screen.getByLabelText(/Description/i)).toHaveValue("Sample Description");
    expect(screen.getByLabelText(/^Type/i)).toHaveValue("Story");
    expect(screen.getByLabelText(/^Status/i)).toHaveValue("In Progress");
    expect(screen.getByLabelText(/^Priority/i)).toHaveValue("High");
    expect(screen.getByRole("button", { name: "Save Changes" })).toBeInTheDocument();
  });

  it("triggers not-found when key does not exist", async () => {
    mockRepo.getByKey.mockResolvedValue(null);

    await expect(
      EditWorkItemPage({
        params: Promise.resolve({ key: "JF-999" }),
      })
    ).rejects.toThrow("NEXT_NOT_FOUND");

    expect(notFound).toHaveBeenCalled();
  });

  it("triggers not-found when key is malformed", async () => {
    mockRepo.getByKey.mockResolvedValue(null);

    await expect(
      EditWorkItemPage({
        params: Promise.resolve({ key: "JF-abc" }),
      })
    ).rejects.toThrow("NEXT_NOT_FOUND");

    expect(notFound).toHaveBeenCalled();
  });
});
