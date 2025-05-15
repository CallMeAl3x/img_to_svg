# img_to_svg

A modern Next.js app for converting raster images (PNG) to SVG and visually comparing the results.

## Getting Started

Install dependencies:

```bash
bun install
```

Run the development server:

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features

- Upload and preview PNG images
- Convert images to SVG using ImageTracer
- Compare original and SVG with interactive slider
- Zoom and pan in modal view
- Download SVG output
- Customizable conversion settings
- Mobile-friendly UI

## Project Structure

- `app/` — Main application code and components
  - `(components)/` — App-specific UI and logic components
- `components/ui/` — UI primitives (Button, Input, Popover, etc.)
- `hooks/` — Custom React hooks
- `lib/` — Utility functions and settings descriptions
- `public/` — Static assets

## Main Dependencies

- [Next.js](https://nextjs.org/)
- [framer-motion](https://www.framer.com/motion/)
- [ImageTracerJS](https://github.com/jankovicsandras/imagetracerjs)
- [@tabler/icons-react](https://tabler.io/icons)
- [shadcn/ui](https://ui.shadcn.com/) (for UI primitives)
- [clsx](https://github.com/lukeed/clsx) and [class-variance-authority](https://cva.style/)

## Deployment

Deploy easily on [Vercel](https://vercel.com/) or your preferred platform.

---

Feel free to open issues or contribute!
