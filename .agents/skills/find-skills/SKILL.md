---
name: find-skills
description: Helps users discover and install agent skills when they ask questions like "how do I do X", "find a skill for X", "is there a skill that can...", or express interest in extending capabilities. This skill should be used when the user is looking for functionality that might exist as an installable skill.
---

# Find Skills

Use this skill when a user asks for specialized functionality that may already exist as an installable skill.

## Skills CLI

The Skills CLI (`bun run skills:add`, or `npx skills`) manages the open agent skills ecosystem.

Useful commands:

- `bun run skills:list` — list project skills
- `bun run skills:add <source> --agent claude-code --agent codex` — install a skill for both supported agents
- `bun run skills:update` — update installed skills
- `bunx skills find <query>` — search skills.sh

Browse the ecosystem at https://skills.sh/.

## Discovery workflow

When a user asks whether a skill exists:

1. Identify the domain and concrete task.
2. Search skills.sh with specific terms.
3. Check the source, install count, and maintainer reputation.
4. Present the skill name, purpose, source, and install command.
5. Ask before installing unless installation was explicitly requested.

Prefer official or well-maintained sources and do not recommend a skill based only on its search ranking.
