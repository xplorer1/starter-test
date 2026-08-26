import { describe, it, expect } from "@jest/globals";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const SRC = join(__dirname, "..", "src");

function sourceFilesIn(dir: string): string[] {
  let out: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      out = out.concat(sourceFilesIn(full));
    } else if (entry.endsWith(".ts")) {
      out.push(full);
    }
  }
  return out;
}

function importsOf(file: string): string[] {
  const text = readFileSync(file, "utf8");
  const specifiers: string[] = [];
  const pattern = /(?:from\s+|require\()\s*["']([^"']+)["']/g;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(text)) !== null) {
    const specifier = match[1];
    if (specifier !== undefined) specifiers.push(specifier);
  }
  return specifiers;
}

/**
 * The domain layer is the cryptographic core: pure functions over bytes, with
 * no clock, no filesystem, and no network. Keeping it that way is what makes
 * it testable without mocks — and what lets a reader audit it in isolation.
 *
 * These tests fail loudly the first time someone reaches for a shortcut.
 */
describe("architecture: domain/ stays pure", () => {
  const domainDir = join(SRC, "domain");
  const files = sourceFilesIn(domainDir);

  it("has no imports from adapters/, commands/, or output/", () => {
    const violations: string[] = [];
    for (const file of files) {
      for (const specifier of importsOf(file)) {
        if (/(^|\/)(adapters|commands|output)(\/|$)/.test(specifier)) {
          violations.push(`${relative(SRC, file)} imports "${specifier}"`);
        }
      }
    }
    expect(violations).toEqual([]);
  });

  it("does not touch the filesystem, network, or process directly", () => {
    const forbidden = new Set([
      "node:fs",
      "fs",
      "node:http",
      "node:https",
      "http",
      "https",
      "node:child_process",
      "child_process",
      "node:process",
      "undici",
      "axios",
    ]);
    const violations: string[] = [];
    for (const file of files) {
      for (const specifier of importsOf(file)) {
        if (forbidden.has(specifier)) {
          violations.push(`${relative(SRC, file)} imports "${specifier}"`);
        }
      }
    }
    expect(violations).toEqual([]);
  });
});
