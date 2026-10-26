import { expect, test, vi } from "vitest";
import { parseMarkdown } from "../../client/markdown_parser/parser.ts";

const text = "[title](<https://example.com/a b>)";
const editor = {
  getCurrentPage: vi.fn(async () => "folder/Page"),
  getText: vi.fn(async () => text),
  getCursor: vi.fn(async () => 2),
  openUrl: vi.fn(async () => {}),
  flashNotification: vi.fn(async () => {}),
};
vi.mock("@silverbulletmd/silverbullet/syscalls", () => ({
  editor,
  markdown: { parseMarkdown: async (t: string) => parseMarkdown(t) },
}));

const { linkNavigate } = await import("./navigate.ts");

test("Link with an angle-bracketed URL opens that URL", async () => {
  await linkNavigate();
  expect(editor.flashNotification).not.toHaveBeenCalled();
  expect(editor.openUrl).toHaveBeenCalledWith("https://example.com/a b");
});
