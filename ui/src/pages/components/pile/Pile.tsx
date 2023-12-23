import { Cube } from './Cube';
import { Vector3 } from 'three';
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

    const clearFloor = api.pile.clearFloor.useMutation({});

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === '1') {
                clearFloor.mutate({ id: id, floor: 0});
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        // Remove event listener on cleanup
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [id, clearFloor]);

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
        const websocket = new WebSocket('ws://localhost:3001/ws');

        websocket.onopen = () => {
            console.log('WebSocket Connected');
        };

        websocket.onmessage = (event) => {
            const data = JSON.parse(event.data as string) as object;
            console.log("websocket data: ", data)
            void getPile.refetch();
            // if (data.clear) {
            //     console.log('in clear')
            //     getBoard.refetch();
            // } else {
            //     setColorAt(data.x, data.y, data.color);
            // }
        };

        websocket.onerror = (error) => {
            console.error('WebSocket Error:', error);
        };

        websocket.onclose = () => {
            console.log('WebSocket Disconnected');
        };

        return () => {
            websocket.close();
        };
    }, []);


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
