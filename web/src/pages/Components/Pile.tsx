import { Cube } from './primatives/Cube';
import { Vector3, Euler } from 'three';
import { useSpring } from '@react-spring/three'
import type { SpringValue } from '@react-spring/three'

interface SpringProps {
    location: SpringValue<number[]>;
}

interface PileProps {
    cubes: Vector3[];
}

const createCubes = (location: Vector3, index: number) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    const spring: SpringProps = useSpring({
        location: [location.x, location.y, location.z],
        config: { mass: 1, tension: 170, friction: 26 },
    });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    return <Cube key={index} location={spring.location} />;
};

export const Pile = ({ cubes }: PileProps) => {
    console.log("cube: ", cubes)
    return (
        <>
            {cubes.map(createCubes)}
        </>
    );
}
