import { Vector3 } from 'three';
import { ElPiece } from './pieces/elPiece';
import { useState, useEffect } from 'react';

export const Piece = () => {
    const [offset, setOffset] = useState(new Vector3(2, 0, 2));
    const [rotation, setRotation] = useState(new Vector3(0, 0, 0));

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            switch(event.key) {
                case 'ArrowUp':
                    setOffset(prevOffset => new Vector3(prevOffset.x, prevOffset.y, prevOffset.z + 1));
                    break;
                case 'ArrowDown':
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

    return (
        <ElPiece offset={offset} rotation={rotation} />
    );
};