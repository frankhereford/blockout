import { Plane } from '@react-three/drei';

interface GroundPlaneProps {
    width: number;
    depth: number;
    scaleFactor?: number;
}

export function GroundPlane({width, depth, scaleFactor = 10}: GroundPlaneProps) {
    return (
        <Plane args={[width * scaleFactor, depth * scaleFactor]} rotation={[-Math.PI / 2, 0, 0]} position={[width / 2, -1, depth / 2]} receiveShadow>
            <meshStandardMaterial attach="material" color="green" />
        </Plane>
    );
}