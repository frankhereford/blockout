import { Vector3 } from 'three';
import { ElPiece } from './pieces/elPiece';

export const Piece = () => {
    const offset = new Vector3(2, 0, 2);
    return (
        <ElPiece offset={offset} />
    );
};