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

export const pileRouter = createTRPCRouter({

    get: protectedProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ ctx, input }) => {
            const pile = await ctx.db.pile.findUnique({
                where: {
                    id: input.id,
                },
                include: {
                    cubes: true,
                }
            });
            return pile;
        }),

    clearFloor: protectedProcedure
        .input(z.object({ id: z.string(), floor: z.number() }))
        .mutation(async ({ ctx, input }) => {
            const { id, floor } = input;

            await ctx.db.pileCube.updateMany({
                where: {
                    pileId: id,
                    y: floor,
                },
                data: {
                    active: false,
                },
            });

            // Then, decrease the y value of all active cubes above the cleared floor
            await ctx.db.pileCube.updateMany({
                where: {
                    pileId: id,
                    y: {
                        gt: floor,
                    },
                    active: true,
                },
                data: {
                    y: {
                        decrement: 1,
                    },
                },
            });

            await client.multi()
                .publish('events', JSON.stringify({ floor_removed: true}))
                .exec();

            return true;
        }),

    addRandomCube: protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const pile = await ctx.db.pile.findUnique({
                where: {
                    id: input.id,
                },
                include: {
                    game: true,
                    cubes: {
                        where: {
                            active: true,
                        },
                    },
                },
            });

            if (!pile) { throw new Error("Pile not found"); }

            const newCubes = [];
            for (let i = 0; i < 10; i++) {
                const positions = [];
                for (let x = 0; x < pile.game.width; x++) {
                    for (let y = 0; y < pile.game.height; y++) {
                        for (let z = 0; z < pile.game.depth; z++) {
                            const isOccupied = pile.cubes.some(cube => cube.x === x && cube.y === y && cube.z === z);
                            if (!isOccupied) {
                                positions.push({ x, y, z });
                            }
                        }
                    }
                }

                const randomIndex = Math.floor(Math.random() * positions.length);
                const randomPosition = positions[randomIndex];

                if (!randomPosition) { throw new Error("No random position found"); }

                const newCube = await ctx.db.pileCube.create({
                    data: {
                        x: randomPosition.x,
                        y: randomPosition.y,
                        z: randomPosition.z,
                        pileId: pile.id,
                    },
                });

                newCubes.push(newCube);
            }

            await client.multi()
                .publish('events', JSON.stringify({ new_random_cube: newCubes }))
                .exec();

            return newCubes;
        }),

});
