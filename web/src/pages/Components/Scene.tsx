import Well from "./Well";
import { Cube } from './Cube';
import { Camera } from './Camera';
import { Lighting } from "./Lighting";
import { AxesLabels } from "./AxesLabels";
import { GroundPlane } from "./GroundPlane";

interface SceneProps {
    width: number;
    height: number;
    depth: number;
}

export const Scene = ({width, height, depth}: SceneProps) => {
    return (
        <>
            <Camera width={width} height={height} depth={depth} />
            <Cube />
            <Well width={width} height={height} depth={depth} />
            <AxesLabels width={width} height={height} depth={depth} />
            <Lighting width={width} height={height} depth={depth} />
            <GroundPlane width={width} depth={depth} scaleFactor={20} />
        </>
    );
};