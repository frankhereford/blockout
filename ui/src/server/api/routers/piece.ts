/* eslint-disable @typescript-eslint/prefer-for-of */
import { z } from "zod";

import {
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
} from "~/server/api/trpc";

import { Quaternion, Vector3 } from "three";

import type {
    Piece,
    Pile,
    Library,
    Movement,
    PieceCube,
    Game,
    PileCube,
    Prisma,
    PrismaClient,
} from "@prisma/client";
import type { DefaultArgs } from "@prisma/client/runtime/library";

interface ExtendedPiece extends Piece {
    pile: Pile & {
        game: Game;
        cubes: PileCube[];
    };
    library: Library;
    movements: Movement[];
    cubes: PieceCube[];
}

const roundVector3 = (vector: Vector3): Vector3 => {
    return new Vector3(
        Math.round(vector.x),
        Math.round(vector.y),
        Math.round(vector.z),
    );
};

interface Origin {
    x: number;
    y: number;
    z: number;
}

export async function createPiece(
    ctx: {
        db: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>;
    },
    input: { pile: string },
) {
    const pile = await ctx.db.pile.findUnique({
        where: {
            id: input.pile,
        },
        include: {
            game: true,
        },
    });

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
        take: 1,
    });

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
                },
            },
        },
    });

    interface Shape {
        x: number;
        y: number;
        z: number;
    }

    if (Array.isArray(piece.library.shape)) {
        for (const shape of piece.library.shape as unknown as Shape[]) {
            const origin = piece.library.origin as unknown as Origin;
            const isOrigin = JSON.stringify(origin) === JSON.stringify(shape);
            await ctx.db.pieceCube.create({
                data: {
                    isOrigin: isOrigin,
                    x: shape.x + pile!.game.width / 2 - 0.5 - origin.x,
                    y: shape.y + (pile!.game.height - 1) - origin.y,
                    z: shape.z + pile!.game.depth / 2 - 0.5 - origin.z,
                    pieceId: piece.id,
                },
            });
        }
    }

    return piece;
}

function isPieceWithinBounds(piece: ExtendedPiece) {
    for (const cube of piece.cubes) {
        if (
            cube.x < 0 ||
            cube.x >= piece.pile.game.width ||
            cube.y < 0 || // we're cool with the ceiling
            cube.z < 0 ||
            cube.z >= piece.pile.game.depth
        ) {
            return false;
        }
    }
    return true;
}

function isPieceOverlappingPile(piece: ExtendedPiece) {
    for (const pieceCube of piece.cubes) {
        for (const pileCube of piece.pile.cubes) {
            if (
                pileCube.active &&
                pieceCube.x === pileCube.x &&
                pieceCube.y === pileCube.y &&
                pieceCube.z === pileCube.z
            ) {
                return true;
            }
        }
    }
    return false;
}

