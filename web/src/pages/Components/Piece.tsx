import { useContext } from 'react';
import { GameContext } from '../contexts/GameContext';

import { Vector3 } from 'three';
import { ElPiece } from './pieces/elPiece';
import { TeePiece } from './pieces/teePiece';
import { BlockPiece } from './pieces/blockPiece';
import { SoloPiece } from './pieces/soloPiece';
import { useState, useEffect } from 'react';
import type { FunctionComponent } from 'react';

interface PieceProps {
    pieceType: 'el' | 'tee' | 'block' | 'solo';
    fallInterval: number;
}


function roundVector3(vector: Vector3): Vector3 {
    return new Vector3(
        Math.round(vector.x),
        Math.round(vector.y),
        Math.round(vector.z)
    );
}

// function areAnyCubesBelowZero(cubes: Vector3[]): boolean {
//     return cubes.some(cube => {
//         const roundedCube = roundVector3(cube);
//         return roundedCube.y < 0;
//     });
// }

// function applyOffsetToCubes(cubes: Vector3[], offset: Vector3): Vector3[] {
//     return cubes.map(cube => cube.clone().add(offset));
// }

export const Piece = ({ pieceType, fallInterval=1 }: PieceProps) => {
    const [offset, setOffset] = useState(new Vector3(0, 0, 0));
    const [rotation, setRotation] = useState(new Vector3(0, 0, 0));

    const context = useContext(GameContext);
    if (!context) {
        throw new Error('YourComponent must be used within a PieceProvider');
    }
    const { cubes } = context;

    useEffect(() => {
        console.log("cubes changed:");
        cubes.forEach((cube, index) => {
            console.log(`Cube ${index}:`, roundVector3(cube));
        });
    }, [cubes]);


    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            switch (event.key) {
                case 'ArrowDown':
                    setOffset(prevOffset => new Vector3(prevOffset.x, prevOffset.y, prevOffset.z + 1));
                    break;
                case 'ArrowUp':
                    setOffset(prevOffset => new Vector3(prevOffset.x, prevOffset.y, prevOffset.z - 1));
                    break;
                case 'ArrowLeft':
                    setOffset(prevOffset => new Vector3(prevOffset.x - 1, prevOffset.y, prevOffset.z));
                    break;
                case 'ArrowRight':
                    setOffset(prevOffset => new Vector3(prevOffset.x + 1, prevOffset.y, prevOffset.z));
                    break;
                case 'PageUp':
                    setOffset(prevOffset => new Vector3(prevOffset.x, prevOffset.y + 1, prevOffset.z));
                    break;
                case 'PageDown':
                    setOffset(prevOffset => new Vector3(prevOffset.x, prevOffset.y - 1, prevOffset.z));
                    break;
                case 'q':
                    setRotation(prevRotation => new Vector3(prevRotation.x + Math.PI / 2, prevRotation.y, prevRotation.z));
                    break;
                case 'w':
                    setRotation(prevRotation => new Vector3(prevRotation.x, prevRotation.y + Math.PI / 2, prevRotation.z));
                    break;
                case 'e':
                    setRotation(prevRotation => new Vector3(prevRotation.x, prevRotation.y, prevRotation.z + Math.PI / 2));
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    // useEffect(() => {
    //     const fallTimer = setInterval(() => {
    //         setOffset(prevOffset => {
    //             const proposedOffset = new Vector3(prevOffset.x, prevOffset.y - 1, prevOffset.z);
    //             const downOneOffset = new Vector3(0, -2, 0);
    //             const cubesDownOne = applyOffsetToCubes(cubes, downOneOffset);
    //             const underFloor = areAnyCubesBelowZero(cubesDownOne);
    //             if (!underFloor) {
    //                 return proposedOffset;
    //             }

    //             return new Vector3(prevOffset.x, 6, prevOffset.z);
    //         });
    //     }, fallInterval * 1000); // Convert seconds to milliseconds

    //     return () => {
    //         clearInterval(fallTimer);
    //     };
    // }, [fallInterval, rotation, offset]);

    let PieceType: FunctionComponent<{ offset: Vector3, rotation: Vector3 }>;

    switch (pieceType) {
        case 'el':
            PieceType = ElPiece;
            break;
        case 'tee':
            PieceType = TeePiece;
            break;
        case 'block':
            PieceType = BlockPiece;
            break;
        case 'solo':
            PieceType = SoloPiece;
            break;
        default:
            throw new Error(`Invalid pieceType: ${String(pieceType)}`);
    }

    return (
        <PieceType offset={offset} rotation={rotation} />
    );
};