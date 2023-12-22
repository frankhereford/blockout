import { z } from "zod";

import {
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
} from "~/server/api/trpc";

export const gameRouter = createTRPCRouter({

    create: protectedProcedure
        .input(z.object({  }))
        .mutation(async ({ ctx, input }) => {
            return ctx.db.game.create({
                data: {
                    user: { connect: { id: ctx.session.user.id } },
                },
            });
        }),

});
