import { Cube } from './Cube';

type PieceType = 'el' | 'tee' | 'block' | 'solo';

interface PieceProps {
    piece: PieceType;
}

interface Coordinate {
    x: number;
    y: number;
    z: number;
}

interface Piece {
    coordinates: Coordinate[];
    origin: Coordinate;
}

const pieces: Record<PieceType, Piece> = {
    'el': {
        coordinates: [
            { x: 0, y: 0, z: 0 },
            { x: 1, y: 0, z: 0 },
            { x: 2, y: 0, z: 0 },
            { x: 1, y: 1, z: 0 }
        ],
        origin: { x: 1, y: 0, z: 0 }
    },
    'tee': {
        coordinates: [
            { x: 0, y: 0, z: 0 },
            { x: 1, y: 0, z: 0 },
            { x: 2, y: 0, z: 0 },
            { x: 1, y: 1, z: 0 }
        ],
        origin: { x: 1, y: 0, z: 0 }
    },
    'block': {
        coordinates: [
            { x: 0, y: 0, z: 0 },
            { x: 1, y: 0, z: 0 },
            { x: 2, y: 0, z: 0 },
            { x: 1, y: 1, z: 0 }
        ],
        origin: { x: 1, y: 0, z: 0 }
    },
    'solo': {
        coordinates: [
            { x: 0, y: 0, z: 0 },
            { x: 1, y: 0, z: 0 },
            { x: 2, y: 0, z: 0 },
            { x: 1, y: 1, z: 0 }
        ],
        origin: { x: 1, y: 0, z: 0 }
    }
};

export const Piece = ({ }: PieceProps) => {
    return (
        <>
        </>
    );
};