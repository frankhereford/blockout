/* eslint-disable @typescript-eslint/prefer-for-of */
import { z } from "zod";

import {
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
} from "~/server/api/trpc";

import { Quaternion, Euler, Vector3 } from 'three';

import { createClient } from "redis";

import type { Piece, Pile, Library, Movement, PieceCube, Game, PileCube } from '@prisma/client';

interface ExtendedPiece extends Piece {
    pile: Pile & {
        game: Game;
        cubes: PileCube[];
    };
    library: Library;
    movements: Movement[];
    cubes: PieceCube[];
}

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

interface Origin {
    x: number;
    y: number;
    z: number;
}

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

            //console.log("game", game);

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

            interface Shape {
                x: number;
                y: number;
                z: number;
            }

            if (Array.isArray(piece.library.shape)) {
                for (const shape of piece.library.shape as unknown as Shape[]) {
                    const origin = piece.library.origin as unknown as Origin;
                    const isOrigin = JSON.stringify(origin) === JSON.stringify(shape)
                    await ctx.db.pieceCube.create({
                        data: {
                            isOrigin: isOrigin,
                            x: shape.x,  // + (game!.game.width / 2) - 0.5 - origin.x,
                            y: shape.y,  // + (game!.game.height - 1) - origin.y,
                            z: shape.z,  // + (game!.game.depth / 2) - 0.5 - origin.z,
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

                    const piece = await prisma.piece.findUnique({
                        where: {
                            id: input.id,
                        },
                        include: {
                            pile: {
                                include: {
                                    game: true,
                                    cubes: true,
                                },
                            },
                            library: true,
                            movements: {
                                orderBy: {
                                    serial: 'asc',
                                },
                            },
                            cubes: true,
                        },
                    });

                    if (!piece) { return; }

                    piece.movements.push({
                        id: 'pending',
                        pieceId: input.id,
                        serial: piece.movements.length,
                        x: input.movement.x,
                        y: input.movement.y,
                        z: input.movement.z,
                        pitch: input.movement.pitch,
                        yaw: input.movement.yaw,
                        roll: input.movement.roll,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    });


                    const originCube = piece.cubes.find(cube => cube.isOrigin === true);

                    const relativeX = 0 - originCube!.x;
                    const relativeY = 0 - originCube!.y;
                    const relativeZ = 0 - originCube!.z;

                    // adjust the cubes in the piece object back to the origin
                    for (const cube of piece.cubes) {
                        cube.x += relativeX;
                        cube.y += relativeY;
                        cube.z += relativeZ;
                    }

                    // rotate the piece object
                    const rotation = new Quaternion().setFromAxisAngle(new Vector3(input.movement.pitch, input.movement.yaw, input.movement.roll), Math.PI / 2);
                    
                    for (const cube of piece.cubes) {
                        const cubePosition = new Vector3(cube.x, cube.y, cube.z);
                        cubePosition.applyQuaternion(rotation);
                        const roundedCubePosition = roundVector3(cubePosition); // handles floating point noise

                        cube.x = roundedCubePosition.x;
                        cube.y = roundedCubePosition.y;
                        cube.z = roundedCubePosition.z;
                    }

                    // undo the origin-ification
                    for (const cube of piece.cubes) {
                        cube.x -= relativeX;
                        cube.y -= relativeY;
                        cube.z -= relativeZ;
                    }

                    // add the movement we just received to the piece object
                    for (const cube of piece.cubes) {
                        cube.x += input.movement.x;
                        cube.y += input.movement.y;
                        cube.z += input.movement.z;
                    }

                    //console.log("piece: ", piece);

                    function isPieceWithinBounds(piece: ExtendedPiece) {
                        for (const cube of (piece.cubes)) {
                            if (cube.x < 0 || cube.x >= piece.pile.game.width ||
                                cube.y < 0 || // we're cool with the ceiling
                                cube.z < 0 || cube.z >= piece.pile.game.depth) {
                                return false;
                            }
                        }
                        return true;
                    }

                    const isWithinBounds = isPieceWithinBounds(piece);
                    //console.log(`Is the piece within bounds? ${isWithinBounds}`);
                    if (!isWithinBounds) {
                        return;
                    }

                    function isPieceOverlappingPile(piece: ExtendedPiece) {
                        for (const pieceCube of piece.cubes) {
                            for (const pileCube of piece.pile.cubes) {
                                if (pileCube.active && 
                                    pieceCube.x === pileCube.x &&
                                    pieceCube.y === pileCube.y &&
                                    pieceCube.z === pileCube.z) {
                                    return true;
                                }
                            }
                        }
                        return false;
                    }

                    const isOverlapping = isPieceOverlappingPile(piece);
                    //console.log(`Is the piece overlapping the pile? ${isOverlapping}`);
                    if (isOverlapping) {
                        return;
                    }

                    // ! writing starts here

                    for (const cube of piece.cubes) {
                        await prisma.pieceCube.update({
                            where: { id: cube.id },
                            data: {
                                x: cube.x,
                                y: cube.y,
                                z: cube.z
                            }
                        });
                    }

                    const maxSerialNumber = await prisma.movement.aggregate({
                        where: {
                            pieceId: input.id,
                        },
                        _max: {
                            serial: true,
                        },
                    });

                    const nextSerialNumber: number = (maxSerialNumber._max.serial !== null ? maxSerialNumber._max.serial + 1 : 0);

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
