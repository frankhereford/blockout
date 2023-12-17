import { Vector3 } from 'three';
import { Cube } from './Cube';

export const Piece = () => {
    const cubes = [
        new Vector3(0, 0, 0),
        new Vector3(1, 0, 0),
        new Vector3(2, 0, 0),
    ];

    return (
        <>
            {cubes.map((location, index) => (
                <Cube key={index} location={location} />
            ))}
        </>
    );
};