import { z } from "zod";

import {
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
} from "~/server/api/trpc";

import { createPiece } from "~/server/api/routers/piece";

export const gameRouter = createTRPCRouter({
    create: publicProcedure
        .input(
            z.object({
                width: z.number(),
                height: z.number(),
                depth: z.number(),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const game = await ctx.db.game.create({
                data: {
                    height: input.height,
                    width: input.width,
                    depth: input.depth,
                    pile: {
                        create: {},
                    },
                },
                select: {
                    id: true,
                    pile: {
                        select: {
                            id: true,
                        },
                    },
                },
            });

            await createPiece(ctx, { pile: game.pile!.id });

            return game;
        }),

    get: publicProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ ctx, input }) => {
            const game = await ctx.db.game.findUnique({
                where: {
                    id: input.id,
                },
                include: {
                    pile: {
                        include: {
                            pieces: true,
                        },
                    },
                },
            });

            if (game?.pile?.pieces) {
                game.pile.pieces = game.pile.pieces.filter(
                    (piece) => piece.active,
                );
            }

            return game;
        }),
});
