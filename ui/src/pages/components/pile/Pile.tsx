import { Cube } from './Cube';
import type { Vector3 } from 'three';
import { useSprings } from '@react-spring/three'
import type { SpringValue } from '@react-spring/three'
import { useEffect, useState } from "react";

import { api } from "~/utils/api";

// interface SpringProps {
//     location: SpringValue<number[]>;
// }

// interface CubeProps {
//     location: Vector3;
//     id: string;
//     visible: boolean;
// }

interface PileProps {
    id: string;
}

const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'].reverse();

const Pile = ({ id }: PileProps) => {

    const getPile = api.pile.get.useQuery({ id: id});

    useEffect(() => {
        if (getPile.data) {
            console.log("getPile.data: ", getPile.data);
        }
    }, [getPile.data]);

    // Flatten the 3D array into a 1D array
//     const flattenedCubes = cubes.flat(3);

//     const springs = useSprings(
//         flattenedCubes.length,
//         flattenedCubes.map((cube: CubeProps) => ({
//             location: [cube.location.x, cube.location.y, cube.location.z],
//             config: { mass: 1, tension: 170, friction: 26 },
//         }))
//     );

//     return (
//         <>
//             {springs.map((spring: SpringProps, index: number) => {
//                 const cube = flattenedCubes[index];
//                 if (!cube) { return null; }
//                 if (!cube.visible) { return null; }
//                 const color = colors[cube.location.y % colors.length]; // Cycle through colors
//                 return <Cube key={cube.id} location={spring.location} color={color} />;
//             })}
//         </>
//     );
    return (
        <>
        </>
    );
}

export default Pile;