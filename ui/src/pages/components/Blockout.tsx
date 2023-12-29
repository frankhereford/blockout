import { useEffect, useState } from "react";
import { GroundPlane } from "~/pages/components/GroundPlane";
import Well from "~/pages/components/well/Well";
import Pile from "~/pages/components/pile/Pile";
import Piece from "~/pages/components/piece/Piece";
import AxisLabels from "~/pages/components/well/AxesLabels";

import { Lighting } from "~/pages/components/lighting/Lighting";
import { Camera } from "~/pages/components/Camera";
import { Vector2 } from "three";

import { api } from "~/utils/api";

interface SceneProps {
    id: string;
}

export const Blockout = ({ id }: SceneProps) => {
    const [width, setWidth] = useState(1);
    const [height, setHeight] = useState(1);
    const [depth, setDepth] = useState(1);
    const [piece, setPiece] = useState("");
    const [pieceSerial, setPieceSerial] = useState(0);
    const [pileSerial, setPileSerial] = useState(0);

    const getGame = api.game.get.useQuery({ id: id });
    const movePiece = api.piece.move.useMutation({});

    useEffect(() => {
        if (movePiece.status === "success") {
            setPieceSerial(prevPieceSerial => prevPieceSerial + 1);
            setPileSerial(prevPileSerial => prevPileSerial + 1);
            getGame.refetch().catch(error => {
                console.error('An error occurred while fetching data:', error);
            });
        }
    }, [movePiece.status]);

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
                    movePiece.mutate({
                        id: piece,
                        drop: false,
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
                    movePiece.mutate({
                        id: piece,
                        drop: false,
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
                    movePiece.mutate({
                        id: piece,
                        drop: false,
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
                    movePiece.mutate({
                        id: piece,
                        drop: false,
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
                    movePiece.mutate({
                        id: piece,
                        drop: false,
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
                    movePiece.mutate({
                        id: piece,
                        drop: false,
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
                    movePiece.mutate({
                        id: piece,
                        drop: false,
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
                    movePiece.mutate({
                        id: piece,
                        drop: false,
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
                    movePiece.mutate({
                        id: piece,
                        drop: false,
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
                case "a":
                    movePiece.mutate({
                        id: piece,
                        drop: true,
                        movement: {
                            x: 0,
                            y: 0,
                            z: 0,
                            pitch: 0,
                            yaw: 0,
                            roll: 0,
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

    if (!getGame.data) { return null; }

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
            <Pile id={getGame.data.pile?.id ?? ""} serial={pileSerial} />
            <Piece id={piece} serial={pieceSerial} />
            <AxisLabels width={width} height={height} depth={depth} />
        </>
    );
};
