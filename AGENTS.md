# General Code Guidelines Instructions

- Always verify information before presenting it. Do not make assumptions or speculate without clear evidence.
- Make changes file by file and allow for review of mistakes.
- Don't suggest whitespace changes or summarize changes made.
- Only implement changes explicitly requested; do not invent changes.
- Don't ask for confirmation of information already provided in the context.
- Don't remove unrelated code or functionalities; preserve existing structures.
- Don't quote the current implementation at length unless it is needed to explain a change.
- Prefer descriptive, explicit variable names for readability.
- Adhere to the existing coding style in the project.
- Replace hardcoded values with named constants.
- Don't add so many comments that they clutter the code; only add comments that provide necessary explanations or context that isn't immediately clear from the code itself.
- Don't add blocked section comment (e.g. a title comment surrounded with some delimiters); if you want to write like this, do not add delimiters.

# Project-specific guidelines

## Monorepo Structure

pnpm-workspace.yaml-based monorepo with Turborepo. Use **aube** or **pnpm**.

See [README.md](./README.md) for the overall project structure.

## Commands

To run blog-specific scripts, execute `aubr <script>` inside the `apps/blog` directory.

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
