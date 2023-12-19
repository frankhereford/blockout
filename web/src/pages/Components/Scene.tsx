import Well from "./Well";
import { Camera } from './Camera';
import { Lighting } from "./Lighting";
import { AxesLabels } from "./AxesLabels";
import { GroundPlane } from "./GroundPlane";
// import { Piece } from './Piece';


interface SceneProps {
    width: number;
    height: number;
    depth: number;
}

export const Scene = ({width, height, depth}: SceneProps) => {
    return (
        <>
            <Camera width={width} height={height} depth={depth} />
            <Well width={width} height={height} depth={depth} />
            <AxesLabels width={width} height={height} depth={depth} />
            <Lighting width={width} height={height} depth={depth} />
            <GroundPlane width={width} depth={depth} scaleFactor={20} />
            {/* <Piece width={width} height={height} depth={depth} pieceType={'tee'} fallInterval={1} /> */}
        </>
    );
};