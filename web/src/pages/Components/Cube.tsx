import { Vector3 } from 'three';

interface CubeProps {
    location: Vector3;
    scale?: number;
    color?: string;
}

export const Cube = ({location, scale = 0.87, color = "red"}: CubeProps) => {
    const offsetLocation = new Vector3(location.x + 0.5, location.y + 0.5, location.z + 0.5);

    return (
        <mesh position={offsetLocation} scale={[scale, scale, scale]} castShadow receiveShadow>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial attach="material" color={color} />
        </mesh>
    );
};