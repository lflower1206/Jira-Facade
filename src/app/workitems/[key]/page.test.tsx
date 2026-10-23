import { render, screen } from "@testing-library/react";
import WorkItemDetailPage from "./page";
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

describe("WorkItemDetailPage", () => {
  const mockRepo = {
    getByKey: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (getWorkItemRepository as jest.Mock).mockReturnValue(mockRepo);
  });

  it("renders all fields, edit link, and delete button when item exists", async () => {
    mockRepo.getByKey.mockResolvedValue({
      id: 1,
      key: "JF-1",
      summary: "Critical Bug in Payment Flow",
      description: "Users are unable to checkout with credit card.",
      type: "Bug",
      status: "In Progress",
      priority: "Highest",
      assignee: "Alice Smith",
      reporter: "Bob Builder",
      createdAt: new Date("2026-10-23T10:00:00Z"),
      updatedAt: new Date("2026-10-23T12:00:00Z"),
    });

    const pageElement = await WorkItemDetailPage({
      params: Promise.resolve({ key: "JF-1" }),
    });
    render(pageElement);

    expect(mockRepo.getByKey).toHaveBeenCalledWith("JF-1");

    // Header & summary
    expect(screen.getByText("JF-1")).toBeInTheDocument();
    expect(screen.getByText("Critical Bug in Payment Flow")).toBeInTheDocument();

    // Details
    expect(screen.getByText("Bug")).toBeInTheDocument();
    expect(screen.getByText("In Progress")).toBeInTheDocument();
    expect(screen.getByText("Highest")).toBeInTheDocument();
    expect(screen.getByText("Alice Smith")).toBeInTheDocument();
    expect(screen.getByText("Bob Builder")).toBeInTheDocument();
    expect(screen.getByText("Users are unable to checkout with credit card.")).toBeInTheDocument();

    // Actions
    const editLink = screen.getByRole("link", { name: "Edit" });
    expect(editLink).toHaveAttribute("href", "/workitems/JF-1/edit");

    const deleteBtn = screen.getByRole("button", { name: "Delete" });
    expect(deleteBtn).toBeInTheDocument();

    const backLink = screen.getByRole("link", { name: /Back to Work Items/i });
    expect(backLink).toHaveAttribute("href", "/workitems");
  });

  it("renders fallback message when description, assignee, and reporter are null", async () => {
    mockRepo.getByKey.mockResolvedValue({
      id: 2,
      key: "JF-2",
      summary: "Minimal Task",
      description: null,
      type: "Task",
      status: "To Do",
      priority: "Medium",
      assignee: null,
      reporter: null,
      createdAt: new Date("2026-10-23T10:00:00Z"),
      updatedAt: new Date("2026-10-23T10:00:00Z"),
    });

    const pageElement = await WorkItemDetailPage({
      params: Promise.resolve({ key: "JF-2" }),
    });
    render(pageElement);

    expect(screen.getByText("Unassigned")).toBeInTheDocument();
    expect(screen.getByText("None")).toBeInTheDocument();
    expect(screen.getByText("No description provided.")).toBeInTheDocument();
  });

  it("calls notFound when work item is missing", async () => {
    mockRepo.getByKey.mockResolvedValue(null);

    await expect(
      WorkItemDetailPage({
        params: Promise.resolve({ key: "JF-999" }),
      })
    ).rejects.toThrow("NEXT_NOT_FOUND");

    expect(notFound).toHaveBeenCalled();
  });
});
