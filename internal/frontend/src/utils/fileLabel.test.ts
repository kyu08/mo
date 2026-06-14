import { describe, it, expect } from "vitest";
import { formatFileLabel } from "./fileLabel";

describe("formatFileLabel", () => {
  it("returns the file name alone when title is undefined", () => {
    expect(formatFileLabel("file.md", undefined)).toBe("file.md");
  });

  it("returns 'title - name' when title is defined", () => {
    expect(formatFileLabel("file.md", "File Title")).toBe("File Title - file.md");
  });
});
