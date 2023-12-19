// pieces.ts
import { Vector3 } from 'three';

type PieceType = 'el' | 'tee' | 'block' | 'solo';
type Color = 'red' | 'blue' | 'green' | 'yellow' | 'orange' | 'purple';

interface Piece {
    coordinates: Vector3[];
    origin: Vector3;
    color: Color;
}
export const pieces: Record<PieceType, Piece> = {
    'el': {
        coordinates: [
            new Vector3(0, 0, 0),
            new Vector3(1, 0, 0),
            new Vector3(2, 0, 0),
        ],
        origin: new Vector3(1, 0, 0),
        color: 'red',
    },
    'tee': {
        coordinates: [
            new Vector3(0, 0, 0),
            new Vector3(1, 0, 0),
            new Vector3(2, 0, 0),
            new Vector3(1, 1, 0),
        ],
        origin: new Vector3(1, 0, 0),
        color: 'blue',
    },
    'block': {
        coordinates: [
            new Vector3(0, 0, 0),
            new Vector3(1, 0, 0),
            new Vector3(0, 0, 1),
            new Vector3(1, 0, 1),
            new Vector3(0, 1, 0),
            new Vector3(1, 1, 0),
            new Vector3(0, 1, 1),
            new Vector3(1, 1, 1),
        ],
        origin: new Vector3(1, 0, 0),
        color: 'green',
    },
    'solo': {
        coordinates: [
            new Vector3(0, 0, 0),
        ],
        origin: new Vector3(1, 0, 0),
        color: 'yellow',
    }
};