# 🥭 Mango Range Component

A modern, customizable range slider component built with React, Next.js, and TypeScript. This project demonstrates two different range implementations: a normal continuous range and a fixed-values range with snapping behavior.

![Next.js](https://img.shields.io/badge/Next.js-16.0.7-black?style=flat&logo=next.js)
![React](https://img.shields.io/badge/React-19.2.1-blue?style=flat&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue?style=flat&logo=typescript)
![Biome](https://img.shields.io/badge/Biome-2.3.8-orange?style=flat)

## ✨ Features

- **🎯 Dual Range Modes**
  - **Exercise 1**: Normal continuous range with integer-only values
  - **Exercise 2**: Fixed values range with automatic snapping

- **🎨 Interactive Controls**
  - Drag handles to adjust range values
  - Click labels to input values directly (Exercise 1 only)
  - Visual feedback with hover and active states
  - Visual marks for fixed value positions (Exercise 2)

- **♿ Accessibility**
  - ARIA labels for screen readers
  - Keyboard navigation support
  - Semantic HTML structure

- **🔧 Developer Experience**
  - TypeScript for type safety
  - Biome for linting and formatting
  - Custom hooks for reusable logic
  - Modular component architecture

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm 10.24.0+ (or npm/yarn)

### Installing pnpm

If you don't have pnpm installed, you can install it using one of these methods:

**Using npm:**
```bash
npm install -g pnpm
```

For more installation options, visit the [official pnpm documentation](https://pnpm.io/installation).

### Installation

1. Clone the repository:
```bash
git clone https://github.com/xavimajoral/Mango
cd mango
```

2. Install dependencies:
```bash
pnpm install
```

3. Start the development server:
```bash
pnpm dev
```

4. Open your browser and navigate to:
   - **Home**: [http://localhost:8080](http://localhost:8080)
   - **Exercise 1**: [http://localhost:8080/exercise1](http://localhost:8080/exercise1)
   - **Exercise 2**: [http://localhost:8080/exercise2](http://localhost:8080/exercise2)

## 📁 Project Structure

```
mango/
├── app/
│   ├── css/                    # Global and component styles
│   ├── exercise1/              # Normal range exercise page
│   ├── exercise2/              # Fixed values range exercise page
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Home page
├── components/
│   └── Range/
│       ├── index.tsx           # Range component
│       ├── Range.module.css    # Component styles
│       └── useRange.ts         # Custom hook for range logic
├── lib/
│   └── services.ts             # Mock HTTP services
├── public/
│   └── img/                    # Static assets
└── package.json
```

## 🎯 Exercises

### Exercise 1: Normal Range

A continuous range slider with the following features:

- **Integer-only values**: Values snap to whole numbers (e.g., 34 → 33 or 35)
- **Minimum gap**: 3 € minimum distance between handles
- **Direct input**: Click on value labels to input new values via prompt
- **Range**: Configurable min/max values (default: 1-100)

**Usage Example:**
```tsx
<Range
  min={1}
  max={100}
  range={[25, 75]}
  onChange={setRange}
/>
```

### Exercise 2: Fixed Values Range

A range slider that only allows selection from fixed values:

- **Fixed values**: Only selects from provided array `[1.99, 5.99, 10.99, 30.99, 50.99, 70.99]`
- **Automatic snapping**: Handles snap to nearest fixed value
- **Visual marks**: Indicators show available fixed value positions
- **Non-editable labels**: Currency values are display-only (no input prompts)
- **Index-based gap**: Minimum 1 index distance between handles

**Usage Example:**
```tsx
<Range
  min={1.99}
  max={70.99}
  range={[10.99, 50.99]}
  onChange={setRange}
  fixedValues={[1.99, 5.99, 10.99, 30.99, 50.99, 70.99]}
/>
```

## 🛠️ Development

### Available Scripts

```bash
# Start development server (port 8080)
pnpm dev

# Build for production
pnpm build

# Start production server (port 8080)
pnpm start

# Run linter
pnpm lint

# Format code
pnpm format

# Run tests
pnpm test

# Run tests once
pnpm test:run

# Run tests with UI
pnpm test:ui

# Run tests with coverage
pnpm test:coverage
```

### Code Quality

This project uses [Biome](https://biomejs.dev/) for:

- **Linting**: Catches errors and enforces best practices
- **Formatting**: Consistent code style (2-space indentation)
- **Type checking**: TypeScript for compile-time safety

### Configuration

- **Port**: Development and production servers run on port `8080`
- **Formatter**: Biome with 2-space indentation
- **Linter**: Biome with strict rules (e.g., no `any` types)

## 🎨 Component API

### Range Component Props

### Custom Hook: `useRange`

The `useRange` hook encapsulates all range logic:

```typescript
const {
  rangeRef,           // Ref for the range track element
  isDragging,         // Current dragging state
  hoveredHandle,       // Currently hovered handle
  setHoveredHandle,    // Set hovered handle
  handleMouseDown,     // Mouse down handler
  promptValue,         // Prompt for new value (Exercise 1)
  valueToPercentage,   // Convert value to percentage
} = useRange({ min, max, range, onChange, fixedValues });
```

## 🚀 Deployment

### GitHub Pages

This project is configured for automatic deployment to GitHub Pages using GitHub Actions.

**Automatic Deployment:**
- Every push to the `main` branch triggers a build and deployment
- The site is automatically published to: `https://xavimajoral.github.io/Mango/`

## 🧪 Mock Services

The project includes mock HTTP services in `lib/services.ts`:

- `fetchNormalRange()`: Returns `{ min: 1, max: 100 }`
- `fetchFixedRange()`: Returns `{ rangeValues: [1.99, 5.99, 10.99, 30.99, 50.99, 70.99] }`

## 🎯 Key Implementation Details

- **Separation of Concerns**: Logic separated into `useRange` hook
- **Performance**: Event listeners properly cleaned up
- **Accessibility**: ARIA attributes and keyboard support
- **Type Safety**: Full TypeScript coverage
- **Responsive**: Works on different screen sizes
- **Visual Feedback**: Hover states, dragging indicators, and visual marks

## 🔒 Security

### Security Updates

This project is kept up-to-date with the latest security patches:

- **CVE-2025-55182** (Critical): Fixed in React 19.2.1 and Next.js 16.0.7
  - **Vulnerability**: Remote Code Execution (RCE) in React Server Components (RSC) "Flight" protocol
  - **Affected Versions**: React 19.0 - 19.2.0
  - **Status**: ✅ **Patched** - Updated to React 19.2.1 and Next.js 16.0.7

**Current Secure Versions:**
- React: `19.2.1`
- React-DOM: `19.2.1`
- Next.js: `16.0.7`

To check for security updates, run:
```bash
pnpm audit
```

To update dependencies to the latest secure versions:
```bash
pnpm update react@latest react-dom@latest next@latest
```

## 📝 License

ISC

## 👤 Author

**Xavi Majoral**

---

Built with ❤️ using Next.js, React, TypeScript, Vitest, and Biome
