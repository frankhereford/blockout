import { Plane } from '@react-three/drei';
import { useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';

interface GroundPlaneProps {
    width: number;
    depth: number;
    scaleFactor?: number;
    texture?: string; // New prop for texture file path
}

export function GroundPlane({ width, depth, scaleFactor = 10, texture }: GroundPlaneProps) {
    const textureMap = texture ? useLoader(TextureLoader, texture) : undefined;

    return (
        <Plane args={[width * scaleFactor, depth * scaleFactor]} rotation={[-Math.PI / 2, 0, 0]} position={[width / 2, -1, depth / 2]} receiveShadow>
            <meshStandardMaterial attach="material" color="green" map={textureMap} />
        </Plane>
    );
}