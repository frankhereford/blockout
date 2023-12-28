import { useEffect, useState } from "react";
import { GroundPlane } from "~/pages/components/GroundPlane";
import Well from "~/pages/components/well/Well";
import Pile from "~/pages/components/pile/Pile";
import Piece from "~/pages/components/piece/Piece";
import AxisLabels from "~/pages/components/well/AxesLabels";

import { Lighting } from "~/pages/components/lighting/Lighting";
import { Camera } from "~/pages/components/Camera";
import { Vector2, Vector3 } from "three";

import { api } from "~/utils/api";

interface SceneProps {
    id: string;
}

export const Blockout = ({ id }: SceneProps) => {
    const [width, setWidth] = useState(1);
    const [height, setHeight] = useState(1);
    const [depth, setDepth] = useState(1);
    const [piece, setPiece] = useState("");

    const getGame = api.game.get.useQuery({ id: id });
    const movePiece = api.piece.move.useMutation({});

    useEffect(() => {
        if (getGame.data?.pile?.pieces) {
            setPiece(getGame.data?.pile?.pieces[0]?.id ?? "");
        }
        if (getGame.data) {
            setWidth(getGame.data.width);
            setHeight(getGame.data.height);
            setDepth(getGame.data.depth);
        }
    }, [getGame.data]);

    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            //console.log("piece: ", piece)
            switch (event.key) {
                case "PageUp":
                case "[":
                    console.log("Page Up key pressed");
                    movePiece.mutate({
                        id: piece,
                        movement: {
                            x: 0,
                            y: 1,
                            z: 0,
                            pitch: 0,
                            yaw: 0,
                            roll: 0,
                        },
                    });
                    break;
                case "PageDown":
                case "]":
                    console.log("Page Down key pressed");
                    movePiece.mutate({
                        id: piece,
                        movement: {
                            x: 0,
                            y: -1,
                            z: 0,
                            pitch: 0,
                            yaw: 0,
                            roll: 0,
                        },
                    });
                    break;
                case "ArrowUp":
                    console.log("Up arrow key pressed");
                    movePiece.mutate({
                        id: piece,
                        movement: {
                            x: 0,
                            y: 0,
                            z: -1,
                            pitch: 0,
                            yaw: 0,
                            roll: 0,
                        },
                    });
                    break;
                case "ArrowDown":
                    console.log("Down arrow key pressed");
                    movePiece.mutate({
                        id: piece,
                        movement: {
                            x: 0,
                            y: 0,
                            z: 1,
                            pitch: 0,
                            yaw: 0,
                            roll: 0,
                        },
                    });
                    break;
                case "ArrowLeft":
                    console.log("Left arrow key pressed");
                    movePiece.mutate({
                        id: piece,
                        movement: {
                            x: -1,
                            y: 0,
                            z: 0,
                            pitch: 0,
                            yaw: 0,
                            roll: 0,
                        },
                    });
                    break;
                case "ArrowRight":
                    console.log("Right arrow key pressed");
                    movePiece.mutate({
                        id: piece,
                        movement: {
                            x: 1,
                            y: 0,
                            z: 0,
                            pitch: 0,
                            yaw: 0,
                            roll: 0,
                        },
                    });
                    break;
                case "q":
                    console.log("Q key pressed");
                    movePiece.mutate({
                        id: piece,
                        movement: {
                            x: 0,
                            y: 0,
                            z: 0,
                            pitch: 1,
                            yaw: 0,
                            roll: 0,
                        },
                    });
                    break;
                case "w":
                    console.log("W key pressed");
                    movePiece.mutate({
                        id: piece,
                        movement: {
                            x: 0,
                            y: 0,
                            z: 0,
                            pitch: 0,
                            yaw: 1,
                            roll: 0,
                        },
                    });
                    break;
                case "e":
                    console.log("E key pressed");
                    movePiece.mutate({
                        id: piece,
                        movement: {
                            x: 0,
                            y: 0,
                            z: 0,
                            pitch: 0,
                            yaw: 0,
                            roll: 1,
                        },
                    });
                    break;
            }
        };

        window.addEventListener("keydown", handleKeyPress);

        // Clean up the event listener when the component unmounts
        return () => {
            window.removeEventListener("keydown", handleKeyPress);
        };
    }, [piece]);

    useEffect(() => {
        const websocket = new WebSocket("ws://localhost:3001/ws");

        websocket.onopen = () => {
            console.log("WebSocket Connected");
        };
        websocket.onmessage = (event) => {
            const data = JSON.parse(event.data as string) as object;
            if ((data as { piece: boolean }).piece) {
                void getGame.refetch();
            }
        };
        websocket.onerror = (error) => {
            console.error("WebSocket Error:", error);
        };
        websocket.onclose = () => {
            console.log("WebSocket Disconnected");
        };
        return () => {
            websocket.close();
        };
    }, []);

    if (!getGame.data) {
        return null;
    }

    return (
        <>
            <Well width={width} height={height} depth={depth} />
            <Camera width={width} height={height} depth={depth} />
            <GroundPlane
                width={width}
                depth={depth}
                texture="/textures/metal_texture.png"
                //bumpMap="/textures/stones_bump.jpg"
                //displacementMap="/textures/stones_displacement.jpg"
                textureRepeat={new Vector2(3, 3)}
            />
            <Lighting width={width} height={height} depth={depth} />
            <Pile id={getGame.data.pile?.id ?? ""} />
            <Piece id={piece} />
            <AxisLabels width={width} height={height} depth={depth} />
        </>
    );
};
