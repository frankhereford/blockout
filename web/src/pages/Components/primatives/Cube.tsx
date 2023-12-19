import { animated } from '@react-spring/three'
import type { SpringValue } from '@react-spring/three'
import { Vector3 } from 'three';

interface CubeProps {
    location: SpringValue<number[]>;
    scale?: number;
    color?: string;
}

export const Cube = ({ location, scale = 0.93, color = "red" }: CubeProps) => {

    return (
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
        <animated.mesh position={location.to((x, y, z) => new Vector3(x + 0.5, y + 0.5, z + 0.5)) } scale={[scale, scale, scale]} castShadow receiveShadow>
            <boxGeometry args={[1, 1, 1]} />
            <meshPhysicalMaterial attach="material" color={color} clearcoat={1} clearcoatRoughness={1} roughness={0} metalness={.5} />
        </animated.mesh>
    );
};

