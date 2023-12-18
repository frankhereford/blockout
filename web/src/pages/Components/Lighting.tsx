
import { SpotLight } from './lights/SpotLight'

interface LightingProps {
    width: number;
    height: number;
    depth: number;
}

export function Lighting({width, height, depth}: LightingProps) {
    return (
        <>
            <ambientLight intensity={.4} />
            <SpotLight width={width} height={height} depth={depth} />
        </>
    );
}