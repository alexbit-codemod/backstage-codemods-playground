# backstage-plugin-frontend-system-migration

Multi-step Codemod workflow for a **full** [Backstage new frontend system](https://backstage.io/docs/frontend-system/building-plugins/migrating) migration (drops legacy `@backstage/core-plugin-api` usage).

## Workflow

Everything lives in **[workflow.yaml](workflow.yaml)**. The workflow has **one automatic node** (`deterministic-nfs-migration`) so Codemod Cloud runs a **single task** (sequential steps, one git checkout—avoids parallel `.git/index.lock` conflicts).

| Step group | Purpose |
|------------|---------|
| **Deterministic JSSG** (always) | inventory metrics → route refs → plugin shell → APIs → pages/hooks (`inventory.ts` → … → `pages-hooks.ts`). |
| **Optional** (last two steps) | **AI** and/or **package.json + lockfile** updates, gated by [parameters](#parameters) (both **off by default**). |

## Parameters

Defaults are **false** for both:

| Parameter | When `true` |
|-----------|-------------|
| `run_ai_followups` | Runs the AI step (SubPageBlueprint, `useRouteRef` guards, external route defaults). |
| `update_package_dependencies` | Removes legacy `@backstage/core-*` deps and adds `@backstage/frontend-plugin-api` (uses npm by default; see env below). |

## Usage

```bash
# Default: deterministic migration only (no AI, no package.json changes)
npx codemod run backstage-plugin-frontend-system-migration --target /path/to/repo

# Local
npx codemod workflow run -w workflow.yaml -t /path/to/backstage-repo

# Enable optional steps (repeat --param for each)
npx codemod workflow run -w workflow.yaml -t /path/to/repo \
  --param run_ai_followups=true \
  --param update_package_dependencies=true
```

**Target directory:** set `CODEMOD_TARGET` or `CODEMOD_TARGET_PATH` when the shell working directory is not the plugin package root (used by the optional package step).

**Package manager** for `update_package_dependencies`: set `CODEMOD_PACKAGE_MANAGER` to `pnpm` or `yarn` if the repo does not use npm.

## Scripts

- `scripts/inventory.ts` — metrics: `backstage-nfs-migration` with `step=inventory` (patterns and risk: safe / medium / tricky)
- `scripts/route-refs.ts` — route refs (uses `@jssg/utils` for imports)
- `scripts/plugin-shell.ts` — plugin shell + optional `plugin.ts` → `plugin.tsx`
- `scripts/apis.ts` — API factories and refs
- `scripts/pages-hooks.ts` — pure imports + same metric with `step=pages-hooks` for internal `<Routes>` usage

## Agent skill (Cursor / coding agents)

See **[SKILL.md](SKILL.md)** for when to use this migration, how to run the workflow, and how optional AI and package steps fit after the deterministic JSSG steps (same node).

## Development

```bash
npm test
npx codemod workflow validate -w workflow.yaml
```

## License

MIT
