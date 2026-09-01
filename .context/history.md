# History

## [2026-09-01] Clone and inspect
**Agent:** Sonic
**Branch:** main @ 5baa630
**Changes:** Cloned repo, inspected stack, confirmed live worker.
**Files:** none changed in the app yet; added `.context/`
**Commit:** n/a

## [2026-09-01] Champion encyclopedia overhaul
**Agent:** Tails
**Branch:** andy/encyclopedia-overhaul
**Changes:** Rebuilt the frontend as Cryptonicflux LOL Search with local fuzzy filtering, champion class filters, deep-linked detail pages, level-scaled stats, sanitized ability text, and skins. Converted the API to a Hono Worker with Cache API caching, generated bindings, and restricted CORS. Added CI, tests, Node 22 pins, and documentation.
**Verification:**
- `npm install` — PASS
- `npm run worker:types` — PASS
- Initial `npm run lint` — PASS
- Initial `npm run typecheck` — FAIL (removed an unnecessary standalone Workers type reference and aligned the cache helper context with generated runtime types)
- Initial `npm test` — FAIL (tightened the fuzzy-search fixture and stubbed jsdom scrolling)
- `npm run typecheck` after fixes — PASS
- `npm test` after fixes — PASS (3 files, 5 tests)
- `npm run build` — PASS (includes typecheck; Vite 6 production build)
- Final `npm run lint` — PASS
- Final `npm test` — PASS (3 files, 5 tests)
- `git diff --check` — PASS
**Deploy/push:** Not run, per scope.

## [2026-09-01] Sonic verify
**Agent:** Sonic
**Branch:** andy/encyclopedia-overhaul @ 56752e4
**Changes:** Independent re-run of lint/test/build; security skim of worker CORS, champion-id validation, and ability HTML stripping.
**Verification:**
- `npm run lint` — PASS
- `npm test` — PASS (3 files, 5 tests)
- `npm run build` — PASS (Vite 6.4.3, 2222 modules)
- `git diff --check` — PASS
- No `innerHTML` / `dangerouslySetInnerHTML`; CORS is origin-restricted; no secrets in tree
**Notes:** Live worker at lol-api.imtux.workers.dev is still the old code. New frontend still talks to `/champions` and `/champions/:id`, so local `npm run dev` works against the current live API. Do not deploy the new Worker until `ALLOWED_ORIGIN` matches the real frontend origin.

## [2026-09-01] Go live
**Agent:** Sonic
**Branch:** andy/encyclopedia-overhaul
**Changes:** Set Worker `ALLOWED_ORIGIN` to `https://lol.cryptonicflux.com`. Added Pages SPA `_redirects`. Deploying Worker `lol-api` and Pages `lol-champs`.
