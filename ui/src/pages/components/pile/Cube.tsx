import type { Vector3 } from 'three';
interface CubeProps {
    location: Vector3;
    scale?: number;
    color?: string;
}

export const Cube = ({ location, scale = 0.93, color = "red" }: CubeProps) => {
    console.log("location: ", location);
    const position = location.toArray().map(coord => coord + 0.5);
    return (
        <mesh position={position} scale={[scale, scale, scale]}>
            <boxGeometry attach="geometry" args={[1, 1, 1]} />
            <meshStandardMaterial attach="material" color={color} />
        </mesh>
    );
};
