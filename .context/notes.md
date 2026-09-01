# Notes

## Gotchas
- Frontend title is "Mama's LOL Search"; `index.html` title is "Cryptonicflux LOL Search"
- Worker lives at `https://lol-api.imtux.workers.dev` and proxies Data Dragon (no Riot summoner key in this repo)
- `/champions/:id/meta` recommended items are hardcoded and include removed items (Luden's Tempest, Divine Sunderer)
- Search refetches the full champion list on every keystroke, then filters client-side
- LiveGame / MatchHistory / SummonerProfile are unused and would not typecheck if imported

## Patterns
- Vite + React 18 + TS + Tailwind 3 + Framer Motion
- CORS `*` on worker.js

## Tips
- Data Dragon splash: `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/{id}_0.jpg`
- Champion square: `https://ddragon.leagueoflegends.com/cdn/{version}/img/champion/{image.full}`
