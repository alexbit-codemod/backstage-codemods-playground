# Backstage codemods

Codemods to help you adopt new Backstage features and handle breaking changes with less manual work, such as the [new frontend system](https://backstage.io/docs/frontend-system/building-plugins/migrating) and related APIs.

Community contributions are welcome. Check [open issues](https://github.com/alexbit-codemod/backstage-codemods/issues) for codemods to build, or open a new one if something is missing. For workflow details and development notes, see each codemod’s README under `codemods/`.


## Running codemods

> **Caution:** Codemods modify code. Run them only on Git-tracked files, and commit or stash your work first.

### From the registry

Recommended for the smoothest experience: the CLI downloads the package from the [Codemod Registry](https://docs.codemod.com/registry).

```bash
yarn dlx codemod@latest backstage-plugin-frontend-system-migration -t /path/to/your/target/repo
```

### From source

Use this when developing the codemods in this repo or running a specific checkout:

```bash
yarn dlx codemod@latest workflow run \
  -w /path/to/backstage-codemods/codemods/backstage-plugin-frontend-system-migration/workflow.yaml \
  -t /path/to/your/backstage-repo
```

By default, codemods run in the current directory. Add `-t` / `--target` with a path to run elsewhere.

For CLI commands, flags, and publishing workflows, see the [Codemod CLI documentation](https://docs.codemod.com/cli).

## License

MIT
