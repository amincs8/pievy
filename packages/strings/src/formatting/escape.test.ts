import { describe, expect, it } from "vitest";

import { escapeHTML, escapeRegExp } from "./index";

describe("@pievy/strings: escapeRegex", () => {
  it("should escape regex special characters", () => {
    expect(escapeRegExp("a.b*c?d+e{f}g|h(i)j[k]l\\m")).toBe(
      "a\\.b\\*c\\?d\\+e\\{f\\}g\\|h\\(i\\)j\\[k\\]l\\\\m",
    );
  });

  it("should keep alias behavior in sync", () => {
    expect(escapeRegExp("[value]?")).toBe(escapeRegExp("[value]?"));
  });

  it("should return an empty string for non-string values", () => {
    expect(escapeRegExp(undefined as any)).toBe("");
    expect(escapeRegExp(null as any)).toBe("");
  });
});

describe("@pievy/strings: escapeHTML", () => {
  it("should escape HTML entities using named references by default", () => {
    expect(escapeHTML('<a href="/" title="&">ok</a>')).toBe(
      "&lt;a href=&quot;/&quot; title=&quot;&amp;&quot;&gt;ok&lt;/a&gt;",
    );
  });

  it("should escape HTML entities using numeric references when requested", () => {
    expect(escapeHTML('<a href="/">ok</a>', "number")).toBe(
      "&#60;a href=&#34;/&#34;&#62;ok&#60;/a&#62;",
    );
  });

  it("should return an empty string for non-string values", () => {
    expect(escapeHTML(undefined as any)).toBe("");
    expect(escapeHTML(null as any)).toBe("");
  });
});

