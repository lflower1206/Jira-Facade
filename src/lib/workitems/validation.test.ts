import { validateWorkItemInput } from "./validation";

describe("validateWorkItemInput", () => {
  it("applies defaults when type, status, and priority are not specified", () => {
    const formData = new FormData();
    formData.append("summary", "New feature request");

    const result = validateWorkItemInput(formData);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data).toEqual({
        summary: "New feature request",
        description: null,
        type: "Task",
        status: "To Do",
        priority: "Medium",
        assignee: null,
        reporter: null,
      });
    }
  });

  it("rejects empty or whitespace-only summary with a field error while preserving entered values", () => {
    const formData = new FormData();
    formData.append("summary", "   ");
    formData.append("description", "Some notes");
    formData.append("type", "Bug");

    const result = validateWorkItemInput(formData);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.summary).toBe("Summary is required");
      expect(result.values.description).toBe("Some notes");
      expect(result.values.type).toBe("Bug");
    }
  });

  it("rejects summary longer than 255 characters", () => {
    const longSummary = "a".repeat(256);
    const result = validateWorkItemInput({
      summary: longSummary,
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.summary).toBe("Summary must not exceed 255 characters");
    }
  });

  it("accepts summary exactly 255 characters", () => {
    const exactSummary = "a".repeat(255);
    const result = validateWorkItemInput({
      summary: exactSummary,
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.summary).toBe(exactSummary);
    }
  });

  it("rejects invalid status", () => {
    const result = validateWorkItemInput({
      summary: "Valid summary",
      status: "Closed",
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.status).toBe("Invalid work item status");
    }
  });

  it("rejects invalid type", () => {
    const result = validateWorkItemInput({
      summary: "Valid summary",
      type: "Improvement",
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.type).toBe("Invalid work item type");
    }
  });

  it("rejects invalid priority", () => {
    const result = validateWorkItemInput({
      summary: "Valid summary",
      priority: "Critical",
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.priority).toBe("Invalid work item priority");
    }
  });

  it("parses valid custom fields correctly", () => {
    const result = validateWorkItemInput({
      summary: "  Fix header alignment  ",
      description: "Header is misaligned on mobile devices.",
      type: "Bug",
      status: "In Progress",
      priority: "High",
      assignee: "Alice",
      reporter: "Bob",
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data).toEqual({
        summary: "Fix header alignment",
        description: "Header is misaligned on mobile devices.",
        type: "Bug",
        status: "In Progress",
        priority: "High",
        assignee: "Alice",
        reporter: "Bob",
      });
    }
  });
});
