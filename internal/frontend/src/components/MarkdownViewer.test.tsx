import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MarkdownViewer } from "./MarkdownViewer";

vi.mock("mermaid", () => ({
  default: {
    initialize: vi.fn(),
    render: vi.fn(),
  },
}));

vi.mock("../hooks/useApi", () => ({
  fetchFileContent: vi.fn().mockResolvedValue({ content: "# Hello", baseDir: "/repo" }),
  openRelativeFile: vi.fn(),
}));

function renderViewer(props: Partial<Parameters<typeof MarkdownViewer>[0]> = {}) {
  return render(
    <MarkdownViewer
      fileId="aaa11111"
      fileName="README.md"
      activeGroup="default"
      revision={0}
      onFileOpened={() => {}}
      onHeadingsChange={() => {}}
      isTocOpen={false}
      onTocToggle={() => {}}
      onRemoveFile={() => {}}
      isWide={false}
      fontSize="medium"
      {...props}
    />,
  );
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("MarkdownViewer file title bar", () => {
  it("shows 'Title - filename' above the content, outside the markdown body", async () => {
    renderViewer({
      title: "Project Readme",
      filePath: "/home/me/code/mo/docs/README.md",
    });

    const titleBar = await screen.findByText("Project Readme - README.md");
    // Hover shows the absolute file path.
    expect(titleBar).toHaveAttribute("title", "/home/me/code/mo/docs/README.md");
    // The title bar must not be part of the rendered markdown content.
    expect(titleBar.closest(".markdown-body")).toBeNull();
  });

  it("falls back to the file name when the file has no title", async () => {
    renderViewer({ filePath: "/home/me/code/mo/docs/README.md" });

    const titleBar = await screen.findByText("README.md");
    expect(titleBar).toHaveAttribute("title", "/home/me/code/mo/docs/README.md");
  });

  it("uses the file name as the tooltip for uploaded files", async () => {
    renderViewer({ title: "Pasted", uploaded: true });

    const titleBar = await screen.findByText("Pasted - README.md");
    expect(titleBar).toHaveAttribute("title", "README.md");
  });
});
