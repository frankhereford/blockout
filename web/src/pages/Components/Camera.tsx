import { useEffect, useRef, useState } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from "@react-three/drei";

export const Camera = () => {
    const { camera } = useThree();
    const clockRef = useRef({ elapsedTime: 0 });
    const [isOrbiting, setIsOrbiting] = useState(false);

    useEffect(() => {
        camera.position.y = 10; // Set initial height of the camera
        camera.lookAt(2.5, 0, 2.5);
    }, [camera]);

    useFrame(() => {
        if (!isOrbiting) {
            const clock = clockRef.current;
            clock.elapsedTime += 0.001; // Adjust this value to control the speed of the orbit

            const radius = 2;
            const centerX = 2.5;
            const centerZ = 2.5;

            // Circular motion on the x-z plane
            camera.position.x = centerX + (radius * Math.cos(clock.elapsedTime));
            camera.position.z = centerZ + (radius * Math.sin(clock.elapsedTime));
            camera.lookAt(2.5, 0, 2.5); // Keep the camera looking at the center
        }
    });

    return (
        <>
            <OrbitControls
                onStart={() => setIsOrbiting(true)}
                onEnd={() => setIsOrbiting(false)}
            />
        </>
    )
};