import { extend } from '@react-three/fiber'
import { OrbitControls } from "@react-three/drei";
extend({ OrbitControls })

export const Experience = () => {
    return (
        <>
            <OrbitControls />
            <mesh>
                <boxGeometry />
                <meshNormalMaterial />
            </mesh>
        </>
    );
};
