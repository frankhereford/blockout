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
            <GroundPlane width={width} depth={depth} />
            <Lighting width={width} height={height} depth={depth} />
        </>
    )
}