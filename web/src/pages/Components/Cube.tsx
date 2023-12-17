import { useState, useEffect } from 'react';

export const Cube = () => {
    const [cubePosition, setCubePosition] = useState(4.5);

    useEffect(() => {
        const interval = setInterval(() => {
            //console.log("Cube position: " + cubePosition)
            setCubePosition((prev) => Math.abs((prev - 1 + 5) % 5)); // Update cube position using state setter function
        }, 1000);

        // Cleanup on component unmount
        return () => clearInterval(interval);
    }, []);

    return (
        <mesh position={[0.5, cubePosition, 0.5]} castShadow>
            <boxGeometry args={[1, 1, 1]} />
            <meshNormalMaterial />
        </mesh>
    );
};