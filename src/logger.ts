import { createConsola } from "consola";

/**
 * Diagnostics logger.
 *
 * Everything this logger emits goes to stderr, so that stdout carries only
 * verification output. That separation is what lets `gami` be piped and
 * scripted: `gami hash file.tif | ...` must never receive a progress bar.
 */
export const logger = createConsola({
  stdout: process.stderr,
  stderr: process.stderr,
});
