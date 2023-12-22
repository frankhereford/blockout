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
            console.log("pile input!: ", input);
            const pile = await ctx.db.pile.findUnique({
                where: {
                    id: input.id,
                },
            });
            console.log("pile: ", pile);
            return pile;
        }),


    addRandomCube: protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
            //console.log("addRandomCube input!: ", input);
            const pile = await ctx.db.pile.findUnique({
                where: {
                    id: input.id,
                },
                include: {
                    game: true,
                    cubes: true,
                },
            });
            //console.log("found pile: ", pile);

            if (!pile) {
                throw new Error("Pile not found");
            }

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

            // Pick a random position
            const randomIndex = Math.floor(Math.random() * positions.length);
            const randomPosition = positions[randomIndex];

            //console.log("Random position: ", randomPosition);

            if (!randomPosition) {
                throw new Error("No random position found");
            }

            // Insert the new cube into the cubes table
            const newCube = await ctx.db.cube.create({
                data: {
                    x: randomPosition.x,
                    y: randomPosition.y,
                    z: randomPosition.z,
                    pileId: pile.id, // Use the pile id from the pile query
                },
            });
            //console.log("New cube: ", newCube);
            return newCube;
        }),

});
