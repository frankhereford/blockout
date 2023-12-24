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

    const getPiece = api.piece.get.useQuery({ pile: id });
    const [cubeState, setCubeState] = useState<Record<string, Cube>>({});

    useEffect(() => {
        const websocket = new WebSocket('ws://localhost:3001/ws');

        websocket.onopen = () => { console.log('WebSocket Connected'); };
        websocket.onmessage = (event) => {
            const data = JSON.parse(event.data as string) as object;
            //console.log("websocket data: ", data)
            if ((data as { piece_added: boolean }).piece_added) {
                void getPiece.refetch();
            //} else if ((data as { floor_removed: boolean }).floor_removed) {
                //void getPile.refetch();
            }
        };
        websocket.onerror = (error) => { console.error('WebSocket Error:', error); };
        websocket.onclose = () => { console.log('WebSocket Disconnected'); };
        return () => { websocket.close(); };
    }, []);

    useEffect(() => {
        if (getPiece.data) {
            console.log("getPiece.data.library: ", getPiece.data.library);
            const color = getPiece.data.library.color as string;
            const newCubeState = getPiece.data.cubes.reduce((acc, cube) => {
                return { ...acc, [cube.id]: { ...cube, color } };
            }, {});
            console.log("new cube state: ", newCubeState);
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
