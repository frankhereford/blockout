//import { extend } from '@react-three/fiber'
import { OrbitControls  } from "@react-three/drei";

//extend({ OrbitControls })

export const Grid = () => {
    return (
        <>
            <OrbitControls />
            <mesh>
                <boxGeometry args={[1, 2, 3]} />
                <meshNormalMaterial />
            </mesh>
        </>
    );
};
