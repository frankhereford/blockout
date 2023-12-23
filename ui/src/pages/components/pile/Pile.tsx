import { Cube } from './Cube';
import { Vector3 } from 'three';
import { useSprings } from '@react-spring/three'
import type { SpringValue } from '@react-spring/three'
import { useEffect, useState } from "react";

import { api } from "~/utils/api";

interface PileProps {
    id: string;
}
interface Cube {
    id: string;
    x: number;
    y: number;
    z: number;
    active: boolean;
}

const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'].reverse();

const Pile = ({ id }: PileProps) => {

    const getPile = api.pile.get.useQuery({ id: id});
    const [cubeState, setCubeState] = useState<Record<string, Cube>>({});

    useEffect(() => {
        if (getPile.data) {
            console.log("getPile.data: ", getPile.data);
            const newCubeState = getPile.data.cubes.reduce((acc, cube) => {
                return { ...acc, [cube.id]: cube };
            }, {});

            setCubeState(newCubeState);
        }
    }, [getPile.data]);

    useEffect(() => {
        const interval = setInterval(() => {
            void getPile.refetch();
        }, 3000);

        return () => clearInterval(interval);
    }, [getPile]);

    return (
        <>
            {Object.values(cubeState).map((cube: Cube, _index: number) => {
                if (cube.active) {
                    const location = new Vector3(cube.x, cube.y, cube.z);
                    const color = colors[cube.y % colors.length];
                    return <Cube key={cube.id} location={location} color={color} />;
                }
            })}
        </>
    );
}

export default Pile;
