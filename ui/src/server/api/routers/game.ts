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
            return ctx.db.game.create({
                data: {
                    height: input.height,
                    width: input.width,
                    depth: input.depth,
                    user: { connect: { id: ctx.session.user.id } },
                },
            });
        }),

});
