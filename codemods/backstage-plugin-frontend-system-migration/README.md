# backstage-plugin-frontend-system-migration

Multi-step Codemod workflow for a **full** [Backstage new frontend system](https://backstage.io/docs/frontend-system/building-plugins/migrating) migration (drops legacy `@backstage/core-plugin-api` usage).

## Workflow

Everything lives in **[workflow.yaml](workflow.yaml)**:

| Node | Depends on | Purpose |
|------|------------|---------|
| `inventory` | — | Blast-radius metrics (`backstage-nfs-migration`, `step=inventory`) |
| `migrate-route-refs` | `inventory` | Route refs → `@backstage/frontend-plugin-api` |
| `migrate-plugin-shell` | `migrate-route-refs` | `createPlugin` → `createFrontendPlugin`, etc. |
| `migrate-apis` | `migrate-plugin-shell` | `ApiBlueprint`, `createApiRef().with()` |
| `migrate-pages-hooks` | `migrate-apis` | Pure hook/API import rewrites + router signal (`backstage-nfs-migration`, `step=pages-hooks`) |
| `ai-assisted-followups` | `migrate-pages-hooks` | **Manual** AI step for tricky follow-ups |
| `finalize-package-dependencies` | `migrate-pages-hooks` | **Manual** — remove legacy `@backstage/core-*` deps, add `@backstage/frontend-plugin-api`, refresh lockfile (default: `npm`) |

The main migration path is linear through `migrate-pages-hooks`, then optional manual nodes (`ai-assisted-followups`, `finalize-package-dependencies`).

## Usage

```bash
npx codemod run backstage-plugin-frontend-system-migration --target /path/to/repo

# Local
npx codemod workflow run -w workflow.yaml -t /path/to/backstage-repo
```

**Target directory:** set `CODEMOD_TARGET` or `CODEMOD_TARGET_PATH` when the shell working directory is not the plugin package root (used by the optional `finalize-package-dependencies` step).

**Package manager** for `finalize-package-dependencies` (default `npm`): set `CODEMOD_PACKAGE_MANAGER` to `pnpm` or `yarn` if the repo does not use npm.

## Scripts

- `scripts/inventory.ts` — metrics: `backstage-nfs-migration` with `step=inventory` (patterns and risk: safe / medium / tricky)
- `scripts/route-refs.ts` — route refs (uses `@jssg/utils` for imports)
- `scripts/plugin-shell.ts` — plugin shell + optional `plugin.ts` → `plugin.tsx`
- `scripts/apis.ts` — API factories and refs
- `scripts/pages-hooks.ts` — pure imports + same metric with `step=pages-hooks` for internal `<Routes>` usage

## Agent skill (Cursor / coding agents)

See **[SKILL.md](SKILL.md)** for when to use this migration, how to run the workflow, and how to split deterministic JSSG steps from the manual AI follow-up.

## Development

```bash
npm test
npx codemod workflow validate -w workflow.yaml
```

## License

MIT
