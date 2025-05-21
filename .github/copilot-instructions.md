# Tokens Studio Graph Engine - Copilot Instructions

## Overview

The Tokens Studio Graph Engine is a visual node-based editor where users build workflows by connecting nodes to manage design tokens. It's a monorepo powered by Turborepo containing multiple packages for the Graph Engine ecosystem.

## Repository Structure

- `/packages/`
  - `graph-engine/`: Core engine library for token processing
  - `graph-editor/`: UI editor for visual node manipulation
  - `ui/`: UI components for the Graph Engine
  - `documentation/`: Documentation website
  - `nodes-*/`: Various node packages extending functionality
  - `vscode-extension/`: VS Code extension for the Graph Engine
  - `eslint-config-custom/`: Shared ESLint configuration
  - `prettier-config-custom/`: Shared Prettier configuration

## Development Workflow

### Package Management

- **Yarn** is the required package manager (`v1.22.x`)
- Do not use pnpm as it causes issues with libraries needing relative paths without symlinks

### Build System

- **Turborepo** manages the monorepo build system
- Use built-in scripts in the root package.json for common operations:
  - `yarn build`: Build all packages
  - `yarn lint`: Lint all packages
  - `yarn test`: Test all packages
  - `yarn dev:<package>`: Start development mode for a specific package

### Code Style and Linting

- TypeScript is used throughout the codebase
- ESLint configuration extends from `@tokens-studio/eslint-config-custom`
- Prettier is used for formatting with config from `@tokens-studio/prettier-config-custom`
- Run `yarn lint` to check for linting issues

### Testing

- Each package has its own test suite
- Vitest is used for testing in most packages
- Run tests with `yarn test`

### UI Components

- Use components from `@tokens-studio/ui` package for all UI development
- Leverage existing UI components rather than creating new ones or using external libraries
- The UI package provides consistent styling and behavior aligned with the Graph Engine design system

### Node Creation

1. Use reverse-domain-notation for namespacing (e.g., `studio.tokens.math.add`)
2. Extend the `Node` class from `@tokens-studio/graph-engine`
3. Define inputs/outputs with proper schemas
4. Implement the `execute()` method for node logic
5. Add tests for your node

## Architecture

The Graph Engine has a clean separation between the editor and the engine core:
- **Engine Core**: Handles the graph execution logic
- **Editor**: Provides visual UI for manipulating the graph
- **Nodes**: Contain the actual functionality and can be packaged separately

## Common Commands

```bash
# Install dependencies
yarn

# Build the engine
yarn build:engine

# Run development server for the UI
yarn dev:ui

# Run tests
yarn test

# Generate documentation
yarn docs
```

## Debugging

- Use the graph visualization tools to understand dependencies
- Generate dependency graphs with `yarn build:graph`
- Check the API documentation at https://tokens-studio.github.io/graph-engine/

## Business Context

The Graph Engine enables designers and developers to:
- Generate design tokens dynamically
- Automate multi-brand systems
- Scale complex designs using subgraphs
- Bridge design and code with outputs like JSON tokens or CSS variables
- Experiment with design systems non-destructively