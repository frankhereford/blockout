/* eslint-disable @typescript-eslint/prefer-for-of */
import { z } from "zod";

import {
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
} from "~/server/api/trpc";

import { Quaternion, Euler, Vector3 } from 'three';

import { createClient } from "redis";

const client = createClient({
    url: 'redis://redis'
});

client.on('error', (err) => console.log('Redis Client Error', err));

await client.connect();

const roundVector3 = (vector: Vector3): Vector3 => {
    return new Vector3(
        Math.round(vector.x),
        Math.round(vector.y),
        Math.round(vector.z)
    );
};

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

            const game = await ctx.db.pile.findUnique({
                where: {
                    id: input.pile,
                },
                select: {
                    game: true,
                },
            }); 

            console.log("game", game);

            const piece = await ctx.db.piece.create({
                data: {
                    active: true,
                    library: { connect: { id: randomLibraryPiece[0]!.id } },
                    pile: { connect: { id: input.pile } },
                },
                select: {
                    id: true,
                    library: {
                        select: {
                            id: true,
                            shape: true,
                            origin: true,
                        }
                    }
                }
            });

            console.log("piece", piece);

            interface Shape {
                x: number;
                y: number;
                z: number;
            }

            interface Origin {
                x: number;
                y: number;
                z: number;
            }

            if (Array.isArray(piece.library.shape)) {
                for (const shape of piece.library.shape as unknown as Shape[]) {
                    const origin = piece.library.origin as unknown as Origin;
                    await ctx.db.pieceCube.create({
                        data: {
                            x: shape.x + (game!.game.width / 2) - origin.x,
                            y: shape.y + (game!.game.height - 1) - origin.y,
                            z: shape.z + (game!.game.depth / 2) - origin.z,
                            pieceId: piece.id,
                        },
                    });
                }
            }

            await client.multi()
                .publish('events', JSON.stringify({ piece: true }))
                .exec();

            return piece;
        }),

    get: protectedProcedure
        .input(z.object({ id: z.string()}))
        .query(async ({ ctx, input }) => {
            const piece = await ctx.db.piece.findUnique({
                where: {
                    id: input.id,
                },
                include: {
                    pile: true,
                    library: true,
                    cubes: true,
                }
            });

            return piece;
        }),

    move: protectedProcedure
        .input(z.object({ id: z.string(), movement: z.object({ x: z.number(), y: z.number(), z: z.number(), pitch: z.number(), yaw: z.number(), roll: z.number() }) }))
        .mutation(async ({ ctx, input }) => {
            const prisma = ctx.db;

            function executeMove(input: { movement: { x: number; y: number; z: number; pitch: number; yaw: number; roll: number; }; id: string; }) {
                return prisma.$transaction(async (prisma) => {
                    console.log("in executeMove");
                    console.log("input", input);

                    const maxSerialNumber = await prisma.movement.aggregate({
                        where: {
                            pieceId: input.id,
                        },
                        _max: {
                            serial: true,
                        },
                    });

                    const nextSerialNumber: number = (maxSerialNumber._max.serial !== null ? maxSerialNumber._max.serial + 1 : 0) as number;

                    await prisma.movement.create({
                        data: {
                            pieceId: input.id,
                            serial: nextSerialNumber,
                            x: input.movement.x,
                            y: input.movement.y,
                            z: input.movement.z,
                            pitch: input.movement.pitch,
                            yaw: input.movement.yaw,
                            roll: input.movement.roll,
                        },
                    });

                });
            }

            await executeMove(input);

            await client.multi()
                .publish('events', JSON.stringify({ piece: true }))
                .exec();

        }),

});
