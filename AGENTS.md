# General Code Guidelines Copilot Instructions

- Make a response in Japanese as possible.
- Always verify information before presenting it. Do not make assumptions or speculate without clear evidence.
- Make changes file by file and allow for review of mistakes.
- Never use apologies or give feedback about understanding in comments or documentation.
- Don't suggest whitespace changes or summarize changes made.
- Only implement changes explicitly requested; do not invent changes.
- Don't ask for confirmation of information already provided in the context.
- Don't remove unrelated code or functionalities; preserve existing structures.
- Don't ask the user to verify implementations visible in the provided context.
- Don't suggest updates or changes to files when there are no actual modifications needed.
- Always provide links to real files, not context-generated files.
- Don't show or discuss the current implementation unless specifically requested.
- Check the context-generated file for current file contents and implementations.
- Prefer descriptive, explicit variable names for readability.
- Adhere to the existing coding style in the project.
- Prioritize code performance and security in suggestions.
- Implement robust error handling and logging where necessary.
- Encourage modular design for maintainability and reusability.
- Ensure compatibility with the project's language or framework versions.
- Replace hardcoded values with named constants.
- Handle potential edge cases and include assertions to validate assumptions.
- Don't add so many comments that they clutter the code; only add comments that provide necessary explanations or context that isn't immediately clear from the code itself.
- Don't add blocked section comment (e.g. a title comment surrounded with some delimiters); if you want to write like this, do not add delimiters.

# Project-specific guidelines

## Monorepo Structure

Bun workspaces + Turborepo monorepo. **Bun** is the only allowed package manager. npm/yarn/pnpm must not be used.

See [README.md](./README.md) for the overall project structure.

## Commands

To run blog-specific scripts, execute `bun run <script>` inside the `apps/blog` directory.

## Blog App Tech Stack (apps/blog)

- **Framework**: Astro
- **Deployment**: Cloudflare Workers
- **Site URL**: `https://blog.wycey.dev` (for local development, use `http://localhost:4321`)
- **UI frameworks**: React and Solid.js coexist
  - React components: placed under `**/react/*`
  - Solid.js components: placed under `**/solid/*`
  - Astro components: everything else
- **CSS**: UnoCSS (not Tailwind)
  - `presetWind4` base (Tailwind 4-compatible utilities)
  - `presetAttributify` enabled (utilities can be written as HTML attributes)
  - `presetRadix` color system (Radix Colors)
  - `presetIcons` for icons (Lucide)
  - `presetAnimations` for animations (Tailwind Animations)
  - Dark mode: toggled via `.dark` class
  - Caveat: `opacity="0"` and some attributes which cause TypeScript errors does not work in attributify mode; use `class="..."` instead in those cases
- **UI components**: Astro, shadcn/ui (radix-nova style, React-based), Solid.js for own components as possible
  - Astro component path: `@/components/astro`
  - React & shadcn/ui-related component path: `@/components/react` (Make sure to suffix with `.client.tsx` if the component is used in Astro files)
  - Own component path: `@/components/solid` (Make sure to suffix with `.client.tsx` with same reason as React components)

## Color System

Semantic colors based on Radix Colors:

| Alias | Radix Color | Usage |
|-------|-------------|-------|
| primary | violet | Main color |
| secondary | iris | Sub color |
| info | indigo | Information |
| warning | amber | Warning |
| error | red | Error |
| success | green | Success |
| base | mauve | Neutral |

Semantic tokens (`bg`, `border`, `fg`, etc.) are defined in `extendTheme` of `uno.config.ts`.

## Content Structure

Managed via Astro Content Collections (glob loaders):

- **Articles**: `content/articles/<slug>/index.{md,mdx}`
  - Slugs must be lowercase kebab-case
- **Authors**: `content/authors/<handle>.yaml` (with YAML schema comments)
- **Categories**: `content/categories/<id>.yaml`
  - Tags belong to categories

Article URL pattern: `/articles/<category-id>/<article-slug>`

## Lint / Formatting

- **Biome**: Formatting + linting (extends `@wycey/biome-config/base`)
- **textlint**: Japanese content proofreading (`content/**/*.{md,mdx}`)

## MCP Usage

- Try to use **serena** for code inspection, use search tool such as grep as a fallback.
- Try to use **agent-browser** to see what the current Web UI looks like.
