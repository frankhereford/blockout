import { useState, useEffect } from 'react';

interface CubeProps {
    height: number;
}

export const Cube = ({height}: CubeProps) => {
    const [cubePosition, setCubePosition] = useState(height - .5);

    useEffect(() => {
        const interval = setInterval(() => {
            setCubePosition((prev) => Math.abs((prev - 1 + height) % height)); // Update cube position using state setter function
        }, 1000);

        // Cleanup on component unmount
        return () => clearInterval(interval);
    }, [height]);

    return (
        <mesh position={[0.5, cubePosition, 0.5]} castShadow>
            <boxGeometry args={[1, 1, 1]} />
            <meshNormalMaterial />
        </mesh>
    );
};