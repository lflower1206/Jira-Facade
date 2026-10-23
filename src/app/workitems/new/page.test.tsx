import { render, screen } from "@testing-library/react";
import NewWorkItemPage from "./page";

describe("NewWorkItemPage", () => {
  it("renders create form with Create Work Item header and submit button", () => {
    render(<NewWorkItemPage />);

    expect(screen.getByRole("heading", { name: "Create Work Item" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Create Work Item" })).toBeInTheDocument();
    expect(screen.getByLabelText(/Summary/i)).toBeInTheDocument();
  });
});
