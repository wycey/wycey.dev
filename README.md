# wycey.dev monorepo

This is a bunch of repos of wycey.dev.

## Apps

## [`@wycey/blog`](apps/blog)

- Link: [`blog.wycey.dev`](https://blog.wycey.dev)  
  Official blog of wycey.dev.

## Packages

### [`@wycey/biome-config`](packages/eslint-config)

Base Biome config used by [`apps/*`](apps).

### [`@wycey/browserslist-config`](packages/browserslist-config)

Base Browserslist configuration used by [`apps/*`](apps).

### [`@wycey/tsconfig`](packages/tsconfig)

Base `tsconfig.json` with presets used by [`apps/*`](apps).

## Setup

Run on **the root directory**:

```bash
$ aube install

# Open dev environment on all apps
$ aube dev
```

## Build All

Run on **the root directory**:

```bash
$ aube build
```

## Lint / Format

Run on **the root directory**:

```bash
# Lint
$ aube lint

# If you want to fix errors, run following:
$ aube lint.fix

# Format
$ aube fmt
```
