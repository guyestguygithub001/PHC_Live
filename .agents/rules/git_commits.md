---
description: Rules for writing Git commit messages and pushing to GitHub to ensure a humanized, non-AI appearance.
---

# Git Commit Rules

To ensure the project appears authentically human-developed for IT due diligence, you MUST adhere to the following rules when writing Git commit messages and interacting with the repository.

## The Problem
AI-generated commit messages often look like:
`feat(ui): implement professional design system - normalized 10 modules`
`refactor: update architecture decisions document with new formatting`

Human developers (especially those working fast on a startup/project) write commits like:
`fix weird overflow on triage card`
`wip pharmacy module`
`cleanup scaffold leftovers`
`oops forgot editorconfig`
`actually fix the button alignment this time`

## Rules for Commits

1. **Abandon Conventional Commits Format:** Do NOT use the `type(scope): subject` format (e.g., `feat:`, `fix:`, `chore:`). 
2. **Use Natural, Casual Language:** Write like a tired but competent developer. Use lowercase for the start of the message.
3. **Be Brief and Opinionated:** Don't list every single file changed. Summarize the vibe of the change.
4. **Embrace Imperfection:** It's okay to occasionally use words like "wip", "stuff", "cleanup", "fix", "tweak".
5. **No AI Vocabulary:** NEVER use words like "robust", "streamline", "comprehensive", "leverage", "optimize", "normalize", or "overhaul" in a commit message.

## Examples of Good (Human) Commits:
- `drop the glassmorphism stuff, it was too heavy`
- `fix patient id generation edge cases`
- `add missing test skeletons so IT doesn't yell at us`
- `wip: dhis2 sync worker`
- `clean up vite boilerplate css`
- `bump version and add description`

## Examples of Bad (AI) Commits:
- `chore: update package.json version and description`
- `feat(ui): remove glassmorphism and normalize padding across all modules`
- `docs: comprehensively update PROJECT_CONTEXT.md to reflect new requirements`

Always apply these rules before running `git commit`.
