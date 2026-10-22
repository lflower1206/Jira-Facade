import React from "react";
import { render, screen } from "@testing-library/react";
import Header from "./Header";

describe("Header component", () => {
  it("renders default title and subtitle", () => {
    render(<Header />);
    expect(screen.getByText("Jira Facade")).toBeInTheDocument();
    expect(screen.getByText("Enterprise Workflows")).toBeInTheDocument();
  });

  it("renders custom title and subtitle when provided", () => {
    render(<Header title="Custom Portal" subtitle="Project Migration" />);
    expect(screen.getByText("Custom Portal")).toBeInTheDocument();
    expect(screen.getByText("Project Migration")).toBeInTheDocument();
  });

  it("renders navigation links", () => {
    render(<Header />);
    expect(screen.getByRole("link", { name: /dashboard/i })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: /health api/i })).toHaveAttribute(
      "href",
      "/api/health"
    );
  });
});
