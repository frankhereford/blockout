import { Cube } from "./Cube";
import { Vector3 } from "three";
import { useEffect, useState } from "react";

import { api } from "~/utils/api";

interface PileProps {
    id: string;
    serial: number;
}
interface Cube {
    id: string;
    x: number;
    y: number;
    z: number;
    active: boolean;
}

const colors = [
    "red",
    "orange",
    "yellow",
    "green",
    "blue",
    "indigo",
    "violet",
].reverse();

const Pile = ({ id, serial }: PileProps) => {
    const getPile = api.pile.get.useQuery({ id: id });
    const [cubeState, setCubeState] = useState<Record<string, Cube>>({});

    const clearFloor = api.pile.clearFloor.useMutation({});

    useEffect(() => {
        const fetchData = async () => {
            await getPile.refetch();
        };

        fetchData().catch(error => {
            console.error('An error occurred while fetching data:', error);
        });
    }, [serial]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "1") {
                clearFloor.mutate({ id: id, floor: 0 });
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        // Remove event listener on cleanup
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [id, clearFloor]);

    useEffect(() => {
        if (getPile.data) {
            //console.log("getPile.data: ", getPile.data);
            const newCubeState = getPile.data.cubes.reduce((acc, cube) => {
                return { ...acc, [cube.id]: cube };
            }, {});

            setCubeState(newCubeState);
        }
    }, [getPile.data]);

    return (
        <>
            {Object.values(cubeState).map((cube: Cube, _index: number) => {
                if (cube.active) {
                    const location = new Vector3(cube.x, cube.y, cube.z);
                    const color = colors[cube.y % colors.length];
                    return (
                        <Cube key={cube.id} location={location} color={color} />
                    );
                }
            })}
        </>
    );
};

export default Pile;