export const pieceRouter = createTRPCRouter({
    create: publicProcedure
        .input(z.object({ pile: z.string() }))
        .mutation(async ({ ctx, input }) => {
            return createPiece(ctx, input);
        }),

    get: publicProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ ctx, input }) => {
            const piece = await ctx.db.piece.findUnique({
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
                    cubes: true,
                },
            });

            return piece;
        }),

    move: publicProcedure
        .input(
            z.object({
                id: z.string(),
                drop: z.boolean(),
                movement: z.object({
                    x: z.number(),
                    y: z.number(),
                    z: z.number(),
                    pitch: z.number(),
                    yaw: z.number(),
                    roll: z.number(),
                }),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const prisma = ctx.db;

            function executeMove(input: {
                movement: {
                    x: number;
                    y: number;
                    z: number;
                    pitch: number;
                    yaw: number;
                    roll: number;
                };
                drop: boolean;
                id: string;
            }) {
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
                                    serial: "asc",
                                },
                            },
                            cubes: true,
                        },
                    });

                    if (!piece) {
                        return;
                    }

                    piece.movements.push({
                        id: "pending", // many of these are not used, just here to fit the typing
                        pieceId: input.id,
                        serial: piece.movements.length,
                        drop: input.drop,
                        x: input.movement.x,
                        y: input.movement.y,
                        z: input.movement.z,
                        pitch: input.movement.pitch,
                        yaw: input.movement.yaw,
                        roll: input.movement.roll,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    });

                    const originCube = piece.cubes.find(
                        (cube) => cube.isOrigin === true,
                    );

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
                    const rotation = new Quaternion().setFromAxisAngle(
                        new Vector3(
                            input.movement.pitch,
                            input.movement.yaw,
                            input.movement.roll,
                        ),
                        Math.PI / 2,
                    );

                    for (const cube of piece.cubes) {
                        const cubePosition = new Vector3(
                            cube.x,
                            cube.y,
                            cube.z,
                        );
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

                    if (input.drop) {
                        let canMoveDown = true;
                        while (canMoveDown) {
                            // Try to move the piece down
                            for (const cube of piece.cubes) {
                                cube.y -= 1;
                            }

                            // Check if the piece is still within bounds and not overlapping
                            const isWithinBounds = isPieceWithinBounds(piece);
                            const isOverlapping = isPieceOverlappingPile(piece);

                            if (!isWithinBounds || isOverlapping) {
                                // this is to try to get that hint of movement when you stick a piece down
                                for (const cube of piece.cubes) {
                                    await prisma.pieceCube.update({
                                        where: { id: cube.id },
                                        data: {
                                            x: cube.x,
                                            y: cube.y,
                                            z: cube.z,
                                        },
                                    });
                                }

                                canMoveDown = false;
                            }
                        }
                    }

                    const isWithinBounds = isPieceWithinBounds(piece);
                    //console.log(`Is the piece within bounds? ${isWithinBounds}`);

                    const isOverlapping = isPieceOverlappingPile(piece);
                    //console.log(`Is the piece overlapping the pile? ${isOverlapping}`);

                    if (( // moving down but bumping into something
                        input.movement.y < 0 &&
                        (!isWithinBounds || isOverlapping)
                    ) || input.drop) {
                        for (const cube of piece.cubes) {
                            await prisma.pileCube.create({
                                data: {
                                    x: cube.x,
                                    y: cube.y + 1,
                                    z: cube.z,
                                    pileId: piece.pile.id,
                                    active: true,
                                },
                            });
                        }

                        let reward = 0
                        const pieceFinalPlaceHighestY = Math.max(...piece.cubes.map(cube => cube.y + 1));
                        const boardFinalPlaceHighestY = await prisma.pileCube.aggregate({
                            where: {
                                pileId: piece.pile.id,
                                active: true,
                            },
                            _max: {
                                y: true,
                            },
                        });

                        const pieceFinalPlaceScore = 1 * ((-1 * pieceFinalPlaceHighestY) + piece.pile.game.height);
                        const boardFinalPlaceScore = 3 * ((-1 * boardFinalPlaceHighestY._max.y!) + piece.pile.game.height);

                        reward += pieceFinalPlaceScore;
                        reward += boardFinalPlaceScore;

                        console.log("\n");
                        console.log("Piece's highest Y: ", pieceFinalPlaceHighestY);
                        console.log("Board's highest Y: ", boardFinalPlaceHighestY._max.y);
                        console.log("Game Height: ", piece.pile.game.height);
                        console.log("Piece's final place score: ", pieceFinalPlaceScore);
                        console.log("Board's final place score: ", boardFinalPlaceScore);
                        console.log("Reward: ", reward);
                        console.log("\n");

                        // ! this is so ugly - duped code! see below
                        const maxSerialNumber = await prisma.movement.aggregate({
                            where: {
                                pieceId: input.id,
                            },
                            _max: {
                                serial: true,
                            },
                        });

                        const nextSerialNumber: number =
                            maxSerialNumber._max.serial !== null
                                ? maxSerialNumber._max.serial + 1
                                : 0;

                        await prisma.movement.create({
                            data: {
                                pieceId: input.id,
                                serial: nextSerialNumber,
                                drop: input.drop,
                                x: input.movement.x,
                                y: input.movement.y,
                                z: input.movement.z,
                                pitch: input.movement.pitch,
                                yaw: input.movement.yaw,
                                roll: input.movement.roll,
                            },
                        });
                        // ! clean up above here

                        await createPiece(ctx, { pile: piece.pile.id });

                        return reward; // created a new piece after a drop
                    }

                    if (!isWithinBounds) {
                        return -50; // bumped into the wall
                    }

                    if (isOverlapping) {
                        return -50; // bumped into the pile
                    }

                    // ! writing starts here

                    for (const cube of piece.cubes) {
                        await prisma.pieceCube.update({
                            where: { id: cube.id },
                            data: {
                                x: cube.x,
                                y: cube.y,
                                z: cube.z,
                            },
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

                    const nextSerialNumber: number =
                        maxSerialNumber._max.serial !== null
                            ? maxSerialNumber._max.serial + 1
                            : 0;

                    await prisma.movement.create({
                        data: {
                            pieceId: input.id,
                            serial: nextSerialNumber,
                            drop: input.drop,
                            x: input.movement.x,
                            y: input.movement.y,
                            z: input.movement.z,
                            pitch: input.movement.pitch,
                            yaw: input.movement.yaw,
                            roll: input.movement.roll,
                        },
                    });


                    let reward = 0
                    const pieceFinalPlaceHighestY = Math.max(...piece.cubes.map(cube => cube.y + 1));
                    const boardFinalPlaceHighestY = await prisma.pileCube.aggregate({
                        where: {
                            pileId: piece.pile.id,
                            active: true,
                        },
                        _max: {
                            y: true,
                        },
                    });

                    const pieceFinalPlaceScore = 1 * ((-1 * pieceFinalPlaceHighestY) + piece.pile.game.height);
                    const boardFinalPlaceScore = 3 * ((-1 * boardFinalPlaceHighestY._max.y!) + piece.pile.game.height);

                    reward += pieceFinalPlaceScore;
                    reward += boardFinalPlaceScore;
                    reward -= 10;

                    console.log("\n");
                    console.log("Piece's highest Y: ", pieceFinalPlaceHighestY);
                    console.log("Board's highest Y: ", boardFinalPlaceHighestY._max.y);
                    console.log("Game Height: ", piece.pile.game.height);
                    console.log("Piece's final place score: ", pieceFinalPlaceScore);
                    console.log("Board's final place score: ", boardFinalPlaceScore);
                    console.log("Reward: ", reward);
                    console.log("\n");


                    return reward; // moved successfully
                });
            }

            let move_reward = await executeMove(input) ?? 0;
            //console.log("\n\move_reward: ", move_reward);


            // we're always going to be here, calculate the state and score.

            const pieceWithPile = await prisma.piece.findUnique({
                where: {
                    id: input.id,
                },
                select: {
                    pileId: true,
                },
            });

            const activePieces = await prisma.piece.findMany({
                where: {
                    pileId: pieceWithPile?.pileId,
                    active: true,
                },
            });

            const piece = await prisma.piece.findUnique({
                where: {
                    id: activePieces[0]!.id,
                },
                include: {
                    pile: {
                        include: {
                            game: true,
                            cubes: true,
                        },
                    },
                    cubes: true,
                },
            });

            if (!piece) { return; } // for typing

            // Create a 3D array to represent the game space
            const gameSpace = new Array(piece.pile.game.height)
                .fill(0)
                .map(() =>
                    new Array(piece.pile.game.width).fill(0).map(() =>
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                        new Array(piece.pile.game.depth).fill(false),
                    ),
                );

            // Fill the game space with the active cubes
            for (const cube of piece.pile.cubes) {
                if (cube.active) {
                    if (gameSpace[cube.y]?.[cube.x] !== undefined) {
                        gameSpace[cube.y]![cube.x]![cube.z] = true;
                    }
                }
            }

            // Find the Y values where there is a full set of active pieces in every X,Z pair
            const fullYValues = [];
            for (let y = 0; y < piece.pile.game.height; y++) {
                let isFull = true;
                for (let x = 0; x < piece.pile.game.width; x++) {
                    for (let z = 0; z < piece.pile.game.depth; z++) {
                        if (!gameSpace[y]![x]![z]) {
                            isFull = false;
                            break;
                        }
                    }
                    if (!isFull) {
                        break;
                    }
                }
                if (isFull) {
                    fullYValues.push(y);
                }
            }

            move_reward += fullYValues.length * 50;

            // Sort the fullYValues array in descending order
            fullYValues.sort((a, b) => b - a);

            // Iterate over the fullYValues array
            let gameScore = piece.pile.game.score;
            for (const y of fullYValues) {
                // Do something with y
                //console.log("Removing Floor: ", y);

                const updatedGame = await ctx.db.game.update({
                    where: {
                        id: piece.pile.game.id,
                    },
                    data: {
                        score: {
                            increment: 1,
                        },
                    },
                    select: {
                        score: true,
                    },
                });

                gameScore = updatedGame.score;

                await ctx.db.pileCube.updateMany({
                    where: {
                        pileId: piece.pile.id,
                        y: y,
                    },
                    data: {
                        active: false,
                    },
                });

                // Then, decrease the y value of all active cubes above the cleared floor
                await ctx.db.pileCube.updateMany({
                    where: {
                        pileId: piece.pile.id,
                        y: {
                            gt: y,
                        },
                        active: true,
                    },
                    data: {
                        y: {
                            decrement: 1,
                        },
                    },
                });
            }

            const game_result = !piece.cubes.some(cube1 => // true if over
                piece.pile.cubes.some(cube2 =>
                    cube1.x === cube2.x && cube1.y === cube2.y && cube1.z === cube2.z
                )
            );

            move_reward += game_result ? 0 : -100;

            const result = { game_result, move_reward, gameScore };
            console.log("\nmove result: ", result, "\n");

            return result;
        }),
});
