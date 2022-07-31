import * as trpcNext from '@trpc/server/adapters/next';
import { AppRouter, appRouter } from '@/backend/router';
import { inferProcedureOutput } from '@trpc/server';

export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: () => null,
});

export type inferQueryResponse<
  TRouteKey extends keyof AppRouter["_def"]["queries"]
> = inferProcedureOutput<AppRouter["_def"]["queries"][TRouteKey]>
