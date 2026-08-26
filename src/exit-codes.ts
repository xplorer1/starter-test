/**
 * Process exit codes.
 *
 * These are a public contract. Scripts and CI pipelines branch on them, so a
 * value's meaning must never change without a major version bump.
 *
 * The distinction that matters most: NO_PROOF is not INVALID. A file with no
 * proof is simply unknown to us; it is not evidence that anything was tampered
 * with, and conflating the two would misrepresent an archive's holdings.
 */
export const ExitCode = {
  /** Every applicable check passed. */
  VERIFIED: 0,
  /** Bad usage, or an internal failure. Not a verdict about any file. */
  ERROR: 1,
  /** A check failed: hash mismatch, bad signature, or a broken timestamp proof. */
  INVALID: 2,
  /** No proof was supplied or found alongside the file. */
  NO_PROOF: 3,
  /** Anchored but not yet confirmed in a block. */
  PENDING: 4,
  /** The signing identity or its key history could not be validated. */
  UNRESOLVABLE_IDENTITY: 5,
} as const;

export type ExitCode = (typeof ExitCode)[keyof typeof ExitCode];
