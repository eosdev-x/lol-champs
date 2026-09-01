import { Hono } from 'hono';
import type { MiddlewareHandler } from 'hono';

type WorkerApp = { Bindings: Env };
type BackgroundContext = Pick<ExecutionContext, 'waitUntil'>;

const DATA_DRAGON_BASE = 'https://ddragon.leagueoflegends.com';
const DEFAULT_ALLOWED_ORIGIN = 'http://localhost:5173';
const CACHE_TTL_SECONDS = 60 * 60;

const app = new Hono<WorkerApp>();

function resolveAllowedOrigin(requestOrigin: string | undefined, configured: string): string | null {
  if (!requestOrigin) return null;
  const allowed = configured.split(',').map((origin) => origin.trim()).filter(Boolean);
  return allowed.includes(requestOrigin) ? requestOrigin : null;
}

const restrictedCors: MiddlewareHandler<WorkerApp> = async (context, next) => {
  const requestOrigin = context.req.header('Origin');
  const allowedOrigin = resolveAllowedOrigin(
    requestOrigin,
    context.env.ALLOWED_ORIGIN || DEFAULT_ALLOWED_ORIGIN,
  );

  if (context.req.method === 'OPTIONS') {
    if (requestOrigin && !allowedOrigin) {
      return context.json({ error: 'Origin not allowed' }, 403);
    }

    return new Response(null, {
      status: 204,
      headers: {
        ...(allowedOrigin ? { 'Access-Control-Allow-Origin': allowedOrigin } : {}),
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '86400',
        Vary: 'Origin',
      },
    });
  }

  await next();

  if (allowedOrigin) {
    context.header('Access-Control-Allow-Origin', allowedOrigin);
  }
  context.header('Vary', 'Origin');
};

app.use('*', restrictedCors);

async function fetchCached(url: string, executionContext: BackgroundContext): Promise<Response> {
  const cache = caches.default;
  const cacheKey = new Request(url, { headers: { Accept: 'application/json' } });
  const cached = await cache.match(cacheKey);

  if (cached) {
    return cached;
  }

  const upstream = await fetch(cacheKey);
  if (!upstream.ok) {
    return upstream;
  }

  const headers = new Headers(upstream.headers);
  headers.set('Cache-Control', `public, max-age=${CACHE_TTL_SECONDS}`);
  const response = new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers,
  });

  executionContext.waitUntil(cache.put(cacheKey, response.clone()));
  return response;
}

async function latestVersion(executionContext: BackgroundContext): Promise<string> {
  const response = await fetchCached(
    `${DATA_DRAGON_BASE}/api/versions.json`,
    executionContext,
  );

  if (!response.ok) {
    throw new Error('Unable to resolve the latest Data Dragon version.');
  }

  const versions: unknown = await response.json();
  if (!Array.isArray(versions) || typeof versions[0] !== 'string') {
    throw new Error('Data Dragon returned an invalid version list.');
  }

  return versions[0];
}

function proxyResponse(response: Response, version: string): Response {
  const headers = new Headers(response.headers);
  headers.set('Content-Type', 'application/json; charset=utf-8');
  headers.set('X-Data-Dragon-Version', version);
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

app.get('/', (context) =>
  context.json({
    name: 'Cryptonicflux LOL Search API',
    source: 'Riot Games Data Dragon',
    endpoints: ['/champions', '/champions/:id'],
  }),
);

app.get('/champions', async (context) => {
  const version = await latestVersion(context.executionCtx);
  const response = await fetchCached(
    `${DATA_DRAGON_BASE}/cdn/${version}/data/en_US/champion.json`,
    context.executionCtx,
  );

  if (!response.ok) {
    return context.json({ error: 'Unable to load champions from Data Dragon.' }, 502);
  }

  return proxyResponse(response, version);
});

app.get('/champions/:id', async (context) => {
  const championId = context.req.param('id');
  if (!/^[A-Za-z0-9]+$/u.test(championId)) {
    return context.json({ error: 'Invalid champion identifier.' }, 400);
  }

  const version = await latestVersion(context.executionCtx);
  const response = await fetchCached(
    `${DATA_DRAGON_BASE}/cdn/${version}/data/en_US/champion/${encodeURIComponent(championId)}.json`,
    context.executionCtx,
  );

  if (response.status === 404) {
    return context.json({ error: 'Champion not found.' }, 404);
  }
  if (!response.ok) {
    return context.json({ error: 'Unable to load champion details from Data Dragon.' }, 502);
  }

  return proxyResponse(response, version);
});

app.notFound((context) => context.json({ error: 'Endpoint not found.' }, 404));

app.onError((_error, context) =>
  context.json({ error: 'The champion service encountered an unexpected error.' }, 500),
);

export default app;
