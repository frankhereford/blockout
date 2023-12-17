import { Vector3 } from 'three';

interface CubeProps {
    location: Vector3;
}

export const Cube = ({location}: CubeProps) => {
    const offsetLocation = new Vector3(location.x + 0.5, location.y + 0.5, location.z + 0.5);

    return (
        <mesh position={offsetLocation} castShadow>
            <boxGeometry args={[1, 1, 1]} />
            <meshNormalMaterial />
        </mesh>
    );
};