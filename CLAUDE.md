# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Architecture

This is a presentation repository using Slidev for creating developer-focused slides. The repository structure follows a monorepo pattern with individual presentation folders under `slides/`.

### Core Structure
- Root level contains basic package.json for overall project management
- Individual presentations are self-contained in `slides/[presentation-name]/` folders
- Each presentation has its own package.json with Slidev dependencies
- Presentations use Vue components for interactive elements

### Technology Stack
- **Slidev**: Main presentation framework using Markdown with Vue components
- **Vue 3**: For interactive components and scripting within slides
- **TypeScript**: Used in Vue components and external scripts
- **pnpm**: Package manager (specified in packageManager field)
- **Node.js 22.19.0**: Runtime version managed by Volta

## Development Commands

This repository uses pnpm workspaces for managing multiple presentations.

### Root-level commands (recommended):
```bash
pnpm install      # Install dependencies for all workspaces
pnpm dev          # Start dev server for default presentation
pnpm build        # Build default presentation
pnpm export       # Export default presentation
pnpm build:all    # Build all presentations and aggregate to dist/
pnpm export:all   # Export all presentations
pnpm aggregate    # Aggregate existing builds to dist/ (without rebuilding)
```

### For individual presentations (alternative approach):
```bash
cd slides/[presentation-name]
pnpm dev          # Start development server on localhost:3030
pnpm build        # Build static files for production
pnpm export       # Export to PDF/other formats
```

### Workspace-specific commands:
```bash
pnpm --filter [presentation-name] [command]  # Run command in specific workspace
pnpm -r [command]                            # Run command in all workspaces
```

### Key Files in Each Presentation
- `slides.md`: Main presentation content in Markdown with frontmatter
- `components/`: Vue components for interactive elements
- `snippets/`: TypeScript files for code examples that can be imported
- `pages/`: Additional slide pages that can be imported

### Slide Development Patterns
- Slides use frontmatter for configuration (theme, transitions, etc.)
- Vue components can be embedded directly in slides
- Code snippets support syntax highlighting and can be imported from external files
- Interactive elements use Vue's reactivity system
- Slides support click animations, motion effects, and drag interactions