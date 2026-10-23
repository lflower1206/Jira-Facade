import { render, screen } from "@testing-library/react";
import { StatusFilter } from "./StatusFilter";

describe("StatusFilter", () => {
  it("renders all filter options with links writing ?status= including All", () => {
    render(<StatusFilter currentStatus="All" />);

    const allLink = screen.getByRole("link", { name: "All" });
    expect(allLink).toHaveAttribute("href", "/workitems?status=All");

    const todoLink = screen.getByRole("link", { name: "To Do" });
    expect(todoLink).toHaveAttribute("href", "/workitems?status=To%20Do");

    const inProgressLink = screen.getByRole("link", { name: "In Progress" });
    expect(inProgressLink).toHaveAttribute("href", "/workitems?status=In%20Progress");

    const doneLink = screen.getByRole("link", { name: "Done" });
    expect(doneLink).toHaveAttribute("href", "/workitems?status=Done");
  });

  it("marks the current active status with aria-current", () => {
    render(<StatusFilter currentStatus="In Progress" />);

    const inProgressLink = screen.getByRole("link", { name: "In Progress" });
    expect(inProgressLink).toHaveAttribute("aria-current", "page");

    const todoLink = screen.getByRole("link", { name: "To Do" });
    expect(todoLink).not.toHaveAttribute("aria-current");
  });
});
