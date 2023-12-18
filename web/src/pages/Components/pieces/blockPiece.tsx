import { Vector3, Euler } from 'three';
import { Cube } from '../Cube';
import { useContext, useEffect } from 'react';
import { GameContext } from '../../contexts/GameContext';


interface BlockPieceProps {
    offset: Vector3;
    rotation?: Vector3;
    origin?: Vector3;
    color?: string;
}

export const BlockPiece = ({ offset, rotation = new Vector3(0, 0, 0), origin = new Vector3(0.5, 0.5, 0.5), color = 'red' }: BlockPieceProps) => {
    const context = useContext(GameContext);

    if (!context) {
        throw new Error('TeePiece must be used within a PieceProvider');
    }

    const { setCubes } = context;


    const cubes = [
        new Vector3(0, 0, 0),
        new Vector3(1, 0, 0),
        new Vector3(0, 1, 0),
        new Vector3(1, 1, 0),
        new Vector3(0, 0, 1),
        new Vector3(1, 0, 1),
        new Vector3(0, 1, 1),
        new Vector3(1, 1, 1),
    ].map(cube => cube.clone().sub(origin).applyEuler(new Euler(rotation.x, rotation.y, rotation.z)).add(origin));

    useEffect(() => {
        setCubes(cubes);
    }, [offset, rotation]);

    return (
        <>
            {cubes.map((location, index) => (
                <Cube key={index} location={location.add(offset)} color={color} />
            ))}
        </>
    );
};