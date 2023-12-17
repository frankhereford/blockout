import { Vector3 } from 'three';
import { ElPiece } from './pieces/elPiece';
import { useState, useEffect } from 'react';

export const Piece = () => {
    const [offset, setOffset] = useState(new Vector3(2, 0, 2));

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
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    return (
        <ElPiece offset={offset} />
    );
};