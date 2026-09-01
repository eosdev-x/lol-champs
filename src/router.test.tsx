import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createMemoryHistory, RouterProvider } from '@tanstack/react-router';
import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createAppRouter } from './router';
import { ahriDetail } from './test/fixtures';

describe('champion detail route', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('renders a deep-linked champion from the proxied response', async () => {
    const fetchMock = vi.fn(() =>
      Promise.resolve(
        new Response(
          JSON.stringify({
            type: 'champion',
            format: 'standAloneComplex',
            version: '15.17.1',
            data: { Ahri: ahriDetail },
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      ),
    );
    vi.stubGlobal('fetch', fetchMock);

    const history = createMemoryHistory({ initialEntries: ['/champion/Ahri'] });
    const router = createAppRouter(history);
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>,
    );

    expect(await screen.findByRole('heading', { name: 'Ahri', level: 1 })).toBeInTheDocument();
    expect(screen.getByText('the Nine-Tailed Fox')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Orb of Deception' })).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledOnce();
  });
});
