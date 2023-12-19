import { Cube } from './primitives/Cube';
import type { Vector3 } from 'three';
import { useSprings } from '@react-spring/three'
import type { SpringValue } from '@react-spring/three'

interface SpringProps {
    location: SpringValue<number[]>;
}

interface CubeProps {
    location: Vector3;
    id: string;
}

interface PileProps {
    cubes: CubeProps[];
}

const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet']; // Add more colors if needed

export const Pile = ({ cubes }: PileProps) => {
    const springs = useSprings(
        cubes.length,
        cubes.map((cube: CubeProps) => ({
            location: [cube.location.x, cube.location.y, cube.location.z],
            config: { mass: 1, tension: 170, friction: 26 },
        }))
    );

    return (
        <>
            {springs.map((spring: SpringProps, index: number) => {
                const color = colors[cubes[index]?.location.y % colors.length]; // Cycle through colors
                console.log("key:", cubes[index].id)
                return <Cube key={cubes[index].id} location={spring.location} color={color} />;
            })}
        </>
    );
}