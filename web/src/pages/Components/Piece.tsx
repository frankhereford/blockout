import { Cube } from './Cube';
import { pieces } from './pieces';
import type { PieceType } from './pieces';
import { Vector3, Euler } from 'three';
import { useSpring} from '@react-spring/three'
import type { SpringValue } from '@react-spring/three'

interface SpringProps {
    location: SpringValue<number[]>;
}


interface PieceProps {
    piece?: PieceType;
    location?: Vector3;
    rotation?: Vector3;
}

const rotation_unit = Math.PI / 2;

export const Piece = ({ piece = 'tee', location = new Vector3(0, 0, 0), rotation = new Vector3(0, 0, 0) }: PieceProps) => {
    const { coordinates, color, origin } = pieces[piece];
    const eulerRotation = new Euler(rotation.x * rotation_unit, rotation.y * rotation_unit, rotation.z * rotation_unit);

    const createCubes = (coordinate: Vector3, index: number) => {
        const offsetCoordinate = coordinate.clone().sub(origin);
        offsetCoordinate.applyEuler(eulerRotation);
        offsetCoordinate.add(origin);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
        const spring: SpringProps = useSpring({
            location: [offsetCoordinate.x + location.x, offsetCoordinate.y + location.y, offsetCoordinate.z + location.z],
            config: { mass: 1, tension: 170, friction: 26 },
        });

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        return <Cube key={index} location={spring.location} color={color} />;
    };

    return (
        <>
            {coordinates.map(createCubes)}
        </>
    );
};