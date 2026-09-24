# Veto Prompts

A small, keyboard-first prompt library for substantial AI work.

![Veto Prompts launcher](assets/launcher.png)

## What this is

Veto Prompts is the prompt set and local frontend we use to define, develop, make, review, and improve substantial work. Every prompt uses the same operator-readable shape: **Objective → Key results → Milestones → Instructions → Notes**.

The public repository contains the prompt text and the frontend. It intentionally does **not** contain private review history, local databases, access tokens, internal files, project-specific prompts, or personal working notes.

## Use it

Run `python3 server.py`, then open `http://localhost:8926/`. Press a prompt key to copy it, press Enter to open it, or use ⌘K / Ctrl-K to search. In a prompt reader, press C or click **Copy prompt**.

Each prompt has one canonical version. There are no hidden effort variants.

## Main prompts

| Key | Prompt |
| --- | --- |
| 1 | Define the project |
| 2 | Find the reference |
| 3 | Explore and validate |
| 4 | Develop the idea |
| 5 | Make the work |
| 6 | Polish the work |
| 7 | Review the work |
| 8 | Apply feedback |
| 9 | Finish and deliver |
| 0 | Learn from the work |

## More prompts

| Key | Prompt |
| --- | --- |
| R | Resume work |
| C | Add context |
| X | Correct course |
| Q | Research a question |
| H | Think it through |
| S | Improve a skill |
| B | Write a feature spec |
| J | Ready to ship? |
| N | Iterate with the reference |
| V | Revise from a review |
| T | Aim for floor 10 |
| P | Copy me — New prompt |

The full text is in [PROMPTS.md](PROMPTS.md) and [prompts.json](prompts.json).

## New prompt template

Press **P** for **Copy me — New prompt**. It is the template for adding future prompts using the same five-section format.

## Frontend

The UI is plain HTML, CSS, and JavaScript. There is no build step and no framework dependency. `server.py` is only a tiny local static server with SPA fallback for `/prompt/<id>` routes.

![Full-page prompt reader](assets/reader.png)

## License

MIT. See [LICENSE](LICENSE).