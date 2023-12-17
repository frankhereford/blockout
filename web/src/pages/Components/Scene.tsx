import Well from "./Well";
import { Cube } from './Cube';
import { Camera } from './Camera';
import { Lighting } from "./Lighting";
import { AxesLabels } from "./AxesLabels";
import { GroundPlane } from "./GroundPlane";
//import { Vector3 } from 'three';
import { Piece } from './Piece';


interface SceneProps {
    width: number;
    height: number;
    depth: number;
}

export const Scene = ({width, height, depth}: SceneProps) => {
    return (
        <>
            <Camera width={width} height={height} depth={depth} />
            {/* <Cube location={new Vector3(1, 0, 0)} /> */}
            <Well width={width} height={height} depth={depth} />
            <AxesLabels width={width} height={height} depth={depth} />
            <Lighting width={width} height={height} depth={depth} />
            <GroundPlane width={width} depth={depth} scaleFactor={20} />
            <Piece pieceType={'block'}/>
        </>
    );
};