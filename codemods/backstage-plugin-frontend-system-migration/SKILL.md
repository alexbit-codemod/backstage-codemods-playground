---
name: backstage-plugin-frontend-system-migration
description: >-
  Guides coding agents through the Backstage “new frontend system” (NFS) migration using
  the backstage-plugin-frontend-system-migration codemod: run deterministic JSSG workflow
  steps for safe refactors (imports, route refs, plugin shell, APIs, hooks), reserve the
  manual AI workflow node for contextual fixes (SubPageBlueprint, useRouteRef guards,
  external route defaults), and optionally refresh package.json/lockfiles. Use when
  migrating from @backstage/core-plugin-api, createPlugin/createRouteRef patterns, or
  when the user asks about Backstage frontend-plugin-api, NFS migration, or this package’s
  workflow.
---

# Backstage plugin → new frontend system (NFS) migration

## What this skill is for

This skill tells agents how to **run and reason about** the **`backstage-plugin-frontend-system-migration`** codemod package: a **workflow-first** migration from legacy `@backstage/core-plugin-api` usage to **`@backstage/frontend-plugin-api`** and the extension-based frontend system.

It does **not** replace reading `workflow.yaml` for exact step IDs; it gives operational rules: **deterministic scripts first**, **AI for tricky follow-ups**, **optional package manager step last**.

## When to apply this skill

Use this skill when the task involves any of:

- Migrating a Backstage **frontend plugin** to the [new frontend system](https://backstage.io/docs/frontend-system/building-plugins/migrating).
- Replacing **`@backstage/core-plugin-api`** with **`@backstage/frontend-plugin-api`** (route refs, `createPlugin` → `createFrontendPlugin`, APIs, hooks).
- Running or explaining this repo’s codemod (`workflow.yaml`, `scripts/*.ts`).
- Splitting work into **safe, mechanical changes** vs **context-dependent** changes (routing, external routes, guards).

Do **not** treat this skill as generic Backstage backend or catalog migration—it is **frontend plugin / NFS** focused.

## How to run the codemod

From the **target Backstage repo** (usually monorepo root or plugin package root, depending on how paths are configured):

**Registry / published package:**

```bash
npx codemod run backstage-plugin-frontend-system-migration --target /path/to/repo
```

**Local package (this repository’s folder):**

```bash
cd /path/to/backstage-plugin-frontend-system-migration
npx codemod workflow run -w workflow.yaml -t /path/to/backstage-repo
```

**Target directory:** If the shell’s current working directory is not the plugin (or workspace) root the user expects, set:

- `CODEMOD_TARGET` or `CODEMOD_TARGET_PATH` so `run` steps and tooling resolve the correct `package.json`.

**Optional dependency step:** For `finalize-package-dependencies`, if the repo uses **pnpm** or **yarn**, set:

- `CODEMOD_PACKAGE_MANAGER=pnpm` or `yarn` (default is `npm`).

## Workflow steps (order matters)

The workflow is defined in **`workflow.yaml`**. Agents should treat steps as follows.

### Phase 1 — Deterministic (automatic) — prefer these for “safe” changes

Run through the pipeline until **`migrate-pages-hooks`** completes. These use **JSSG** (`js-ast-grep`) scripts and are **repeatable, pattern-based** refactors:

| Node ID | Role |
|--------|------|
| `inventory` | **Metrics only** (no file edits). Emits `backstage-nfs-migration` with `step=inventory` for blast-radius / risk signals. |
| `migrate-route-refs` | Route refs and related import moves toward `@backstage/frontend-plugin-api`. |
| `migrate-plugin-shell` | `createPlugin` → `createFrontendPlugin`, plugin id field, `plugin.ts` → `plugin.tsx` when needed. |
| `migrate-apis` | `createApiFactory` / `createApiRef` style updates toward NFS APIs. |
| `migrate-pages-hooks` | Pure import rewrites for selected hooks/API refs; also records router-related signals (`step=pages-hooks`). |

**Agent guidance:** After deterministic steps, prefer **running tests and TypeScript checks** in the target repo before editing further by hand. Do not re-implement large refactors manually if the script already covers the pattern—extend the JSSG script or fix edge cases minimally.

### Phase 2 — Tricky / contextual — use the **AI** workflow node

**Node:** `ai-assisted-followups` (**manual** in the workflow).

Use this for changes that need **judgment or repo-specific UI structure**, not pure AST substitution, for example:

- **Internal `react-router` `Routes` / `Route`** that should become **SubPageBlueprint** tabs (top-level only—scope carefully).
- **`useRouteRef`** results that need **undefined guards** (especially external route refs).
- **`createExternalRouteRef`** entries missing **`defaultTarget`** where the product expects it.

The workflow embeds prompts aimed at **minimal edits** using `@backstage/frontend-plugin-api` and `@backstage/ui`.

**Agent guidance:** Apply this skill by **approving/running the manual AI step** in the Codemod workflow when appropriate, or by **mirroring the same priorities** if the user is doing the migration inside the IDE without the CLI: tackle the same bullet list in small, reviewable edits.

### Phase 3 — Optional — package.json and lockfile

**Node:** `finalize-package-dependencies` (**manual**).

Removes legacy **`@backstage/core-plugin-api`** / **`@backstage/core-compat-api`** and adds **`@backstage/frontend-plugin-api`** via the **package manager** (updates lockfile). Only run when the team is ready for dependency churn (CI, install, review).

## Safe vs tricky: decision rule

- **Safe / deterministic:** Single-file or pattern-stable rewrites covered by the JSSG scripts (imports, known call shapes, plugin shell conventions). Use the **automatic** chain first.
- **Tricky:** Cross-cutting UX/routing, optional chaining for refs, external route wiring, or “how tabs should look” — use **`ai-assisted-followups`** or hand edits with the same checklist as the AI prompt.

## Development and validation (for agents editing this package)

```bash
npm test
npx codemod workflow validate -w workflow.yaml
```

## Related files

- `workflow.yaml` — source of truth for node IDs and step types.
- `codemod.yaml` — package metadata for the Codemod registry.
- `scripts/*.ts` — JSSG transforms per phase.
