import { Cube } from './primitives/Cube';
import type { Vector3 } from 'three';
import { useSpring } from '@react-spring/three'
import type { SpringValue } from '@react-spring/three'

interface SpringProps {
    location: SpringValue<number[]>;
}

interface PileProps {
    cubes: Vector3[];
}

const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet']; // Add more colors if needed

const createCubes = (location: Vector3, index: number) => {
    const spring: SpringProps = useSpring({
        location: [location.x, location.y, location.z],
        config: { mass: 1, tension: 170, friction: 26 },
    });
    const color = colors[location.y % colors.length]; // Cycle through colors
    return <Cube key={index} location={spring.location} color={color} />;
};

export const Pile = ({ cubes }: PileProps) => {
    console.log("cube: ", cubes)
    return (
        <>
            {cubes.map(createCubes)}
        </>
    );
}