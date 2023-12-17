import { useEffect, useRef, useState } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from "@react-three/drei";

interface CameraProps {
    width: number;
    height: number;
    depth: number;
}

export const Camera = ({width, height, depth}: CameraProps) => {
    const { camera } = useThree();
    const [isManualOrbiting, setIsManualOrbiting] = useState(false);
    const [cameraHeight, setCameraHeight] = useState(height);
    const [cameraOrbitRadius, setCameraOrbitRadius] = useState(1);
    const [angle, setAngle] = useState(0);
    const targetOrbitSpeed = 0.1; // Adjust this value to change the speed of orbiting
    const [orbitSpeed, setOrbitSpeed] = useState(targetOrbitSpeed);
    const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        camera.position.y = 1.8 * height; // Set initial height of the camera
        setCameraHeight(camera.position.y);
    }, [camera, height]);

    const calculateOrbitRadius = () => {
        const dx = width / 2 - camera.position.x;
        const dz = depth / 2 - camera.position.z;
        const distance = Math.sqrt(dx*dx + dz*dz);
        setCameraOrbitRadius(distance);
    };

    useFrame(() => {
        camera.lookAt(width / 2, 0, depth / 2);

        if (!isManualOrbiting) {
            const radian = angle * (Math.PI / 180);
            camera.position.x = width / 2 + cameraOrbitRadius * Math.cos(radian);
            camera.position.z = depth / 2 + cameraOrbitRadius * Math.sin(radian);
            setAngle(prevAngle => (prevAngle + orbitSpeed) % 360);
        }
    });

    useEffect(() => {
        if (!isManualOrbiting) {
            let currentSpeed = 0;
            const intervalId = setInterval(() => {
                currentSpeed += 0.01; // Adjust this value to change the speed of easing
                if (currentSpeed > targetOrbitSpeed) {
                    currentSpeed = targetOrbitSpeed;
                    clearInterval(intervalId);
                }
                setOrbitSpeed(currentSpeed);
            }, 100); // Adjust this value to change the frequency of easing

            return () => clearInterval(intervalId);
        } else {
            setOrbitSpeed(0);
        }
    }, [isManualOrbiting]);

    return (
        <>
            <OrbitControls
                onStart={() => {
                    setIsManualOrbiting(true);
                    console.log('Orbiting engaged');
                    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
                }}
                onEnd={() => {
                    debounceTimeout.current = setTimeout(() => {
                        setIsManualOrbiting(false);
                        console.log('Orbiting disengaged');
                        console.log(`Camera position: x=${camera.position.x}, y=${camera.position.y}, z=${camera.position.z}`);
                        calculateOrbitRadius();
                        console.log(`Camera orbit radius: ${cameraOrbitRadius}`);

                        // Calculate the correct angle
                        const dx = camera.position.x - width / 2;
                        const dz = camera.position.z - depth / 2;
                        const radian = Math.atan2(dz, dx);
                        const newAngle = radian * (180 / Math.PI);
                        setAngle(newAngle);
                    }, 500); // Delay of 0.5 seconds
                }}
            />
        </>
    )
};