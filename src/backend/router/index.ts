import * as trpc from '@trpc/server';
import { z } from 'zod';
import { PokemonClient } from 'pokenode-ts';
import { prisma } from '@/backend/utils/prisma';

export const appRouter = trpc.router()
  .query('get-pokemon-by-id', {
    input: z.object({
      id: z.number(),
    }),
    async resolve({ input }) {
      const api = new PokemonClient();
      const { name, sprites } = await api.getPokemonById(input.id);
      return { name, sprites };
    },
  })
  .mutation('cast-vote', {
    input: z.object({
      voteFor: z.number(),
      voteAgainst: z.number(),
    }),
    async resolve({ input }) {
      const voteInDb = await prisma.vote.create({
        data: {
          ...input
        }
      });
      return {
        success: true,
      };
    }
  });

export type AppRouter = typeof appRouter;
