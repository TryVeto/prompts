# Veto Prompts

A tiny, keyboard-first prompt library for substantial AI work.

## The set

| Key | Prompt |
| --- | --- |
| 1 | Think it through |
| 2 | Develop the idea |
| 3 | Do the work |
| 4 | Review the work |
| P | Copy me — new prompt template |

Every prompt uses the same operator-readable shape: **Objective → Key results → Milestones → Instructions → Notes**.

Each prompt uses the current conversation by default. Notes are optional: add only what changes or needs emphasis. Leaving Notes blank means continue from the existing context.

## Use it

Run python3 server.py, then open http://localhost:8926/.

Press **1–4** or **P** to copy a prompt immediately. Press **Enter** to open it. Use **Command-K / Ctrl-K** to search. In a prompt reader, press **C** or click **Copy prompt**.

The full text is in [PROMPTS.md](PROMPTS.md) and [prompts.json](prompts.json).

## Privacy

This public repository contains the active generic prompts and frontend only. It does not contain private review history, local databases, access tokens, internal project prompts, or personal working notes.

## License

MIT. See [LICENSE](LICENSE).