//import { Cube } from './Cube';
import { pieces } from './pieces';
import type { PieceType } from './pieces';
import { Vector3, Euler } from 'three';
import { useSpring, animated } from '@react-spring/three'


interface CubeProps {
    location: Vector3;
    scale?: number;
    color?: string;
}

export const Cube = ({ location, scale = 0.93, color = "red" }: CubeProps) => {
    const offsetLocation = new Vector3(location.x + 0.5, location.y + 0.5, location.z + 0.5);

    return (
        <animated.mesh position={offsetLocation} scale={[scale, scale, scale]} castShadow receiveShadow>
            <boxGeometry args={[1, 1, 1]} />
            {/* <meshStandardMaterial attach="material" color={color} /> */}
            {/* <meshPhongMaterial attach="material" color={color} specular="#FFFFFF" shininess={50} /> */}
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

    const createCubes = (pieceName: PieceType) => {
        const { coordinates, color, origin } = pieces[pieceName];
        const rotation_unit = Math.PI / 2;
        const eulerRotation = new Euler(rotation.x * rotation_unit, rotation.y * rotation_unit, rotation.z * rotation_unit);
        return coordinates.map((coordinate, index) => {
            const offsetCoordinate = coordinate.clone().sub(origin);
            offsetCoordinate.applyEuler(eulerRotation);
            offsetCoordinate.add(origin);
            offsetCoordinate.add(location);
            return <Cube key={index} location={offsetCoordinate} color={color} />;
        });
    };

    return (
        <>
            {createCubes(piece)} 
        </>
    );

};
