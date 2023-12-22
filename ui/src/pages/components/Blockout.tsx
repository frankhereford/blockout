import { useEffect, useState } from "react";
import { GroundPlane } from "~/pages/components/GroundPlane"
import Well from "~/pages/components/well/Well";
import Pile from "~/pages/components/pile/Pile";

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

    useEffect(() => {
        if (getGame.data) {
            setWidth(getGame.data.width);
            setHeight(getGame.data.height);
            setDepth(getGame.data.depth);
        }
    }, [getGame.data]);


    const cubes = [[[
        {
            location: new Vector3(0, 0, 0),
            id: 'cube1',
            visible: true,
        },
    ]]];

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
            <Pile cubes={cubes} />
        </>
    )
}
