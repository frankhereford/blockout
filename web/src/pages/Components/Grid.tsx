import React from 'react';
import type { MeshProps } from '@react-three/fiber';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface SquareProps extends MeshProps { }

const Square: React.FC<SquareProps> = ({ position }) => (
    <mesh position={position}>
        <planeGeometry args={[1, 1]} />
        <meshStandardMaterial color="royalblue" wireframe />
    </mesh>
);

const Grid: React.FC = () => {
    const squares = [];
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
            squares.push(<Square position={[i, j, .5]} key={`${i}-${j}`} />);
        }
    }
    return <>{squares}</>;
};

const App: React.FC = () => (
    <Grid />
);

export default App;
