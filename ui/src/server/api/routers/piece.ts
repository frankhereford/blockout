import { z } from "zod";

import {
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
} from "~/server/api/trpc";

import { createClient } from "redis";

const client = createClient({
    url: 'redis://redis'
});

client.on('error', (err) => console.log('Redis Client Error', err));

await client.connect();

export const pieceRouter = createTRPCRouter({

    create: protectedProcedure
        .input(z.object({ pile: z.string() }))
        .mutation(async ({ ctx, input }) => {
            await ctx.db.piece.updateMany({
                where: {
                    pileId: input.pile,
                    active: true,
                },
                data: {
                    active: false,
                },
            });

            const totalPieces = await ctx.db.library.count();
            const randomIndex = Math.floor(Math.random() * totalPieces);
            const randomLibraryPiece = await ctx.db.library.findMany({
                skip: randomIndex,
                take: 1
            });

            const piece = await ctx.db.piece.create({
                data: {
                    active: true,
                    library: { connect: { id: randomLibraryPiece[0]!.id } },
                    pile: { connect: { id: input.pile } },
                },
                select: {
                    id: true,
                    pile: {
                        select: {
                            id: true
                        }
                    },
                    library: {
                        select: {
                            id: true,
                            shape: true,
                        }
                    }
                }
            });

            interface Shape {
                x: number;
                y: number;
                z: number;
            }

            if (Array.isArray(piece.library.shape)) {
                for (const shape of piece.library.shape as unknown as Shape[]) {
                    console.log("shape: ", shape)
                    await ctx.db.pieceCube.create({
                        data: {
                            x: shape.x,
                            y: shape.y,
                            z: shape.z,
                            pieceId: piece.id,
                        },
                    });
                }
            }

            await client.multi()
                .publish('events', JSON.stringify({ piece_added: piece.id }))
                .exec();

            return piece;
        }),

    get: protectedProcedure
        .input(z.object({ pile: z.string()}))
        .query(async ({ ctx, input }) => {
            const piece = await ctx.db.piece.findFirst({
                where: {
                    active: true,
                    pileId: input.pile,
                },
                include: {
                    pile: true,
                    library: true,
                    cubes: true,
                }
            });

            return piece;
        }),
});
