import { useEffect, useRef, useState } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from "@react-three/drei";

export const Camera = () => {
    const { camera } = useThree();
    const [isManualOrbiting, setIsManualOrbiting] = useState(false);
    const [cameraHeight, setCameraHeight] = useState(0);
    const [cameraOrbitRadius, setCameraOrbitRadius] = useState(5);
    const [angle, setAngle] = useState(0);
    const [orbitSpeed, setOrbitSpeed] = useState(0.1); // Adjust this value to change the speed of orbiting

    useEffect(() => {
        camera.position.y = 10; // Set initial height of the camera
        setCameraHeight(camera.position.y);
    }, [camera]);

    const calculateOrbitRadius = () => {
        const dx = 2.5 - camera.position.x;
        const dz = 2.5 - camera.position.z;
        const distance = Math.sqrt(dx*dx + dz*dz);
        setCameraOrbitRadius(distance);
    };
    useFrame(() => {
        camera.lookAt(2.5, 0, 2.5);

        if (!isManualOrbiting) {
            const radian = angle * (Math.PI / 180);
            camera.position.x = 2.5 + cameraOrbitRadius * Math.cos(radian);
            camera.position.z = 2.5 + cameraOrbitRadius * Math.sin(radian);
            setAngle(prevAngle => (prevAngle + orbitSpeed) % 360);
        }
    });

    return (
        <>
            <OrbitControls
                onStart={() => {
                    setIsManualOrbiting(true);
                    console.log('Orbiting engaged');
                }}
                onEnd={() => {
                    setIsManualOrbiting(false);
                    console.log('Orbiting disengaged');
                    console.log(`Camera position: x=${camera.position.x}, y=${camera.position.y}, z=${camera.position.z}`);
                    calculateOrbitRadius();
                    console.log(`Camera orbit radius: ${cameraOrbitRadius}`);

                    // Calculate the correct angle
                    const dx = camera.position.x - 2.5;
                    const dz = camera.position.z - 2.5;
                    const radian = Math.atan2(dz, dx);
                    const newAngle = radian * (180 / Math.PI);
                    setAngle(newAngle);
                }}
            />
        </>
    )
};