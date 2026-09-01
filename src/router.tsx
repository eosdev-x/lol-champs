import {
  createBrowserHistory,
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router';
import { App } from './App';
import { ChampionDetailPage } from './pages/ChampionDetailPage';
import { HomePage } from './pages/HomePage';

const rootRoute = createRootRoute({ component: App });

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const championRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/champion/$id',
  component: ChampionDetailPage,
});

const routeTree = rootRoute.addChildren([indexRoute, championRoute]);
type MemoryHistory = ReturnType<typeof createMemoryHistory>;

export function createAppRouter(
  history: MemoryHistory = createBrowserHistory(),
) {
  return createRouter({
    routeTree,
    history,
    defaultPreload: 'intent',
    scrollRestoration: true,
  });
}

export const router = createAppRouter();

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
