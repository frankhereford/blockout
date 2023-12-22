import { z } from "zod";

import {
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
} from "~/server/api/trpc";

export const gameRouter = createTRPCRouter({

    create: protectedProcedure
        .input(z.object({ width: z.number(), height: z.number(), depth: z.number() }))
        .mutation(async ({ ctx, input }) => {
            //console.log(ctx);
            console.log("input: ", input);
            const game = await ctx.db.game.create({
                data: {
                    height: input.height,
                    width: input.width,
                    depth: input.depth,
                    user: { connect: { id: ctx.session.user.id } },
                    pile: {
                        create: {}
                    },
                },
                select: {
                    id: true,
                    pile: {
                        select: {
                            id: true
                        }
                    }
                }
            });
            console.log("game: ", game)
            return game;
        }),

    get: protectedProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ ctx, input }) => {
            //console.log(ctx);
            console.log("input: ", input);
            const game = await ctx.db.game.findUnique({
                where: {
                    id: input.id,
                },
                include: {
                    pile: true, // Include the pile relation
                },
            });
            return game;
        }),

});
