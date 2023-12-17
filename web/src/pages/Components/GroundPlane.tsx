import { Plane } from '@react-three/drei';

export function GroundPlane() {
    return (
        <Plane args={[50, 50]} rotation={[-Math.PI / 2, 0, 0]} position={[2.5, -1, 2.5]} receiveShadow>
            <meshStandardMaterial attach="material" color="green" />
        </Plane>
    );
}