# gami

Standalone command-line verifier for [GAMI](https://authenticmemory.org) proofs of authenticity.

`gami` checks that a digital file is what an institution says it is: that the
bytes are unchanged, that a named institution signed for them, and that the
proof existed at the attested date. It answers those questions on your machine,
from your copy of the source, without contacting GAMI or depending on any
service GAMI operates.

> **Status: pre-release.** The verification pipeline is under construction. See
> `Roadmap` below for what works today.

## Guarantees

These hold for every release, and are the reason the tool exists:

- **No secrets.** `gami` never accepts, stores, or transmits a private key. It
  cannot sign anything. If you pass it a private key, it refuses.
- **Offline by default.** No network request is made unless you pass
  `--allow-network`. Nothing about the file you are checking leaves your
  machine — not its name, not its contents, not its hash.
- **Read-only.** Files you hand it are opened read-only and never modified.
- **No telemetry.** There is none, and there never will be. Verifying sensitive
  material must not disclose that you are verifying it.

## Why a separate tool

A web verifier already exists at [verify.authenticmemory.org](https://verify.authenticmemory.org).
This is deliberately not that, and deliberately not built from its code:

1. **It works when nothing else does.** A GAMI proof is supposed to outlive
   GAMI. A browser tool served from GAMI's domain cannot demonstrate that; a
   local binary checking a file against a block header can.
2. **It scales.** Drag-and-drop does not verify a 400,000-item collection, and
   does not run in an archive's nightly integrity audit.
3. **It is an independent implementation.** Two implementations that agree are
   evidence; one implementation is an assertion. That evidential value only
   holds because this codebase shares no verification code with the web
   platform.

## Install

Not yet published. To run from source:

```sh
pnpm install
pnpm run build
./bin/run --help
```

## Roadmap

| Phase | Scope                                                           | Status |
| ----- | --------------------------------------------------------------- | ------ |
| 00    | Project shell, CI, architecture boundaries                      | ✅     |
| 01    | `gami hash` — streaming SHA-256                                 | —      |
| 02    | GPR parsing, RFC 8785 canonicalization, `gami inspect`          | —      |
| 03    | `gami verify` — hash and Ed25519 signature, fully offline       | —      |
| 04    | Institutional identity: `did:web`, then `did:webvh` key history | —      |
| 05    | OpenTimestamps proof verification and block header sourcing     | —      |
| 06    | Batch verification for collections                              | —      |
| 07    | Reproducible builds and signed releases                         | —      |

## Architecture

```
src/
  domain/     pure functions over bytes — no fs, no network, no clock
  adapters/   I/O boundaries, each an interface plus an implementation
  commands/   yargs modules; thin by design
  output/     human and --json rendering
```

`domain/` holds the cryptographic core. It may not import from any other layer,
and it may not touch the filesystem or the network. This is enforced by
`test/architecture.test.ts`, not by convention.

## Exit codes

Scripts branch on these, so they are a public contract.

| Code | Meaning                                                           |
| ---- | ----------------------------------------------------------------- |
| 0    | Verified — every applicable check passed                          |
| 1    | Usage or internal error; not a verdict about a file               |
| 2    | Invalid — hash mismatch, bad signature, or broken timestamp proof |
| 3    | No proof supplied or found — **not** evidence of tampering        |
| 4    | Pending — anchored, not yet confirmed in a block                  |
| 5    | Identity or key history could not be validated                    |

`gami` writes results to stdout and diagnostics to stderr, so it composes with
other tools.

## Development

```sh
pnpm run verify   # lint, typecheck, and test — run this before committing
pnpm test         # tests only
pnpm run build    # bundle to dist/
```

Commits follow [Conventional Commits](https://www.conventionalcommits.org);
`pnpm run commit` walks you through one.

## License

MIT. Built on [cli-typescript-starter](https://github.com/kucherenko/cli-typescript-starter)
by Andrey Kucherenko.
