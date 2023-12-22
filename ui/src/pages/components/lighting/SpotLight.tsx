import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { SpotLight as ThreeSpotLight } from 'three';

interface SpotLightProps {
    width: number;
    height: number;
    depth: number;
    position: [number, number, number];
    intensity?: number; // Add intensity as an optional prop
}

export function SpotLight({ width, height, depth, position, intensity = 100 }: SpotLightProps) { // Set default value for intensity
    const spotLightRef = useRef<ThreeSpotLight>(null);

    useFrame(() => {
        if (spotLightRef.current) {
            spotLightRef.current.target.position.set(width / 2, 0, depth / 2);
            spotLightRef.current.target.updateMatrixWorld();
        }
    });

    return (
        <spotLight ref={spotLightRef} position={position} angle={1} penumbra={.5} intensity={intensity} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} />
    );
}
