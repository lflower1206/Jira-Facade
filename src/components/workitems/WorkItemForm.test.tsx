import { render, screen, act } from "@testing-library/react";
import { WorkItemForm } from "./WorkItemForm";
import {
  WORK_ITEM_PRIORITIES,
  WORK_ITEM_STATUSES,
  WORK_ITEM_TYPES,
  WorkItem,
} from "@/lib/workitems/types";

describe("WorkItemForm", () => {
  const dummyAction = jest.fn().mockResolvedValue({});

  it("renders enum options for Type, Status, and Priority", () => {
    render(<WorkItemForm action={dummyAction} />);

    // Check Type options
    const typeSelect = screen.getByLabelText(/^Type/i);
    WORK_ITEM_TYPES.forEach((type) => {
      expect(typeSelect.querySelector(`option[value="${type}"]`)).toBeInTheDocument();
    });

    // Check Status options
    const statusSelect = screen.getByLabelText(/^Status/i);
    WORK_ITEM_STATUSES.forEach((status) => {
      expect(statusSelect.querySelector(`option[value="${status}"]`)).toBeInTheDocument();
    });

    // Check Priority options
    const prioritySelect = screen.getByLabelText(/^Priority/i);
    WORK_ITEM_PRIORITIES.forEach((priority) => {
      expect(prioritySelect.querySelector(`option[value="${priority}"]`)).toBeInTheDocument();
    });
  });

  it("pre-fills form fields when initialValues are provided", () => {
    const initialValues: Partial<WorkItem> = {
      summary: "Existing Work Item Summary",
      description: "Existing detailed notes",
      type: "Bug",
      status: "In Progress",
      priority: "Highest",
      assignee: "Alice Smith",
      reporter: "Bob Jones",
    };

    render(
      <WorkItemForm
        action={dummyAction}
        initialValues={initialValues}
        submitLabel="Update Item"
        cancelHref="/workitems/JF-1"
      />
    );

    expect(screen.getByLabelText(/Summary/i)).toHaveValue("Existing Work Item Summary");
    expect(screen.getByLabelText(/Description/i)).toHaveValue("Existing detailed notes");
    expect(screen.getByLabelText(/^Type/i)).toHaveValue("Bug");
    expect(screen.getByLabelText(/^Status/i)).toHaveValue("In Progress");
    expect(screen.getByLabelText(/^Priority/i)).toHaveValue("Highest");
    expect(screen.getByLabelText(/Assignee/i)).toHaveValue("Alice Smith");
    expect(screen.getByLabelText(/Reporter/i)).toHaveValue("Bob Jones");

    const submitBtn = screen.getByRole("button", { name: "Update Item" });
    expect(submitBtn).toBeInTheDocument();

    const cancelLink = screen.getByRole("link", { name: "Cancel" });
    expect(cancelLink).toHaveAttribute("href", "/workitems/JF-1");
  });

  it("displays field errors and preserved values when action returns errors", async () => {
    const errorAction = jest.fn().mockResolvedValue({
      errors: {
        summary: "Summary is required",
        type: "Invalid work item type",
      },
      values: {
        description: "Preserved description text",
      },
    });

    const { getByRole, findByText, getByLabelText } = render(<WorkItemForm action={errorAction} />);

    const submitBtn = getByRole("button", { name: "Save" });
    await act(async () => {
      submitBtn.click();
    });

    expect(await findByText("Summary is required")).toBeInTheDocument();
    expect(await findByText("Invalid work item type")).toBeInTheDocument();
    expect(getByLabelText(/Description/i)).toHaveValue("Preserved description text");

    const summaryInput = getByLabelText(/Summary/i);
    expect(summaryInput).toHaveAttribute("aria-invalid", "true");
    expect(summaryInput).toHaveAttribute("aria-describedby", "summary-error");

    const typeSelect = getByLabelText(/^Type/i);
    expect(typeSelect).toHaveAttribute("aria-invalid", "true");
    expect(typeSelect).toHaveAttribute("aria-describedby", "type-error");
  });
});
