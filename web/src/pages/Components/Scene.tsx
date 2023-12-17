import { useEffect, useRef, useState } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import Grid from "./Grid";

export const Scene = () => {

    const { camera } = useThree();
    const clockRef = useRef({ elapsedTime: 0 });
    const [cubePosition, setCubePosition] = useState(4.5); // Initial cube position

    useEffect(() => {
        camera.position.y = 10; // Set initial height of the camera
        camera.lookAt(2.5, 0, 2.5);
    }, [camera]);

    useFrame(() => {
        const clock = clockRef.current;
        clock.elapsedTime += 0.001; // Adjust this value to control the speed of the orbit

        const radius = 2;
        const centerX = 2.5;
        const centerZ = 2.5;

        // Circular motion on the x-z plane
        camera.position.x = centerX + (radius * Math.cos(clock.elapsedTime));
        camera.position.z = centerZ + (radius * Math.sin(clock.elapsedTime));
        camera.lookAt(2.5, 0, 2.5); // Keep the camera looking at the center

        const seconds = Math.floor(clock.elapsedTime * 10);
        const height = 5 - (seconds % 5);
        setCubePosition(height - .5); // Update cube position using state setter function
    });

    return (
        <>
            <mesh position={[0.5, cubePosition, 0.5]} castShadow>
                <boxGeometry args={[1, 1, 1]} />
                <meshNormalMaterial />
            </mesh>
            <Grid />
        </>
    );
};