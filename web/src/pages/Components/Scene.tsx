import Well from "./Well";
import { Cube } from './Cube';
import { Camera } from './Camera';
import { Lighting } from "./Lighting";
import { AxesLabels } from "./AxesLabels";
import { GroundPlane } from "./GroundPlane";

export const Scene = () => {
    return (
        <>
            <Camera />
            <Cube />
            <Well width={5} height={3} depth={5} />
            <AxesLabels />
            <Lighting />
            <GroundPlane />
        </>
    );
};