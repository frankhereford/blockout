/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
//import { Cube } from './Cube';
import { pieces } from './pieces';
import type { PieceType } from './pieces';
import { Vector3, Euler } from 'three';
import { useSpring, animated } from '@react-spring/three'


interface CubeProps {
    location: AnimatedValue<Vector3>;
    scale?: number;
    color?: string;
}

export const Cube = ({ location, scale = 0.93, color = "red" }: CubeProps) => {
    const offsetLocation = location.to((x, y, z) => new Vector3(x + 0.5, y + 0.5, z + 0.5));

    return (
        <animated.mesh position={offsetLocation} scale={[scale, scale, scale]} castShadow receiveShadow>
            <boxGeometry args={[1, 1, 1]} />
            <meshPhysicalMaterial attach="material" color={color} clearcoat={1} clearcoatRoughness={1} roughness={0} metalness={.5} />
        </animated.mesh>
    );
};



interface PieceProps {
    piece?: PieceType;
    location?: Vector3;
    rotation?: Vector3;
}

export const Piece = ({ piece = 'tee', location = new Vector3(0, 0, 0), rotation = new Vector3(0, 0, 0) }: PieceProps) => {
    const { coordinates, color, origin } = pieces[piece];
    const rotation_unit = Math.PI / 2;
    const eulerRotation = new Euler(rotation.x * rotation_unit, rotation.y * rotation_unit, rotation.z * rotation_unit);

    const createCubes = (coordinate: Vector3, index: number) => {
        const offsetCoordinate = coordinate.clone().sub(origin);
        offsetCoordinate.applyEuler(eulerRotation);
        offsetCoordinate.add(origin);
        const spring = useSpring({
            location: [offsetCoordinate.x + location.x, offsetCoordinate.y + location.y, offsetCoordinate.z + location.z],
            config: { mass: 1, tension: 170, friction: 26 }, // You can adjust these values for different animation effects
        });
        return <Cube key={index} location={spring.location} color={color} />;
    };

    return (
        <>
            {coordinates.map(createCubes)}
        </>
    );
};