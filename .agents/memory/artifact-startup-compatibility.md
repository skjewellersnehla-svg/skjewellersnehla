---
name: Artifact startup compatibility
description: Environment-specific startup constraints discovered while validating the jewellery storefront artifact.
---

Use default imports for CommonJS middleware such as pino-http when the API build bundles to ESM; namespace imports can compile but fail at runtime. Keep managed Vite plugin conditionals as arrays of plugin instances only; stray object properties or partial imports prevent the artifact workflow from starting.

**Why:** The project’s build tooling surfaced these incompatibilities only when the managed workflows restarted, even though frontend and backend typechecks passed.

**How to apply:** After changing artifact configuration or server imports, restart the managed workflow and inspect runtime logs, not just TypeScript output.