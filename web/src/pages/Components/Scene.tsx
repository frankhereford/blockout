import Well from "./Well";
import { Cube } from './Cube'; // Import the Cube component
import { Camera } from './Camera'; // Import the Camera component
import { Lighting } from "./Lighting";
import { AxesLabels } from "./AxesLabels";
import { GroundPlane } from "./GroundPlane";

export const Scene = () => {
    return (
        <>
            <Camera /> {/* Use the Camera component */}
            <Cube />
            <Well width={5} height={3} depth={5} />
            <AxesLabels />
            <Lighting />
            <GroundPlane />
        </>
    );
};