# Decisions

## [2026-09-01] Clone location
**By:** Sonic
**Context:** Tux asked to clone https://github.com/eosdev-x/lol-champs.git and overhaul it.
**Decision:** Clone to `/home/tux/Documents/Projects/lol-champs` (standard Projects directory).
**Alternatives considered:** Workspace clone; other Documents paths.
**Status:** Active

## [2026-09-01] Overhaul scope and name
**By:** Tux (via Sonic)
**Context:** Kickoff choices for the polish pass.
**Decision:** Champion encyclopedia overhaul only (not summoner/live/match). Product name is **Cryptonicflux LOL Search**. Visual direction: hextech dark-gold League, not generic gray neon.
**Alternatives considered:** Restore summoner/live/match (needs Riot key); visual-polish-only; keep Mama's LOL Search; propose a new name.
**Status:** Active

## [2026-09-01] Data and architecture
**By:** Sonic
**Context:** Current worker fakes recommended items with removed items (Luden's Tempest, Divine Sunderer). Search refetches all champions on every keystroke. Dead summoner components do not typecheck.
**Decision:** Keep Data Dragon only via the existing worker host. Drop fake builds. Compute ratings/stats client-side from champion.json. Load the champion list once and filter locally. Detail route `/champion/$id`. Delete unused LiveGame/MatchHistory/SummonerProfile. Do not deploy the worker or push to GitHub in this pass.
**Alternatives considered:** Keep `/meta` builds; modal-only details; restore Riot summoner API.
**Status:** Active
