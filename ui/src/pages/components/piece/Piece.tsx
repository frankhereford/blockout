import { Cube } from "./Cube";
import { GhostCube } from "./GhostCube";
import { Vector3 } from "three";
import { useEffect, useState } from "react";

import { api } from "~/utils/api";

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import type {
    Piece,
    Pile,
    Library,
    Movement,
    PieceCube,
    Game,
    PileCube,
} from "@prisma/client";

interface ExtendedPiece extends Piece {
    pile: Pile & {
        game: Game;
        cubes: PileCube[];
    };
    library: Library;
    movements: Movement[];
    cubes: PieceCube[];
}

interface PieceProps {
    id: string;
}

interface Cube {
    id: string;
    color: string;
    x: number;
    y: number;
    z: number;
}

function isPieceWithinBounds(piece: ExtendedPiece) {
    for (const cube of piece.cubes) {
        if (
            cube.x < 0 ||
            cube.x >= piece.pile.game.width ||
            cube.y < 0 ||
            // we're cool with the ceiling, so we don't check for it here
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



const Piece = ({ id }: PieceProps) => {
    const getPiece = api.piece.get.useQuery(
        { id: id },
        { enabled: id !== undefined },
    );
    const [cubeState, setCubeState] = useState<Record<string, Cube>>({});
    const [ghostState, setGhostState] = useState<Record<string, Cube>>({});

    useEffect(() => {
        const websocket = new WebSocket("ws://localhost:3001/ws");
        websocket.onopen = () => { console.log("WebSocket Connected"); };
        websocket.onmessage = (event) => {
            const data = JSON.parse(event.data as string) as object;
            if ((data as { piece: boolean }).piece) { void getPiece.refetch(); }
        };
        websocket.onerror = (error) => { console.error("WebSocket Error:", error); };
        websocket.onclose = () => { console.log("WebSocket Disconnected"); };
        return () => { websocket.close(); };
    }, []);

    useEffect(() => {
        if (getPiece.data) {
            const color = getPiece.data.library.color;
            const newCubeState = getPiece.data.cubes.reduce((acc, cube) => {
                return { ...acc, [cube.id]: { ...cube, color } };
            }, {});
            setCubeState(newCubeState);
        }
    }, [getPiece.data]);


    useEffect(() => {
        if (getPiece.data) {
            // Create a deep copy of the piece data
            const ghostPiece = JSON.parse(JSON.stringify(getPiece.data)) as ExtendedPiece;

            let canMoveDown = true;
            while (canMoveDown) {
                // Try to move the piece down
                for (const cube of ghostPiece.cubes) {
                    cube.y -= 1;
                }

                // Check if the piece is still within bounds and not overlapping
                const isWithinBounds = isPieceWithinBounds(ghostPiece);
                const isOverlapping = isPieceOverlappingPile(ghostPiece);

                if (!isWithinBounds || isOverlapping) {
                    for (const cube of ghostPiece.cubes) {
                        cube.y += 1;
                    }
                    canMoveDown = false;
                }
            }

            // If the piece can't move down anymore, update the ghostState
            if (!canMoveDown) {
                const color = ghostPiece.library.color;
                const newGhostState = ghostPiece.cubes.reduce((acc, cube) => {
                    // Check if the cube shares the same space as a cube in the actual piece
                    const isSameSpace = getPiece.data!.cubes.some(actualCube =>
                        actualCube.x === cube.x && actualCube.y === cube.y && actualCube.z === cube.z
                    );

                    // Only include the cube in the newGhostState if it does not share the same space
                    if (!isSameSpace) {
                        return { ...acc, [cube.id]: { ...cube, color } };
                    }

                    return acc;
                }, {});
                setGhostState(newGhostState);
            }
        }
    }, [getPiece.data]);

    return (
        <>
            {Object.values(cubeState).map((cube: Cube, _index: number) => {
                const location = new Vector3(cube.x, cube.y, cube.z);
                return (
                    <Cube
                        key={cube.id}
                        location={location}
                        color={cube.color}
                    />
                );
            })}
            {Object.values(ghostState).map((cube: Cube, _index: number) => {
                const location = new Vector3(cube.x, cube.y, cube.z);
                return (
                    <GhostCube
                        key={cube.id}
                        location={location}
                        color={cube.color}
                    />
                );
            })}
        </>
    );
};

export default Piece;
