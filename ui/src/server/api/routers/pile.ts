import { z } from "zod";

import {
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
} from "~/server/api/trpc";

export const pileRouter = createTRPCRouter({

    get: protectedProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ ctx, input }) => {
            //console.log(ctx);
            console.log("input: ", input);
            const pile = await ctx.db.pile.findUnique({
                where: {
                    id: input.id,
                },
            });
            return pile;
        }),

});
