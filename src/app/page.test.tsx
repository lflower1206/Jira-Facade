import React from "react";
import { render, screen } from "@testing-library/react";
import Home from "./page";

describe("Home page", () => {
  it("renders the main dashboard heading and description", () => {
    render(<Home />);
    expect(
      screen.getByRole("heading", { level: 1, name: /jira facade dashboard/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/enterprise facade layer and custom workflow enhancements/i)
    ).toBeInTheDocument();
  });

  it("renders dashboard status cards and overview sections", () => {
    render(<Home />);
    expect(screen.getByText("Connected Backend")).toBeInTheDocument();
    expect(screen.getByText("Active Workflows")).toBeInTheDocument();
    expect(screen.getByText("EOL Migration Readiness")).toBeInTheDocument();
    expect(screen.getByText("Project Management Overview")).toBeInTheDocument();
    expect(screen.getByText("Online (Facade Mode)")).toBeInTheDocument();
  });
});
