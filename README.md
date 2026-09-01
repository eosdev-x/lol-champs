# Cryptonicflux LOL Search

Cryptonicflux LOL Search is a polished, searchable League of Legends champion encyclopedia. It loads the current champion roster once, searches names, titles, and classes locally, and gives every champion a deep-linkable detail page with lore, abilities, level-scaled stats, and skins.

Champion data comes from Riot Games Data Dragon through the included Cloudflare Worker. **No Riot API key is needed.**

## Requirements

- Node.js 22 (see `.nvmrc` and `.node-version`)
- npm

## Frontend

```sh
npm install
npm run dev
```

The frontend defaults to `https://lol-api.imtux.workers.dev`. To use the local Worker, set `VITE_API_BASE_URL=http://localhost:8787` in a local, uncommitted `.env.local` file.

Useful commands:

```sh
npm run lint
npm run typecheck
npm test
npm run build
npm run preview
```

## Worker

The Hono Worker proxies only Data Dragon champion endpoints:

- `GET /champions`
- `GET /champions/:id`

It caches Data Dragon responses with the Cloudflare Cache API and restricts browser CORS to `ALLOWED_ORIGIN`, which defaults to `http://localhost:5173` in `wrangler.jsonc`.

```sh
npm run worker:types
npm run worker:dev
```

For a different deployed frontend, configure `ALLOWED_ORIGIN` as a non-secret Worker variable. There are no credentials or Riot personal API keys in this project.

## Stack

React 19, Vite 6, strict TypeScript, Tailwind CSS 4, TanStack Query, TanStack Router, Framer Motion, Fuse.js, Hono, Vitest, and Testing Library.

Cryptonicflux LOL Search is not endorsed by Riot Games and does not reflect the views or opinions of Riot Games or anyone officially involved in producing or managing League of Legends.
