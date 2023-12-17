import { useEffect, useRef, useState } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import Well from "./Well";

export const Scene = () => {

    const { camera } = useThree();
    const clockRef = useRef({ elapsedTime: 0 });
    const [cubePosition, setCubePosition] = useState(4.5);

    useEffect(() => {
        const interval = setInterval(() => {
            console.log("Cube position: " + cubePosition)
            setCubePosition((prev) => Math.abs((prev - 1 + 5) % 5)); // Update cube position using state setter function
        }, 1000);

        // Cleanup on component unmount
        return () => clearInterval(interval);
    }, []);


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
    });

    return (
        <>
            <mesh position={[0.5, cubePosition, 0.5]} castShadow>
                <boxGeometry args={[1, 1, 1]} />
                <meshNormalMaterial />
            </mesh>
            <Well width={6} height={3} depth={6} />
        </>
    );
};