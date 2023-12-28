import { SpotLight } from "./SpotLight";

interface LightingProps {
    width: number;
    height: number;
    depth: number;
}

export function Lighting({ width, height, depth }: LightingProps) {
    const lightLift = 5;
    return (
        <>
            <ambientLight intensity={0.4} />
            <SpotLight
                intensity={100}
                width={width}
                height={height}
                depth={depth}
                position={[width / 2, height + lightLift, depth / 2]}
            />
            <SpotLight
                intensity={100}
                width={width}
                height={height}
                depth={depth}
                position={[width, height + lightLift, depth]}
            />
            <SpotLight
                intensity={100}
                width={width}
                height={height}
                depth={depth}
                position={[0, height + lightLift, 0]}
            />
            <SpotLight
                intensity={100}
                width={width}
                height={height}
                depth={depth}
                position={[width, height + lightLift, 0]}
            />
            <SpotLight
                intensity={100}
                width={width}
                height={height}
                depth={depth}
                position={[0, height + lightLift, depth]}
            />
        </>
    );
}
