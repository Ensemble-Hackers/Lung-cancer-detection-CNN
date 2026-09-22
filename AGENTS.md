<!-- CODEGRAPH_START -->
## CodeGraph

In repositories indexed by CodeGraph (`.codegraph/` exists at the repo root), ALWAYS run CodeGraph via shell BEFORE using grep, find, or reading entire files:

- **Explore code & symbols**: Run `codegraph explore "<symbol or question>"` in the shell to inspect symbol definitions, implementations, and call paths in one shot.
- **Context for tasks**: Run `codegraph context "<task description>"` to gather relevant symbols and relationships.

If there is no `.codegraph/` directory, skip CodeGraph entirely.
<!-- CODEGRAPH_END -->
