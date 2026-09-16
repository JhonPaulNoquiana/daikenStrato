# Daikin × Strato Builders website

The site has a Vinext build for Sites and a static Next.js export for Render.

| Path | Purpose |
| --- | --- |
| `app/` | Route, document metadata, and global style imports |
| `components/experience/` | Scroll driven room, narrative, and swipeable 3D product showcase |
| `components/sections/` | Product collection, technology, campaigns, and contact sections |
| `components/ui/` | Reusable UI primitives |
| `data/` | Product catalog and 3D showcase feature content |
| `lib/experience/` | Room rendering, photo tilt motion, and interaction helpers |
| `styles/` | Styles for the experience and collection |
| `public/images/` | Images organized by brand, products, technology, and campaigns |
| `.openai/hosting.json` | Sites project configuration |
| `tests/` | Pointer, touch, and feature navigation checks |

Run `npm install` and `npm run dev` for local development. Run `npm run build` before publishing.

For manual Render setup, see [docs/render-deployment.md](docs/render-deployment.md). Run `npm run build:render` to produce the `out/` folder for a Render Static Site.

Run `node --test tests/rotation.test.mjs` with Node 24 to check hover mapping, swipe limits, and feature navigation.

The product showcase uses a transparent cutout of the supplied social preview. Its photo moves in 3D perspective on hover or touch, with bounded tilt so the original image stays visible. It is not a reconstructed 360-degree product model. See `docs/image-assets.md` for the asset source and edit prompt.
