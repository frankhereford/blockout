import { Vector3 } from 'three';

interface CubeProps {
    location: Vector3;
    scale?: number;
}

export const Cube = ({location, scale = 0.97}: CubeProps) => {
    const offsetLocation = new Vector3(location.x + 0.5, location.y + 0.5, location.z + 0.5);

    return (
        <mesh position={offsetLocation} scale={[scale, scale, scale]} castShadow>
            <boxGeometry args={[1, 1, 1]} />
            <meshNormalMaterial />
        </mesh>
    );
};