import { describe, it, expect } from "@jest/globals";
import { ExitCode } from "../src/exit-codes";
import { commands } from "../src";

describe("CLI shell", () => {
  it("exposes a command registry", () => {
    expect(Array.isArray(commands)).toBe(true);
  });

  it("keeps exit code meanings stable", () => {
    // These values are a public contract; changing one is a breaking change.
    expect(ExitCode.VERIFIED).toBe(0);
    expect(ExitCode.ERROR).toBe(1);
    expect(ExitCode.INVALID).toBe(2);
    expect(ExitCode.NO_PROOF).toBe(3);
    expect(ExitCode.PENDING).toBe(4);
    expect(ExitCode.UNRESOLVABLE_IDENTITY).toBe(5);
  });

  it("does not conflate a missing proof with an invalid one", () => {
    expect(ExitCode.NO_PROOF).not.toBe(ExitCode.INVALID);
  });
});
