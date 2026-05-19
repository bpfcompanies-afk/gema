# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

No test suite is configured.

## Environment Variables

`RESEND_API_KEY` is required for the contact form email API (`src/app/api/send/route.ts`).

## Architecture

Next.js 16 App Router project (TypeScript + Tailwind CSS v4) for the Gema ERP product landing page.

### Pages (`src/app/`)

| Route | File | Description |
|---|---|---|
| `/` | `page.tsx` | Home — Hero → ValueProp → BentoGrid → CTA |
| `/precios` | `precios/page.tsx` | Pricing page (4 tiers, monthly/annual toggle) |
| `/modulos` | `modulos/page.tsx` | Product modules showcase |
| `/contacto` | `contacto/page.tsx` | Contact form → `/api/send` |
| `/legales` | `legales/page.tsx` | Terms & conditions |
| `/api/send` | `api/send/route.ts` | POST — sends lead email to BPF + confirmation to user via Resend batch |

### Layout (`src/app/layout.tsx`)

Root layout wraps all pages in `<SmoothScroll>` → `<Navbar>` → `<main>` → `<Footer>`. The `SmoothScroll` component initializes Lenis and synchronizes it with the GSAP ticker so scroll-triggered animations stay frame-accurate.

### Animation pattern

All animated pages/components are `'use client'`. The standard pattern is:

```tsx
useLayoutEffect(() => {
  const ctx = gsap.context(() => {
    gsap.set(".target", { opacity: 0, y: 30 });
    gsap.to(".target", { opacity: 1, y: 0, stagger: 0.1, ease: "power3.out" });
  }, containerRef);
  return () => ctx.revert(); // cleanup on unmount
}, []);
```

Use `gsap.context()` with a `containerRef` to scope selectors. Always return `ctx.revert()` to avoid leaks. Register `ScrollTrigger` once per file with `gsap.registerPlugin(ScrollTrigger)` at the module level.

### Styling

Tailwind CSS v4 with a custom brand theme defined in `src/app/globals.css`:

| Token | Value |
|---|---|
| `gema-blue` | `#15aff6` |
| `gema-purple` | `#8230f1` |
| `gema-dark` | `#212121` |
| `gema-light` | `#fafafa` |

Custom utilities defined with `@utility` in globals.css: `text-gradient`, `bg-gema-gradient`, `glass-nav`.

### Email

`src/components/EmailTemplate.tsx` and `ConfirmationTemplate.tsx` are React Email components rendered server-side inside the `/api/send` route handler. Resend sends both in a single `batch.send()` call.
