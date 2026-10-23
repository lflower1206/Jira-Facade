import { render, screen, act } from "@testing-library/react";
import { DeleteWorkItemButton } from "./DeleteWorkItemButton";
import { deleteWorkItem } from "@/app/workitems/actions";

jest.mock("@/app/workitems/actions", () => ({
  deleteWorkItem: jest.fn(),
}));

describe("DeleteWorkItemButton", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    HTMLDialogElement.prototype.showModal = jest.fn(function (this: HTMLDialogElement) {
      this.setAttribute("open", "");
    });
    HTMLDialogElement.prototype.close = jest.fn(function (this: HTMLDialogElement) {
      this.removeAttribute("open");
    });
  });

  it("opens confirmation dialog when Delete button is clicked", () => {
    render(<DeleteWorkItemButton itemKey="JF-1" />);

    const deleteBtn = screen.getByRole("button", { name: "Delete" });
    act(() => {
      deleteBtn.click();
    });

    expect(screen.getByText(/Are you sure you want to permanently delete/i)).toBeInTheDocument();
    expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalled();
  });

  it("closes dialog and does not trigger delete when Cancel is clicked", () => {
    const mockAction = jest.fn();
    render(<DeleteWorkItemButton itemKey="JF-1" action={mockAction} />);

    // Open dialog
    act(() => {
      screen.getByRole("button", { name: "Delete" }).click();
    });

    // Click cancel
    act(() => {
      screen.getByRole("button", { name: "Cancel" }).click();
    });

    expect(HTMLDialogElement.prototype.close).toHaveBeenCalled();
    expect(mockAction).not.toHaveBeenCalled();
    expect(deleteWorkItem).not.toHaveBeenCalled();
  });

  it("triggers delete action when Confirm Delete is clicked", async () => {
    const mockAction = jest.fn().mockResolvedValue(undefined);
    render(<DeleteWorkItemButton itemKey="JF-1" action={mockAction} />);

    // Open dialog
    act(() => {
      screen.getByRole("button", { name: "Delete" }).click();
    });

    // Click confirm delete
    await act(async () => {
      screen.getByRole("button", { name: "Confirm Delete" }).click();
    });

    expect(mockAction).toHaveBeenCalledWith("JF-1");
  });

  it("uses default deleteWorkItem server action when no custom action is provided", async () => {
    render(<DeleteWorkItemButton itemKey="JF-2" />);

    act(() => {
      screen.getByRole("button", { name: "Delete" }).click();
    });

    await act(async () => {
      screen.getByRole("button", { name: "Confirm Delete" }).click();
    });

    expect(deleteWorkItem).toHaveBeenCalledWith("JF-2");
  });

  it("updates aria-expanded when dialog is opened and closed", () => {
    const { container } = render(<DeleteWorkItemButton itemKey="JF-1" />);
    const deleteBtn = screen.getByRole("button", { name: "Delete" });
    expect(deleteBtn).toHaveAttribute("aria-expanded", "false");

    act(() => {
      deleteBtn.click();
    });
    expect(deleteBtn).toHaveAttribute("aria-expanded", "true");

    const dialog = container.querySelector("dialog");
    act(() => {
      dialog?.dispatchEvent(new Event("close"));
    });
    expect(deleteBtn).toHaveAttribute("aria-expanded", "false");
  });
});
