# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 16 project named "cal" - a modern calculator application. The project uses the App Router structure and is built with TypeScript, Tailwind CSS v4, and Shadcn/ui components.

## Development Commands

- `npm run dev` - Start the development server (runs on http://localhost:3000)
- `npm run build` - Build the production application
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint to check code quality

## Technology Stack

### Core Framework
- **Next.js 16** - React framework with App Router
- **React 19.2.0** - UI library
- **TypeScript** - Type safety

### Styling & UI
- **Tailwind CSS v4** - Utility-first CSS framework
- **Shadcn/ui** - Component library (New York style, RSC enabled)
- **Lucide React** - Icon library
- **tw-animate-css** - Animation utilities
- **Geist fonts** - Sans and mono fonts from Google

### Utilities
- **class-variance-authority** - Component variant management
- **clsx** - Conditional class names
- **tailwind-merge** - Tailwind class merging

## Project Structure

```
cal/
├── app/                      # Next.js App Router
│   ├── basic-math-cal/       # Multi-line calculator page
│   │   └── page.tsx         # Calculator implementation with multi-line support
│   ├── globals.css          # Global styles with Tailwind v4
│   ├── layout.tsx           # Root layout with navigation bar
│   └── page.tsx             # Home page with feature cards
├── components/              # Custom React components
│   ├── NavBar.tsx          # Navigation bar component with routing
│   └── WebsiteTimer.tsx    # Website uptime timer component
├── lib/                     # Utility functions
│   └── utils.ts            # cn() function for class merging
├── components.json          # Shadcn/ui configuration
├── eslint.config.mjs        # ESLint configuration
├── next.config.ts          # Next.js configuration
├── tsconfig.json           # TypeScript configuration
├── package.json            # Project dependencies
└── README.md               # Project documentation
```

## Key Configuration

### Shadcn/ui Setup
- Style: New York
- Base color: Slate
- CSS variables enabled
- Icon library: Lucide
- Component aliases configured (@/components, @/lib, @/ui, @/hooks)

### Styling Approach
- Uses Tailwind CSS v4 with custom theme configuration
- Dark mode support with CSS custom properties
- Uses `oklch` color space for better color management
- Styled components with `cn()` utility from `lib/utils.ts`

## Current State

The project is now in active development with the following implemented features:

### Completed Features
- ✅ **Multi-line Calculator** (`/basic-math-cal`):
  - Support for multiple input rows
  - Keyboard shortcuts (a = add row, Delete = remove row, Enter = calculate)
  - Row selection and highlighting
  - Real-time calculation results
  - Error handling for invalid expressions
  - Safe expression evaluation using custom parser

- ✅ **Navigation System**:
  - Fixed navigation bar at the top
  - Logo and page links
  - Current page highlighting
  - Responsive design

- ✅ **Homepage** (`/`):
  - Website uptime timer display
  - Card-based layout for feature access
  - Quick navigation to calculator

### Technical Implementation
- Next.js App Router with client-side navigation
- Shadcn/ui component system integrated
- Tailwind CSS v4 styling with custom theme
- Dark/light theme support via CSS variables
- TypeScript for type safety
- Custom expression evaluator (no eval())
- Shunting Yard algorithm for operator precedence

## Development Notes

- The project uses the modern App Router (not Pages Router)
- Custom components should be placed in the `components/` directory for better organization
- Use `cn()` function for conditional class merging
- CSS variables are defined in `app/globals.css` for theming
- The `.gitignore` includes rules for AI-generated files (/docs, .claude, CLAUDE.md)
- Navigation is implemented with Next.js `Link` component and `usePathname` for active state
- The multi-line calculator uses custom keyboard shortcuts for efficient interaction
- Expression evaluation is handled by a custom parser using the Shunting Yard algorithm
- All interactive components use 'use client' directive for client-side rendering

## Component Organization

- Place reusable custom components in `components/` directory
- Import components using relative paths (e.g., `import ComponentName from '../components/ComponentName'`)
- Keep App Router pages in `app/` directory with minimal component logic
- For complex components, consider extracting business logic to separate utility functions

## Current Implementation Details

### Multi-line Calculator (`/basic-math-cal`)
The calculator implements a sophisticated multi-line input system with the following features:

**State Management:**
- Uses `useState` hook to manage an array of `InputRow` objects
- Each row has: `id`, `value`, `result`, and `error` properties
- Tracks the currently selected row with `selectedRowIndex`

**Keyboard Interactions:**
- Global `keydown` event listener for 'a' and 'Delete' keys
- 'a' key: Inserts a new row at `selectedRowIndex + 1`
- 'Delete' key: Removes current row (if not the first row)
- 'Enter' key: Evaluates the expression in the current row

**Row Selection:**
- Click anywhere on a row to select it
- Input focus automatically sets the selected row
- Visual feedback with blue highlight for selected row

**Calculation Logic:**
- Custom `evaluateExpression()` function using the Shunting Yard algorithm
- Handles operator precedence correctly
- Validates input to prevent security issues (no eval())
- Returns `null` for invalid expressions or errors

### Navigation Bar (`/components/NavBar.tsx`)
- Fixed position at top of page
- Uses `usePathname()` hook to determine active page
- Highlights active link with blue background
- Responsive design for mobile devices

### Homepage (`/app/page.tsx`)
- Displays website uptime timer
- Card-based grid layout for feature access
- Each card links to a specific calculator page
- Uses Next.js `Link` component for client-side routing