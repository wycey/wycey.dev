# wycey.dev monorepo

This is a bunch of repos of wycey.dev.

## Apps

### [`@wycey/web`](apps/web)

- Link: [`wycey.dev`](https://wycey.dev)  
  Official homepage of wycey.dev.

## Packages

### [`@wycey/eslint-config`](packages/eslint-config)

Base ESLint config used by [`apps/*`](apps).

### [`@wycey/tsconfig`](packages/tsconfig)

Base `tsconfig.json` with presets used by [`apps/*`](apps).

## Setup

Run on **the root directory**:

```bash
$ pnpm i

# Open dev environment on all apps
$ pnpm dev
```

## Build All

Run on **the root directory**:

```bash
$ pnpm build
```

## Lint / Format

Run on **the root directory**:

```bash
# Lint
$ pnpm lint

# If you want to fix errors, run following:
$ pnpm lint.fix

# Format
$ pnpm fmt
```
