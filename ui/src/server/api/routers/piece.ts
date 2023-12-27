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
            // await ctx.db.piece.updateMany({
            //     where: {
            //         pileId: input.pile,
            //         active: true,
            //     },
            //     data: {
            //         active: false,
            //     },
            // });

            // const totalPieces = await ctx.db.library.count();
            // const randomIndex = Math.floor(Math.random() * totalPieces);
            // const randomLibraryPiece = await ctx.db.library.findMany({
            //     skip: randomIndex,
            //     take: 1
            // });

            // const piece = await ctx.db.piece.create({
            //     data: {
            //         active: true,
            //         library: { connect: { id: randomLibraryPiece[0]!.id } },
            //         pile: { connect: { id: input.pile } },
            //     },
            //     select: {
            //         id: true,
            //         pile: {
            //             select: {
            //                 id: true
            //             }
            //         },
            //         library: {
            //             select: {
            //                 id: true,
            //                 shape: true,
            //             }
            //         }
            //     }
            // });

            // interface Shape {
            //     x: number;
            //     y: number;
            //     z: number;
            // }

            // const cubes: string[] = [];

            // if (Array.isArray(piece.library.shape)) {
            //     for (const shape of piece.library.shape as unknown as Shape[]) {
            //         const new_cube = await ctx.db.pieceCube.create({
            //             data: {
            //                 x: shape.x,
            //                 y: shape.y,
            //                 z: shape.z,
            //                 pieceId: piece.id,
            //             },
            //         });
            //         cubes.push(new_cube.id);
            //     }
            // }

            // await ctx.db.piece.update({
            //     where: { id: piece.id },
            //     data: {
            //         cubeIds: cubes,
            //     },
            // });

            // await client.multi()
            //     .publish('events', JSON.stringify({ piece: true }))
            //     .exec();

            // return piece;
        }),

    get: protectedProcedure
        .input(z.object({ id: z.string()}))
        .query(async ({ ctx, input }) => {
            // const piece = await ctx.db.piece.findUnique({
            //     where: {
            //         id: input.id,
            //     },
            //     include: {
            //         pile: true,
            //         library: true,
            //         cubes: true,
            //     }
            // });

            // return piece;
        }),

    move: protectedProcedure
        .input(z.object({ id: z.string(), movement: z.object({ x: z.number(), y: z.number(), z: z.number(), pitch: z.number(), yaw: z.number(), roll: z.number() }) }))
        .mutation(async ({ ctx, input }) => {
            // const piece = await ctx.db.piece.findFirst({
            //     where: {
            //         id: input.id,
            //     },
            //     include: {
            //         pile: {
            //             include: {
            //                 cubes: {
            //                     where: {
            //                         active: true,
            //                     },
            //                 },
            //             },
            //         },
            //         library: true,
            //         cubes: true,
            //     }
            // });

            // const movements = await ctx.db.movement.findMany({
            //     where: {
            //         pieceId: input.id,
            //     },
            //     orderBy: {
            //         createdAt: 'desc',
            //     },
            // });

            // const orientation = new Quaternion();
            // orientation.setFromEuler(new Euler(0, 0, 0));

            // let totalPitch = input.movement.x, totalYaw = input.movement.y, totalRoll = input.movement.z;

            // for (let i = 0; i < movements.length; i++) {
            //     const movement = movements[i];

            //     if (movement!.pitch !== 0 || movement!.yaw !== 0 || movement!.roll !== 0) {
            //         console.log("This is a rotation");
            //         totalPitch += movement!.pitch;
            //         totalYaw += movement!.yaw;
            //         totalRoll += movement!.roll;
            //     }
            // }

            // Apply the accumulated rotations
            // if (totalPitch !== 0) {
            //     const rotation = new Quaternion().setFromAxisAngle(new Vector3(1, 0, 0), (Math.PI / 2) * totalPitch);
            //     orientation.multiply(rotation);
            // }
            // if (totalYaw !== 0) {
            //     const rotation = new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), (Math.PI / 2) * totalYaw);
            //     orientation.multiply(rotation);
            // }
            // if (totalRoll !== 0) {
            //     const rotation = new Quaternion().setFromAxisAngle(new Vector3(0, 0, 1), (Math.PI / 2) * totalRoll);
            //     orientation.multiply(rotation);
            // }


            // if (input.movement.x !== 0 || input.movement.y !== 0 || input.movement.z !== 0) {
            //     console.log("This is a translation");
            // } else if (input.movement.pitch !== 0 || input.movement.yaw !== 0 || input.movement.roll !== 0) {
            //     console.log("This is a rotation");
            //     if (input.movement.pitch !== 0) {
            //         const rotation = new Quaternion().setFromAxisAngle(new Vector3(1, 0, 0), Math.PI / 2);
            //         orientation.premultiply(rotation);
            //     } else if (input.movement.yaw !== 0) {
            //         const rotation = new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), Math.PI / 2);
            //         orientation.premultiply(rotation);
            //     } else if (input.movement.roll !== 0) {
            //         const rotation = new Quaternion().setFromAxisAngle(new Vector3(0, 0, 1), Math.PI / 2);
            //         orientation.premultiply(rotation);
            //     }
            // }

            // console.log("orientation: ", orientation);
            // console.log("piece?.library.shape: ", piece?.library.shape);

            // const shape = piece?.library.shape as unknown as { x: number, y: number, z: number}[];
            // const transformedShape = shape.map(point => {
            //     const vector = new Vector3(point.x, point.y, point.z);
            //     vector.applyQuaternion(orientation);
            //     const roundedVector = roundVector3(vector);
            //     return { x: roundedVector.x, y: roundedVector.y, z: roundedVector.z };
            // });

            // console.log("rotated shape: ", transformedShape);
            // console.log("piece?.cubeIds: ", piece?.cubeIds);

            // for (let i = 0; i < (piece?.cubeIds.length ?? 0); i++) {
            //     const cubeId = piece?.cubeIds[i];
            //     const shape = transformedShape[i];

            //     await ctx.db.pieceCube.update({
            //         where: { id: cubeId },
            //         data: {
            //             x: shape!.x,
            //             y: shape!.y,
            //             z: shape!.z,
            //         },
            //     });
            // }

            // await ctx.db.movement.create({
            //     data: {
            //         x: input.movement.x,
            //         y: input.movement.y,
            //         z: input.movement.z,
            //         pitch: input.movement.pitch,
            //         yaw: input.movement.yaw,
            //         roll: input.movement.roll,
            //         pieceId: input.id,
            //     },
            // });

            console.log("\n\n");

            // await client.multi()
            //     .publish('events', JSON.stringify({ piece: true }))
            //     .exec();

        }),

});
