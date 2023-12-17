import { Vector3 } from 'three';
import { Cube } from '../Cube';

interface ElPieceProps {
    offset: Vector3;
}

export const ElPiece = ({ offset }: ElPieceProps) => {
    const cubes = [
        new Vector3(0, 0, 0),
        new Vector3(1, 0, 0),
        new Vector3(2, 0, 0),
    ];

    return (
        <>
            {cubes.map((location, index) => (
                <Cube key={index} location={location.add(offset)} />
            ))}
        </>
    );
};