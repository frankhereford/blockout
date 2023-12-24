import { Cube } from './Cube';
import { Vector3 } from 'three';
import { useEffect, useState } from "react";

import { api } from "~/utils/api";

interface PieceProps {
    id: string;
}

interface Cube {
    id: string;
    color: string;
    x: number;
    y: number;
    z: number;
}

const Piece = ({ id }: PieceProps) => {

    const getPiece = api.piece.get.useQuery({ id: id });

    const [cubeState, setCubeState] = useState<Record<string, Cube>>({});

    useEffect(() => {
        const websocket = new WebSocket('ws://localhost:3001/ws');

        websocket.onopen = () => { console.log('WebSocket Connected'); };
        websocket.onmessage = (event) => {
            const data = JSON.parse(event.data as string) as object;
            if ((data as { piece: boolean }).piece) {
                void getPiece.refetch();
            }
        };
        websocket.onerror = (error) => { console.error('WebSocket Error:', error); };
        websocket.onclose = () => { console.log('WebSocket Disconnected'); };
        return () => { websocket.close(); };
    }, []);

    useEffect(() => {
        if (getPiece.data) {
            const color = getPiece.data.library.color;
            const newCubeState = getPiece.data.cubes.reduce((acc, cube) => {
                return { ...acc, [cube.id]: { ...cube, color } };
            }, {});
            setCubeState(newCubeState);
        }
    }, [getPiece.data]);

    return (
        <>
            {Object.values(cubeState).map((cube: Cube, _index: number) => {
                const location = new Vector3(cube.x, cube.y, cube.z);
                return <Cube key={cube.id} location={location} color={cube.color} />;
            })}
        </>
    );
}

export default Piece;
