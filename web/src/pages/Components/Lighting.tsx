import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { SpotLight as ThreeSpotLight } from 'three'; // Import SpotLight from three package with a different name

interface SpotLightProps {
    width: number;
    height: number;
    depth: number;
}

function SpotLight({width, height, depth}: SpotLightProps) {
    const spotLightRef = useRef<ThreeSpotLight>(null); // Assign SpotLight type to spotLightRef

    useFrame(() => {
        if (spotLightRef.current) {
            spotLightRef.current.target.position.set(width / 2, 0, depth / 2); // Replace x, y, z with the coordinates you want to target
            spotLightRef.current.target.updateMatrixWorld(); // Necessary to apply the changes
        }
    });

    return (
        <spotLight ref={spotLightRef} position={[width / 2, height + 3, depth / 2]} angle={1} penumbra={.5} intensity={300} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} />
    );
}

interface LightingProps {
    width: number;
    height: number;
    depth: number;
}

export function Lighting({width, height, depth}: LightingProps) {
    return (
        <>
            <ambientLight intensity={.3} />
            <SpotLight width={width} height={height} depth={depth} />
        </>
    );
}