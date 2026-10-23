import { render, screen } from "@testing-library/react";
import { WorkItemTable } from "./WorkItemTable";
import { WorkItem } from "@/lib/workitems/types";

describe("WorkItemTable", () => {
  it("renders empty state message and a create link when items array is empty", () => {
    render(<WorkItemTable items={[]} />);

    expect(screen.getByText("No work items found.")).toBeInTheDocument();
    const createLink = screen.getByRole("link", { name: "Create Work Item" });
    expect(createLink).toHaveAttribute("href", "/workitems/new");
  });

  it("renders columns and work item rows with links to /workitems/<key>", () => {
    const mockItems: WorkItem[] = [
      {
        id: 1,
        key: "JF-1",
        summary: "First Task Summary",
        description: null,
        type: "Task",
        status: "To Do",
        priority: "Medium",
        assignee: "Alice",
        reporter: null,
        createdAt: new Date("2026-10-23T10:00:00Z"),
        updatedAt: new Date("2026-10-23T12:00:00Z"),
      },
      {
        id: 2,
        key: "JF-2",
        summary: "Second Bug Summary",
        description: null,
        type: "Bug",
        status: "In Progress",
        priority: "High",
        assignee: null,
        reporter: null,
        createdAt: new Date("2026-10-23T11:00:00Z"),
        updatedAt: new Date("2026-10-23T13:00:00Z"),
      },
    ];

    render(<WorkItemTable items={mockItems} />);

    // Columns
    expect(screen.getByText("Key")).toBeInTheDocument();
    expect(screen.getByText("Summary")).toBeInTheDocument();
    expect(screen.getByText("Type")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getByText("Priority")).toBeInTheDocument();
    expect(screen.getByText("Assignee")).toBeInTheDocument();
    expect(screen.getByText("Updated")).toBeInTheDocument();

    // Data rows
    expect(screen.getByText("First Task Summary")).toBeInTheDocument();
    expect(screen.getByText("Second Bug Summary")).toBeInTheDocument();
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Unassigned")).toBeInTheDocument();

    // Links to detail page
    const jf1Links = screen.getAllByRole("link", { name: /JF-1/ });
    expect(jf1Links[0]).toHaveAttribute("href", "/workitems/JF-1");

    const summaryLinks = screen.getAllByRole("link", {
      name: "First Task Summary",
    });
    expect(summaryLinks[0]).toHaveAttribute("href", "/workitems/JF-1");
  });
});
