import { useEffect, useState } from "react";
import { GroundPlane } from "~/pages/components/GroundPlane"
import Well from "~/pages/components/well/Well";
import Pile from "~/pages/components/pile/Pile";
import Piece from "~/pages/components/piece/Piece";

import { Lighting } from "~/pages/components/lighting/Lighting";
import { Camera } from "~/pages/components/Camera";
import { Vector2, Vector3 } from 'three';

import { api } from "~/utils/api";

interface SceneProps {
    id: string;
}

export const Blockout = ({ id }: SceneProps) => {
    const [width, setWidth] = useState(1);
    const [height, setHeight] = useState(1);
    const [depth, setDepth] = useState(1);

    const getGame = api.game.get.useQuery({ id: id });
    const movePiece = api.piece.move.useMutation({});

    useEffect(() => {
        if (getGame.data) {
            setWidth(getGame.data.width);
            setHeight(getGame.data.height);
            setDepth(getGame.data.depth);
        }
    }, [getGame.data]);

    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            if (event.key === 'PageUp') {
                // Run command for Page Up key
                movePiece.mutate({ pile: getGame.data?.pile?.id ?? "", movement: { x: 0, y: 1, z: 0, pitch: 0, yaw: 0, roll: 0 } });
                console.log('Page Up key pressed');
            } else if (event.key === 'PageDown') {
                // Run command for Page Down key
                movePiece.mutate({ pile: getGame.data?.pile?.id ?? "", movement: { x: 0, y: -1, z: 0, pitch: 0, yaw: 0, roll: 0 } });
                console.log('Page Down key pressed');
            }
        };

        window.addEventListener('keydown', handleKeyPress);

        // Clean up the event listener when the component unmounts
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
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
            <Pile id={getGame.data.pile?.id ?? ''} />
            <Piece id={getGame.data.pile?.id ?? ''} />
        </>
    )
}
