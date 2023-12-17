import { Vector3, Euler } from 'three';
import { Cube } from '../Cube';

interface ElPieceProps {
    offset: Vector3;
    rotation?: Vector3;
}

export const ElPiece = ({ offset, rotation = new Vector3(0, 0, 0) }: ElPieceProps) => {
    const cubes = [
        new Vector3(0, 0, 0),
        new Vector3(1, 0, 0),
        new Vector3(2, 0, 0),
    ].map(cube => cube.clone().applyEuler(new Euler(rotation.x, rotation.y, rotation.z)));

    return (
        <>
            {cubes.map((location, index) => (
                <Cube key={index} location={location.add(offset)} />
            ))}
        </>
    );
};