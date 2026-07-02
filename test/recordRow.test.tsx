import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";

import { RecordRow, recordRowActions } from "../src/RecordRow";
import { ListActionBar } from "../src/ListActionBar";
import { StatBandHero } from "../src/StatBandHero";

describe("RecordRow", () => {
  it("renders title, subline and the trailing stat", () => {
    render(
      <RecordRow leading={{ kind: "emoji", emoji: "🇫🇷" }} title="France" subline="2005, 2013" stat={{ value: 3, label: "visits" }} />,
    );
    expect(screen.getByText("France")).toBeInTheDocument();
    expect(screen.getByText("2005, 2013")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("visits")).toBeInTheDocument();
  });

  it("fires onOpen when the row is clicked (no inline action buttons at rest)", () => {
    const onOpen = vi.fn();
    render(<RecordRow leading={{ kind: "emoji", emoji: "🇮🇹" }} title="Italy" onOpen={onOpen} />);
    fireEvent.click(screen.getByRole("button", { name: /italy/i }));
    expect(onOpen).toHaveBeenCalledOnce();
  });

  it("exposes edit/duplicate/delete via the overflow menu, not inline", () => {
    const onEdit = vi.fn();
    const onDelete = vi.fn();
    render(
      <RecordRow
        leading={{ kind: "emoji", emoji: "🇯🇵" }}
        title="Japan"
        actions={recordRowActions({ onEdit, onDelete })}
      />,
    );
    // No menu until the ⋯ is opened.
    expect(screen.queryByRole("menu")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Record actions" }));
    const menu = screen.getByRole("menu");
    fireEvent.click(within(menu).getByRole("menuitem", { name: /edit/i }));
    expect(onEdit).toHaveBeenCalledOnce();
    expect(onDelete).not.toHaveBeenCalled();
  });

  it("renders an image tile when a photo is supplied", () => {
    render(<RecordRow leading={{ kind: "image", src: "/x.jpg", alt: "art" }} title="Piece" />);
    expect(screen.getByAltText("art")).toBeInTheDocument();
  });
});

describe("ListActionBar", () => {
  it("pluralizes the count and fires Sort/Add", () => {
    const onSort = vi.fn();
    const onAdd = vi.fn();
    const { rerender } = render(<ListActionBar count={1} onSort={onSort} onAdd={onAdd} />);
    expect(screen.getByText("1 record")).toBeInTheDocument();
    rerender(<ListActionBar count={18} onSort={onSort} onAdd={onAdd} />);
    expect(screen.getByText("18 records")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /sort/i }));
    fireEvent.click(screen.getByRole("button", { name: /add/i }));
    expect(onSort).toHaveBeenCalledOnce();
    expect(onAdd).toHaveBeenCalledOnce();
  });
});

describe("StatBandHero", () => {
  it("renders each stat cell", () => {
    render(
      <StatBandHero
        stats={[
          { value: 6, label: "trips" },
          { value: 47, label: "nights" },
        ]}
      />,
    );
    expect(screen.getByText("47")).toBeInTheDocument();
    expect(screen.getByText("nights")).toBeInTheDocument();
  });
});
