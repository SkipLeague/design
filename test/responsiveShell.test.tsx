import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";

import { ResponsiveShell } from "../src/ResponsiveShell";

describe("ResponsiveShell", () => {
  it("renders the top bar and main slots", () => {
    const { getByText } = render(<ResponsiveShell topBar={<div>TOPBAR</div>} main={<div>MAIN</div>} />);
    expect(getByText("TOPBAR")).toBeInTheDocument();
    expect(getByText("MAIN")).toBeInTheDocument();
  });

  it("uses the no-detail layout when no detail is provided", () => {
    const { container } = render(<ResponsiveShell topBar={<div />} main={<div />} />);
    expect(container.querySelector(".skl-shell")).toHaveClass("skl-shell--no-detail");
    expect(container.querySelector(".skl-shell__detail")).toBeNull();
  });

  it("docks the detail panel and marks it open on phone/tablet when detailOpen", () => {
    const { container } = render(
      <ResponsiveShell topBar={<div />} main={<div />} detail={<div>DETAIL</div>} detailOpen />,
    );
    expect(container.querySelector(".skl-shell")).not.toHaveClass("skl-shell--no-detail");
    expect(container.querySelector(".skl-shell__detail")).toHaveClass("is-open");
  });

  it("renders the detail closed when detailOpen is false", () => {
    const { container } = render(
      <ResponsiveShell topBar={<div />} main={<div />} detail={<div>DETAIL</div>} detailOpen={false} />,
    );
    expect(container.querySelector(".skl-shell__detail")).not.toHaveClass("is-open");
  });
});
