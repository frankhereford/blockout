import { GroundPlane } from "~/pages/components/GroundPlane"
import { Lighting } from "~/pages/components/lighting/Lighting";

interface SceneProps {
    width: number;
    height: number;
    depth: number;
}

export const Blockout = ({ width, height, depth }: SceneProps) => {
    return (
        <>
            <GroundPlane width={width} depth={depth} texture="/textures/stones_texture.jpg" />
            <Lighting width={width} height={height} depth={depth} />
        </>
    )
}