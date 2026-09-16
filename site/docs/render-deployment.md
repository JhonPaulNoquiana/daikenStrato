# Manual Render deployment

The website has a separate static Next.js export for Render. Keep using the `site/` folder as the app root. The Render build enables static export, writes to `site/out/`, and needs no running server. The default build remains available for the existing Sites setup.

## 1. Confirm the source

The GitHub repository is `JhonPaulNoquiana/daikenStrato` on the `main` branch. Check that the latest changes are visible there before creating the service. Render reads the `site/` folder from this GitHub repository.

## 2. Create the service

In Render, select **New → Static Site**, connect your GitHub account, and choose `JhonPaulNoquiana/daikenStrato`. Fill in:

| Render field | Value |
| --- | --- |
| Branch | `main` |
| Root Directory | `site` |
| Build Command | `npm ci && npm run build:render` |
| Publish Directory | `out` |
| Environment variable | `NODE_VERSION=24.14.1` |

The app needs no API key, database, start command, or `PORT` setting. Render supplies the published URL automatically. Next.js exports the page and its client-side interactions at build time.

Create the service and wait for the first build to finish. Use the generated `onrender.com` address to check the homepage, product sheets, interactive air-conditioner, and contact links. Render rebuilds from `main` on later pushes if automatic deploys are enabled.

## 3. Optional custom domain

After adding a custom domain in Render, set `SITE_URL` to its full HTTPS origin, such as `https://example.com`, then redeploy. This makes social sharing metadata point to the custom domain. Without this setting, metadata uses Render's generated `RENDER_EXTERNAL_URL`.

## Local verification

From `site/`, run `npm ci` and `npm run build:render`. The export was verified locally: `out/index.html`, its product images, and its social image were served successfully.

The room-size form opens a prefilled email draft. The visitor must send the email to complete their request; the website does not store leads or run a database.

References: [Render Next.js deployment](https://render.com/docs/deploy-nextjs-app), [Render monorepo root directories](https://render.com/docs/monorepo-support), [Render Node versions](https://render.com/docs/node-version), [Render default environment variables](https://render.com/docs/environment-variables).
