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

            const cubes: string[] = [];

            if (Array.isArray(piece.library.shape)) {
                for (const shape of piece.library.shape as unknown as Shape[]) {
                    const new_cube = await ctx.db.pieceCube.create({
                        data: {
                            x: shape.x,
                            y: shape.y,
                            z: shape.z,
                            pieceId: piece.id,
                        },
                    });
                    cubes.push(new_cube.id);
                }
            }

            await ctx.db.piece.update({
                where: { id: piece.id },
                data: {
                    cubeIds: cubes,
                },
            });

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
            const piece = await ctx.db.piece.findFirst({
                where: {
                    id: input.id,
                },
                include: {
                    pile: {
                        include: {
                            cubes: {
                                where: {
                                    active: true,
                                },
                            },
                        },
                    },
                    library: true,
                    cubes: true,
                }
            });

            const movements = await ctx.db.movement.findMany({
                where: {
                    pieceId: input.id,
                },
            });

            const totalMovements = movements.reduce((total, movement) => {
                return {
                    x: total.x + movement.x,
                    y: total.y + movement.y,
                    z: total.z + movement.z,
                    pitch: total.pitch + movement.pitch,
                    yaw: total.yaw + movement.yaw,
                    roll: total.roll + movement.roll,
                };
            }, { x: 0, y: 0, z: 0, pitch: 0, yaw: 0, roll: 0 });

            const newTotalMovements = {
                x: totalMovements.x + input.movement.x,
                y: totalMovements.y + input.movement.y,
                z: totalMovements.z + input.movement.z,
                pitch: totalMovements.pitch + input.movement.pitch,
                yaw: totalMovements.yaw + input.movement.yaw,
                roll: totalMovements.roll + input.movement.roll,
            };

            const shape = piece!.library.shape as unknown as { x: number, y: number, z: number }[];
            console.log("\n\n"); 
            console.log("ids", piece?.cubeIds)
            console.log("shape", shape);
            console.log("origin: ", piece?.library.origin)
            console.log("newTotalMovements", newTotalMovements);
            
            //example shape: [ { x: 0, y: 0, z: 0 }, { x: 1, y: 0, z: 0 }, { x: 2, y: 0, z: 0 } ]
            
            // Create a quaternion from the pitch, yaw, and roll values
            const quaternion = new Quaternion();
            quaternion.setFromEuler(new Euler(newTotalMovements.pitch * Math.PI / 2, newTotalMovements.yaw * Math.PI / 2, newTotalMovements.roll * Math.PI / 2, 'XYZ'));

            for (let index = 0; index < shape.length; index++) {
                const cube = shape[index];
                const vector = new Vector3(cube!.x, cube!.y, cube!.z);

                // Apply the quaternion rotation to the vector
                vector.applyQuaternion(quaternion);

                const roundedVector = roundVector3(vector);

                console.log("vector", roundedVector);

                // Update the cube with the rotated vector
                await ctx.db.pieceCube.update({
                    where: { id: piece!.cubes[index]!.id },
                    data: {
                        x: roundedVector.x + newTotalMovements.x,
                        y: roundedVector.y + newTotalMovements.y,
                        z: roundedVector.z + newTotalMovements.z,
                    },
                });
            }


            console.log("\n\n");



            // for (let index = 0; index < shape.length; index++) {
            //     const cube = shape[index];
            //     const x = cube!.x + newTotalMovements.x;
            //     const y = cube!.y + newTotalMovements.y;
            //     const z = cube!.z + newTotalMovements.z;
                
            //     await ctx.db.pieceCube.update({
            //         where: { id: piece!.cubes[index]!.id },
            //         data: {
            //             x: x,
            //             y: y,
            //             z: z,
            //         },
            //     });
            // }

            await ctx.db.movement.create({
                data: {
                    x: input.movement.x,
                    y: input.movement.y,
                    z: input.movement.z,
                    pitch: input.movement.pitch,
                    yaw: input.movement.yaw,
                    roll: input.movement.roll,
                    pieceId: input.id,
                },
            });

            await client.multi()
                .publish('events', JSON.stringify({ piece: true }))
                .exec();

        }),

});
