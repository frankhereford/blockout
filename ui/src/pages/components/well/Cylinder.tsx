import React from 'react';
import { Vector3, Quaternion } from 'three';
import type { MeshProps } from '@react-three/fiber';

interface CylinderProps extends MeshProps {
    point1: [number, number, number];
    point2: [number, number, number];
    width: number;
}

const Cylinder: React.FC<CylinderProps> = ({ point1, point2, width }) => {
    const position = [(point1[0] + point2[0]) / 2, (point1[1] + point2[1]) / 2, (point1[2] + point2[2]) / 2];
    const direction = new Vector3().subVectors(new Vector3(...point2), new Vector3(...point1)).normalize();
    const up = new Vector3(0, 1, 0);
    const quaternion = new Quaternion().setFromUnitVectors(up, direction);
    const height = Math.sqrt(Math.pow(point2[0] - point1[0], 2) + Math.pow(point2[1] - point1[1], 2) + Math.pow(point2[2] - point1[2], 2));

    return (
        <mesh position={new Vector3(...position)} quaternion={quaternion} castShadow>
            <cylinderGeometry args={[width, width, height, 32]} />
            <meshStandardMaterial color="royalblue" />
        </mesh>
    );
};

export default Cylinder;
