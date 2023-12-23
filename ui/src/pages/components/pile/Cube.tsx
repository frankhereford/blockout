import { useSpring, animated } from '@react-spring/three';
import type { Vector3 } from 'three';

interface CubeProps {
    location: Vector3;
    scale?: number;
    color?: string;
}

export const Cube = ({ location, scale = 0.93, color = "red" }: CubeProps) => {
    const position = location.toArray().map(coord => coord + 0.5);
    const springProps = useSpring({ position });

    return (
        <animated.mesh position={springProps.position} scale={[scale, scale, scale]}>
            <boxGeometry attach="geometry" args={[1, 1, 1]} />
            <meshStandardMaterial attach="material" color={color} />
        </animated.mesh>
    );
};
