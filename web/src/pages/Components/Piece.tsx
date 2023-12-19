import { useContext } from 'react';
import { GameContext } from '../contexts/GameContext';

import { Vector3, Euler } from 'three';
import { ElPiece } from './pieces/elPiece';
import { TeePiece } from './pieces/teePiece';
import { BlockPiece } from './pieces/blockPiece';
import { SoloPiece } from './pieces/soloPiece';
import { useState, useEffect } from 'react';
import type { FunctionComponent } from 'react';
import { check } from 'prettier';

interface PieceProps {
    pieceType: 'el' | 'tee' | 'block' | 'solo';
    fallInterval: number;
    width: number;
    height: number;
    depth: number;
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

function applyOffsetToCubes(cubes: Vector3[], offset: Vector3): Vector3[] {
    return cubes.map(cube => cube.clone().add(offset));
}

function applyRotationToCubes(cubes: Vector3[], offset: Vector3, origin: Vector3, rotation: Vector3): Vector3[] {
    console.log("cubes are:", cubes);
    console.log("offset is:", offset);
    console.log("origin is:", origin);
    console.log("rotation is:", rotation);

    //const eulerRotation = new Euler(rotation.x, rotation.y, rotation.z);
    // the problem here is that the rotation is applied to the origin, not the center of the piece
    return cubes.map(cube => cube.clone().sub(origin).applyEuler(new Euler(rotation.x, rotation.y, rotation.z)).add(origin).add(offset));
    //return cubes;
    //return cubes.map(cube => cube.clone().applyEuler(eulerRotation));
}

export const Piece = ({ pieceType, fallInterval=1, width, height, depth }: PieceProps) => {
    const [offset, setOffset] = useState(new Vector3(0, 0, 0));
    const [rotation, setRotation] = useState(new Vector3(0, 0, 0));

    const context = useContext(GameContext);
    if (!context) {
        throw new Error('Context must be used within a GameProvider');
    }
    const { cubes, baseCubes, baseOrigin } = context;

    useEffect(() => {
        console.log("cubes have changed to:");
        cubes.forEach((cube, index) => {
            console.log(`Cube ${index}:`, roundVector3(cube));
        });
    }, [cubes]);

    function areCubesWithinVolume(cubes: Vector3[], width: number, height: number, depth: number): boolean {
        return cubes.every(cube =>
            cube.x >= 0 && cube.x < width &&
            cube.y >= 0 && cube.y < height &&
            cube.z >= 0 && cube.z < depth
        );
    }



    useEffect(() => {
        const checkAndSetOffset = (local_offset: Vector3) => {
            const combined_offset = offset.clone().add(local_offset);
            const proposed_location = applyOffsetToCubes(cubes, local_offset).map(roundVector3);
            if (areCubesWithinVolume(proposed_location, width, height, depth)) {
                setOffset(combined_offset);
            } else {
                console.log("Proposed location is outside the volume");
            }
        };

        const checkAndSetRotation = (rotationChange: Vector3) => {
            console.log('');
            console.log('');
            const combinedRotation = rotation.clone().add(rotationChange);
            const proposed_location = applyRotationToCubes(baseCubes, offset, baseOrigin, rotationChange).map(roundVector3);
            console.log("proposed location is:", proposed_location);
            if (areCubesWithinVolume(proposed_location, width, height, depth)) {
                setRotation(combinedRotation);
            } else {
                console.log("Proposed location is outside the volume");
                console.log("Proposed location is:", proposed_location);
            }

        };

        const handleKeyDown = (event: KeyboardEvent) => {
            switch (event.key) {
                case 'ArrowDown': checkAndSetOffset(new Vector3(0, 0, 1)); break;
                case 'ArrowUp': checkAndSetOffset(new Vector3(0, 0, -1)); break;
                case 'ArrowLeft': checkAndSetOffset(new Vector3(-1, 0, 0)); break;
                case 'ArrowRight': checkAndSetOffset(new Vector3(1, 0, 0)); break;
                case 'PageUp': checkAndSetOffset(new Vector3(0, 1, 0)); break;
                case 'PageDown': checkAndSetOffset(new Vector3(0, -1, 0)); break;
                case 'q':
                    //setRotation(prevRotation => new Vector3(prevRotation.x + Math.PI / 2, prevRotation.y, prevRotation.z));
                    checkAndSetRotation(new Vector3(Math.PI / 2, 0, 0));
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
    }, [cubes, baseCubes, baseOrigin, offset]);

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