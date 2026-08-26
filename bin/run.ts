import yargs, { CommandModule } from "yargs";
import { hideBin } from "yargs/helpers";
import { commands } from "../src";
import { ExitCode } from "../src/exit-codes";
import { logger } from "../src/logger";

/**
 * Entry point.
 *
 * `gami` reads files and reports on them. It holds no secrets, writes to
 * nothing it is given, and makes no network request unless explicitly asked
 * to. Configuration comes from flags alone — deliberately not from a `.env`
 * file, which would let the working directory influence a verification.
 */
const cli = yargs(hideBin(process.argv))
  .scriptName("gami")
  .usage(
    "$0 <command> [options]\n\n" +
      "Verify GAMI proofs of authenticity. Offline by default; no data leaves\n" +
      "your machine unless you pass --allow-network.",
  )
  .strict()
  .demandCommand(1, "Specify a command. Run `gami --help` to see what is available.")
  .help()
  .version()
  .exitProcess(false);

for (const command of commands) {
  cli.command(command as CommandModule);
}

async function main(): Promise<number> {
  await cli.parse();
  return ExitCode.VERIFIED;
}

main()
  .then((code) => {
    process.exitCode = code;
  })
  .catch((error: unknown) => {
    // yargs has already printed usage errors; anything reaching here is ours.
    if (error instanceof Error && error.message) {
      logger.error(error.message);
    }
    process.exitCode = ExitCode.ERROR;
  });
