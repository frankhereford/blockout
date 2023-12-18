
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
            <SpotLight width={width} height={height} depth={depth} position={[width / 2, height + 3, depth / 2]} />
            {/* <SpotLight width={width} height={height} depth={depth} position={[width, height + 3, depth]} /> */}
            {/* <SpotLight width={width} height={height} depth={depth} position={[0, height + 3, 0]} /> */}
        </>
    );
}