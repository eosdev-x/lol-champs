import type {
  ChampionDetail,
  ChampionDetailResult,
  ChampionCatalog,
  ChampionResponse,
  ChampionSummary,
} from '../types/lol';

export const API_BASE =
  import.meta.env.VITE_API_BASE_URL ?? 'https://lol-api.imtux.workers.dev';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isChampionSummary(value: unknown): value is ChampionSummary {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    typeof value.name === 'string' &&
    typeof value.title === 'string' &&
    Array.isArray(value.tags) &&
    isRecord(value.image) &&
    typeof value.image.full === 'string' &&
    isRecord(value.info) &&
    isRecord(value.stats)
  );
}

function isChampionDetail(value: unknown): value is ChampionDetail {
  return (
    isChampionSummary(value) &&
    isRecord(value) &&
    typeof value.lore === 'string' &&
    Array.isArray(value.skins) &&
    Array.isArray(value.spells) &&
    isRecord(value.passive)
  );
}

function parseResponse<T>(
  value: unknown,
  isChampion: (candidate: unknown) => candidate is T,
): ChampionResponse<T> {
  if (!isRecord(value) || typeof value.version !== 'string' || !isRecord(value.data)) {
    throw new Error('The champion service returned an unexpected response.');
  }

  const entries = Object.entries(value.data);
  if (!entries.every(([, champion]) => isChampion(champion))) {
    throw new Error('The champion service returned invalid champion data.');
  }

  return {
    type: typeof value.type === 'string' ? value.type : 'champion',
    format: typeof value.format === 'string' ? value.format : 'standAloneComplex',
    version: value.version,
    data: Object.fromEntries(entries) as Record<string, T>,
  };
}

async function fetchJson(endpoint: string, signal?: AbortSignal): Promise<unknown> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: { Accept: 'application/json' },
    signal,
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Champion not found.');
    }
    throw new Error(`Champion service unavailable (${response.status}).`);
  }

  return response.json() as Promise<unknown>;
}

export async function fetchChampions(signal?: AbortSignal): Promise<ChampionCatalog> {
  const payload = parseResponse(await fetchJson('/champions', signal), isChampionSummary);
  const champions = Object.values(payload.data).sort((left, right) =>
    left.name.localeCompare(right.name),
  );

  return { version: payload.version, champions };
}

export async function fetchChampion(
  championId: string,
  signal?: AbortSignal,
): Promise<ChampionDetailResult> {
  const payload = parseResponse(
    await fetchJson(`/champions/${encodeURIComponent(championId)}`, signal),
    isChampionDetail,
  );
  const champion = payload.data[championId] ?? Object.values(payload.data)[0];

  if (!champion) {
    throw new Error('Champion not found.');
  }

  return { version: payload.version, champion };
}
