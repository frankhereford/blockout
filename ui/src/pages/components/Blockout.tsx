import { GroundPlane } from "~/pages/components/GroundPlane"

interface SceneProps {
    width: number;
    height: number;
    depth: number;
}

export const Blockout = ({ width, height, depth }: SceneProps) => {
    return (
        <>
            <GroundPlane width={width} depth={depth} />
        </>
    )
}