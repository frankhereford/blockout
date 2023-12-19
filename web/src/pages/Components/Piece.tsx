import { Vector3 } from 'three';
import { Cube } from './Cube';

type PieceType = 'el' | 'tee' | 'block' | 'solo';
type Color = 'red' | 'blue' | 'green' | 'yellow' | 'orange' | 'purple';

interface PieceProps {
    piece: PieceType;
}

interface Piece {
    coordinates: Vector3[];
    origin: Vector3;
    color: Color;
}

const pieces: Record<PieceType, Piece> = {
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

export const Piece = ({ piece = 'tee' }: PieceProps) => {

    const createCubes = (pieceName: PieceType) => {
        const { coordinates, color } = pieces[pieceName];
        return coordinates.map((coordinate, index) => <Cube key={index} location={coordinate} color={color} />);
    };

    return (
        <>
            {createCubes(piece)} 
        </>
    );
};