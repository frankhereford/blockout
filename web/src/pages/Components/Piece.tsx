import { useContext } from 'react';
import { PieceContext } from '../contexts/PieceContext';

import { Vector3 } from 'three';
import { ElPiece } from './pieces/elPiece';
import { TeePiece } from './pieces/teePiece';
import { BlockPiece } from './pieces/blockPiece';
import { SoloPiece } from './pieces/soloPiece';
import { useState, useEffect } from 'react';
import type { FunctionComponent } from 'react';

interface PieceProps {
    pieceType: 'el' | 'tee' | 'block' | 'solo';
    fallInterval: number; // New prop for the fall interval
}

export const Piece = ({ pieceType, fallInterval=1 }: PieceProps) => {
    const [offset, setOffset] = useState(new Vector3(2, 0, 2));
    const [rotation, setRotation] = useState(new Vector3(0, 0, 0));


    const context = useContext(PieceContext);
    if (!context) {
        throw new Error('YourComponent must be used within a PieceProvider');
    }
    const { cubes } = context;

    useEffect(() => {
        console.log(cubes);
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

    useEffect(() => {
        const fallTimer = setInterval(() => {
            setOffset(prevOffset => {
                let newY = prevOffset.y - 1;
                if (newY < 0) {
                    newY = 5; // Reset y to 5 if it goes below 0
                }
                return new Vector3(prevOffset.x, newY, prevOffset.z);
            });
        }, fallInterval * 1000); // Convert seconds to milliseconds

        return () => {
            clearInterval(fallTimer);
        };
    }, [fallInterval]);

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