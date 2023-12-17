import React from 'react';
import type { MeshProps } from '@react-three/fiber';

interface CylinderProps extends MeshProps {
    point1: [number, number, number];
    point2: [number, number, number];
    rotation?: [number, number, number];
}

const Cylinder: React.FC<CylinderProps> = ({ point1, point2, rotation = [0, 0, 0] }) => {
    const position = [(point1[0] + point2[0]) / 2, (point1[1] + point2[1]) / 2, (point1[2] + point2[2]) / 2];
    const height = Math.sqrt(Math.pow(point2[0] - point1[0], 2) + Math.pow(point2[1] - point1[1], 2) + Math.pow(point2[2] - point1[2], 2));
    const defaultRotation = [Math.atan2(point2[1] - point1[1], point2[0] - point1[0]), 0, 0];
    const finalRotation = [
        (defaultRotation[0] ?? 0) + (rotation[0] ?? 0),
        (defaultRotation[1] ?? 0) + (rotation[1] ?? 0),
        (defaultRotation[2] ?? 0) + (rotation[2] ?? 0)
    ];

    return (
        <mesh position={position} rotation={finalRotation}>
            <cylinderGeometry args={[0.01, 0.01, height, 12]} />
            {/* <meshStandardMaterial color="royalblue" wireframe /> */}
            <meshNormalMaterial />
        </mesh>
    );
};

const Grid: React.FC = () => {
    const cylinders = [];
    const scalar = 5;
    for (let i = 0; i <= scalar; i++) {
        for (let j = 0; j <= scalar; j++) {
            if (i < scalar) {
                cylinders.push(<Cylinder point1={[i, j, 0]} point2={[i + 1, j, 0]} rotation={[Math.PI / 2, 0, Math.PI / 2]} key={`h_xy-${i}-${j}`} />);
                cylinders.push(<Cylinder point1={[0, j, i]} point2={[0, j, i + 1]} rotation={[Math.PI / 2, 0, 0]} key={`h_zy-${i}-${j}`} />);
                cylinders.push(<Cylinder point1={[i, j, scalar]} point2={[i + 1, j, scalar]} rotation={[Math.PI / 2, 0, Math.PI / 2]} key={`h_xy5-${i}-${j}`} />);
                cylinders.push(<Cylinder point1={[scalar, j, i]} point2={[scalar, j, i + 1]} rotation={[Math.PI / 2, 0, 0]} key={`h_zy5-${i}-${j}`} />);
                cylinders.push(<Cylinder point1={[j, 0, i]} point2={[j, 0, i + 1]} rotation={[Math.PI / 2, 0, 0]} key={`h_xz-${i}-${j}`} />);
            }
            if (j < scalar) {
                cylinders.push(<Cylinder point1={[i, j, 0]} point2={[i, j + 1, 0]} rotation={[Math.PI / 2, 0, 0]} key={`v_xy-${i}-${j}`} />);
                cylinders.push(<Cylinder point1={[0, j + .5, i - .5]} point2={[0, j + .5, i + .5]} rotation={[0, Math.PI, 0]} key={`v_zy-${i}-${j}`} />);
                cylinders.push(<Cylinder point1={[i, j, scalar]} point2={[i, j + 1, scalar]} rotation={[Math.PI / 2, 0, 0]} key={`v_xy5-${i}-${j}`} />);
                cylinders.push(<Cylinder point1={[scalar, j + .5, i - .5]} point2={[scalar, j + .5, i + .5]} rotation={[0, Math.PI, 0]} key={`v_zy5-${i}-${j}`} />);
                cylinders.push(<Cylinder point1={[j + .5, 0, i - .5]} point2={[j + .5, 0, i + .5]} rotation={[0, 0, Math.PI / 2]} key={`v_xz-${i}-${j}`} />);
            }

        }
    }
    return <>{cylinders}</>;
};

const App: React.FC = () => (
    <Grid />
);

export default App;