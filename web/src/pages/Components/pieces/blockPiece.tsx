import { Vector3, Euler } from 'three';
import { Cube } from '../Cube';

interface BlockPieceProps {
    offset: Vector3;
    rotation?: Vector3;
    origin?: Vector3;
}

export const BlockPiece = ({ offset, rotation = new Vector3(0, 0, 0), origin = new Vector3(0.5, 0.5, 0.5) }: BlockPieceProps) => {
    const cubes = [
        new Vector3(0, 0, 0),
        new Vector3(1, 0, 0),
        new Vector3(0, 1, 0),
        new Vector3(1, 1, 0),
        new Vector3(0, 0, 1),
        new Vector3(1, 0, 1),
        new Vector3(0, 1, 1),
        new Vector3(1, 1, 1),
    ].map(cube => cube.clone().sub(origin).applyEuler(new Euler(rotation.x, rotation.y, rotation.z)).add(origin));

    return (
        <>
            {cubes.map((location, index) => (
                <Cube key={index} location={location.add(offset)} />
            ))}
        </>
    );
};