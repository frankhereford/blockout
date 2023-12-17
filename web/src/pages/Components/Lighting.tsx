import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

function SpotLight() {
    const spotLightRef = useRef();

    useFrame(() => {
        if (spotLightRef.current) {
            spotLightRef.current.target.position.set(2.5, 0, 2.5); // replace x, y, z with the coordinates you want to target
            spotLightRef.current.target.updateMatrixWorld(); // necessary to apply the changes
        }
    });

    return (
        <spotLight ref={spotLightRef} position={[2.5, 8, 2.5]} angle={1} penumbra={1} intensity={500} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} />
    );
}

export function Lighting() {
    return (
        <>
            <ambientLight intensity={.3} />
            <SpotLight />
        </>
    );
}