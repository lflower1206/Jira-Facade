import { render, screen } from "@testing-library/react";
import WorkItemsPage from "./page";
import { getWorkItemRepository } from "@/lib/workitems";

jest.mock("@/lib/workitems", () => ({
  getWorkItemRepository: jest.fn(),
  WORK_ITEM_STATUSES: ["To Do", "In Progress", "Done"],
}));

describe("WorkItemsPage", () => {
  const mockRepo = {
    list: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (getWorkItemRepository as jest.Mock).mockReturnValue(mockRepo);
  });

  it("renders the list of work items when no filter is provided", async () => {
    mockRepo.list.mockResolvedValue([
      {
        id: 1,
        key: "JF-1",
        summary: "Fix bug in login",
        description: null,
        type: "Bug",
        status: "To Do",
        priority: "High",
        assignee: null,
        reporter: null,
        createdAt: new Date("2026-10-23T10:00:00Z"),
        updatedAt: new Date("2026-10-23T10:00:00Z"),
      },
    ]);

    const pageElement = await WorkItemsPage({});
    render(pageElement);

    expect(mockRepo.list).toHaveBeenCalledWith(undefined);
    expect(screen.getByText("Fix bug in login")).toBeInTheDocument();
    expect(screen.getByText("JF-1")).toBeInTheDocument();
  });

  it("passes status filter to repository when valid status is in searchParams", async () => {
    mockRepo.list.mockResolvedValue([
      {
        id: 2,
        key: "JF-2",
        summary: "In progress item",
        description: null,
        type: "Task",
        status: "In Progress",
        priority: "Medium",
        assignee: null,
        reporter: null,
        createdAt: new Date("2026-10-23T10:00:00Z"),
        updatedAt: new Date("2026-10-23T10:00:00Z"),
      },
    ]);

    const pageElement = await WorkItemsPage({
      searchParams: Promise.resolve({ status: "In Progress" }),
    });
    render(pageElement);

    expect(mockRepo.list).toHaveBeenCalledWith({ status: "In Progress" });
    expect(screen.getByText("In progress item")).toBeInTheDocument();
  });

  it("ignores invalid status in searchParams and treats as All", async () => {
    mockRepo.list.mockResolvedValue([]);

    const pageElement = await WorkItemsPage({
      searchParams: Promise.resolve({ status: "InvalidStatusValue" }),
    });
    render(pageElement);

    expect(mockRepo.list).toHaveBeenCalledWith(undefined);
  });
});
