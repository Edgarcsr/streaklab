<div align="center">

![streaklab](https://shieldcn.dev/header/glow.svg?title=streaklab&subtitle=Grainy%20light-streak%20backgrounds)

![stars](https://shieldcn.dev/github/Edgarcsr/streaklab/stars.svg)
![license](https://shieldcn.dev/github/Edgarcsr/streaklab/license.svg)
![vite](https://shieldcn.dev/npm/vite.svg)
![react](https://shieldcn.dev/npm/react.svg)
![tailwindcss](https://shieldcn.dev/npm/tailwindcss.svg)
![vitest](https://shieldcn.dev/npm/vitest.svg)

</div>

**streaklab** is a single-page app that generates grainy light-streak background images. Pick a palette with the color picker, shape the streaks with sliders, and download the result as a PNG.

## Inspiration

The look comes from the [VoidZero](https://voidzero.dev) family of sites: Vite+, Vite, Vitest, Oxc and Rolldown. VoidZero is the company behind a unified JavaScript toolchain, and their pages share a distinctive visual language: deep gradients crossed by fine beams of light, with a strong film-like grain on top. The streaks have very different thicknesses, from hairlines to soft wide bands, which gives the image depth.

streaklab is an independent, fan-made experiment to reproduce that *kind* of image programmatically. It is **not affiliated with or endorsed by VoidZero**, and it does not use any of their assets, images or code. Only the general idea (gradient + light streaks + grain) is borrowed.

## How the image is built

Everything is drawn with the browser's Canvas 2D API, in four layers:

1. **Gradient**: a three-stop linear gradient (shadow, midtone, highlight).
2. **Streaks**: dozens of long, thin gradients that fade at both ends. Each one rolls a thickness class: about half are sharp hairlines, then medium lines, soft wide beams and a few huge, barely visible bands. They are blended with `screen`, so overlapping streaks add up like light. The radial mode fires the same streaks from a point above the image.
3. **Glow**: the brightest hairlines get a wide, blurred halo.
4. **Grain**: a signed noise tile (white specks lighten, black specks darken) painted over everything. It also hides gradient banding.

A small seeded PRNG (mulberry32) drives all randomness, so the same settings and seed always give the same pixels.

## Stack

- [Vite](https://vite.dev) 8 + React + TypeScript
- [Tailwind CSS](https://tailwindcss.com) v4
- [shadcn/ui](https://ui.shadcn.com) style components on Radix (`radix-ui`)
- Color picker with the compound API of the [shadcn.io color picker](https://www.shadcn.io/components/forms/color-picker)
- [Vitest](https://vitest.dev) for tests and [Ultracite](https://www.ultracite.ai) (Biome) for linting and formatting

## Getting started

```bash
bun install
bun run dev
```

| Script | What it does |
| --- | --- |
| `bun run dev` | Start the dev server |
| `bun run build` | Typecheck and build for production |
| `bun run test` | Run the unit tests |
| `bun run lint` | Check lint and format with Ultracite |
| `bun run format` | Auto-fix lint and format issues with Ultracite |

## About the color picker

The picker in `src/components/ui/color-picker.tsx` was written by hand to follow the compound-component API of the shadcn.io one (`ColorPicker`, `ColorPickerSelection`, `ColorPickerHue`, `ColorPickerEyeDropper`, `ColorPickerOutput`, `ColorPickerFormat`). It handles opaque `#rrggbb` colors only, with no alpha channel.

If you prefer the original, install it with the shadcn CLI. Check the Installation tab on the [component page](https://www.shadcn.io/components/forms/color-picker) for the exact command; shadcn.io components are installed with a URL of the form `bunx shadcn@latest add https://www.shadcn.io/r/<name>.json`. The original may use a different `onChange` signature and need small changes in `src/components/color-field.tsx`.

## Deploy

The site deploys to GitHub Pages with the workflow in `.github/workflows/deploy.yml`. It runs on every push to `main` (and can be started by hand from the Actions tab).

1. In the repository settings, open **Pages** and set **Source** to **GitHub Actions**.
2. Push to `main`. The workflow builds with `GITHUB_ACTIONS` set, so Vite uses the `/streaklab/` base path.

The site is served at `https://edgarcsr.github.io/streaklab/`. If the repository has a different name, change the `base` in `vite.config.ts` to match.

## Limitations

- Safari does not support `CanvasRenderingContext2D.filter`, so streaks and glow are sharper there.
- Exports of 2560×1440 can take a moment on slow machines.
- The preview is drawn at 1280px wide and scaled; exports re-render at full size with the same composition.

## Similar tools

streaklab is far from the first grain generator. Worth a look:

- [gggrain](https://fffuel.co/gggrain/): grainy SVG gradients
- [cssmatic noise generator](https://cssmatic.com/gen-noise-texture.html): CSS noise over gradients
- [InstantGradient](https://instantgradient.com): grainy gradients with WebGL export

None of the ones I found focus on light streaks with varied thickness, which is what this project is about.

## License

[MIT](./LICENSE)
