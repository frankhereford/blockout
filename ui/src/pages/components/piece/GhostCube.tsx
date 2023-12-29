import { useSpring, animated } from "@react-spring/three";
import type { Vector3 } from "three";

interface CubeProps {
    location: Vector3;
    scale?: number;
    color?: string;
}

export const GhostCube = ({ location, scale = 0.93, color = "red" }: CubeProps) => {
    const position = location.toArray().map((coord) => coord + 0.5);
    const springProps = useSpring({ position, color });

    return (
        <animated.mesh
            position={springProps.position as unknown as Vector3}
            scale={[scale, scale, scale]}
            castShadow
            receiveShadow
        >
            <boxGeometry attach="geometry" args={[1, 1, 1]} />
            <animated.meshStandardMaterial
                attach="material"
                color="#aaaaaa"
                transparent={true} // Enable transparency
                opacity={0.4}
            />
        </animated.mesh>
    );
};
