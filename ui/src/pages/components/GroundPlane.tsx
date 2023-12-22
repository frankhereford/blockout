import { Plane } from '@react-three/drei';
import { useLoader } from '@react-three/fiber';
import { TextureLoader, Vector2, RepeatWrapping } from 'three';

interface GroundPlaneProps {
    width: number;
    depth: number;
    scaleFactor?: number;
    texture?: string;
    bumpMap?: string;
    displacementMap?: string;
    textureRepeat?: Vector2; // New prop for texture repeat
}

export function GroundPlane({ width, depth, scaleFactor = 10, texture, bumpMap, displacementMap, textureRepeat = new Vector2(1, 1) }: GroundPlaneProps) {
    const textureMap = texture ? useLoader(TextureLoader, texture) : undefined;
    const bumpMapTexture = bumpMap ? useLoader(TextureLoader, bumpMap) : undefined;
    const displacementMapTexture = displacementMap ? useLoader(TextureLoader, displacementMap) : undefined;

    if (textureMap) {
        textureMap.wrapS = textureMap.wrapT = RepeatWrapping;
        textureMap.repeat = textureRepeat;
    }

    return (
        <Plane args={[width * scaleFactor, depth * scaleFactor]} rotation={[-Math.PI / 2, 0, 0]} position={[width / 2, -1, depth / 2]} receiveShadow>
            <meshStandardMaterial attach="material" map={textureMap} bumpMap={bumpMapTexture} displacementMap={displacementMapTexture} displacementScale={1} />
        </Plane>
    );
}