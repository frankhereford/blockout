import { GroundPlane } from "~/pages/components/GroundPlane"
import Well from "~/pages/components/well/Well";

import { Lighting } from "~/pages/components/lighting/Lighting";
import { Camera } from "~/pages/components/Camera";
import { Vector2 } from 'three';

interface SceneProps {
    width: number;
    height: number;
    depth: number;
}

export const Blockout = ({ width, height, depth }: SceneProps) => {
    return (
        <>
            <Well width={width} height={height} depth={depth} />
            <Camera width={width} height={height} depth={depth} />
            <GroundPlane
                width={width}
                depth={depth}
                texture="/textures/metal_texture.png"
                // bumpMap="/textures/stones_bump.jpg"
                //displacementMap="/textures/stones_displacement.jpg"
                textureRepeat={new Vector2(3, 3)}
            />
            <Lighting width={width} height={height} depth={depth} />
        </>
    )
}