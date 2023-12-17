//import { extend } from '@react-three/fiber'
import { OrbitControls  } from "@react-three/drei";
import Grid from "./Grid";

//extend({ OrbitControls })

export const Scene = () => {
    return (
        <>
            <OrbitControls />
            <mesh position={[0, 0, 0]}>
                <boxGeometry args={[1, 1, 1]} />
                <meshNormalMaterial />
            </mesh>
            <Grid />
        </>
    );
};
