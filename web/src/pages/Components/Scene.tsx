//import { extend } from '@react-three/fiber'
import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { OrbitControls  } from "@react-three/drei";
import Grid from "./Grid";

//extend({ OrbitControls })

export const Scene = () => {
    const { camera } = useThree();

    useEffect(() => {
        camera.position.x = 2.5;
        camera.position.y = 10;
        camera.position.z = 2.5;
        camera.lookAt(2.5, 0, 2.5);
    }, [camera]);

            //<OrbitControls />
    return (
        <>
            <mesh position={[.5, .5, .5]}>
                <boxGeometry args={[1, 1, 1]} />
                <meshNormalMaterial />
            </mesh>
            <Grid />
        </>
    );
};
