# Sortvis

Sortvis is an interactive logic visualization tool. It provides an engaging and educational approach to understanding how various sorting algorithms manipulate data structures.

## Playground

https://sortvis.pages.dev/

## Algorithms Implemented

- Bubble Sort
- Quick Sort
- Merge Sort
- Heap Sort
- Insertion Sort
- Selection Sort

## Running locally

### Setup

Make sure you have [Bun](https://bun.sh/) **or** [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. Clone the repository:
   ```pwsh
   git clone https://github.com/qonTesq/sortvis.git
   ```
2. Navigate to the project directory:
   ```pwsh
   cd sortvis
   ```
3. Install dependencies using your preferred package manager (e.g., bun, pnpm, npm):
   ```pwsh
   bun install
   ```
   ```pwsh
   pnpm install
   ```
   ```pwsh
   npm install
   ```
   _Note: This project utilizes a `bun.lock` file, meaning [Bun](https://bun.sh) is the natively used package manager._

### Start

Start the development server:

```pwsh
bun dev
```

Open your browser and navigate to `http://localhost:5173`.

### Build

To create a production version:

```pwsh
bun run build
```

You can preview the production build locally with `bun run preview`. Then open `http://localhost:4173` in your browser.

### Code Quality

To automatically format your code:

```pwsh
bun run format
```

To check for syntax or stylistic issues using ESLint and Prettier:

```pwsh
bun run lint
```

## Project Structure

```text
src/
├── lib/
│   ├── algorithms/    # Sorting logic implementations (Bubble, Quick, Merge, etc.)
│   ├── components/    # Svelte UI components (Canvas renderer, Controls, Header, Footer)
│   ├── config/        # Algorithm configurations & metadata
│   ├── state/         # Centralized visualizer engine and global states
│   └── types/         # TypeScript interfaces and discriminator types
└── routes/            # Main entry point and page layouts
```
