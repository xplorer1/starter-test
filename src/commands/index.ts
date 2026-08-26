/**
 * Command registry.
 *
 * Commands are yargs modules. They stay thin: parse arguments, call into
 * `domain/` (pure) or `adapters/` (I/O), render the result, set an exit code.
 * Verification logic never lives here.
 */
export const commands: readonly object[] = [];
