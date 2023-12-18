import { Vector3, Euler } from 'three';
import { Cube } from '../Cube';
import { useContext, useEffect } from 'react';
import { GameContext } from '../../contexts/GameContext';

interface ElPieceProps {
    offset: Vector3;
    rotation?: Vector3;
    origin?: Vector3;
    color?: string;
}

export const ElPiece = ({ offset, rotation = new Vector3(0, 0, 0), origin = new Vector3(1, 0, 0), color = 'yellow' }: ElPieceProps) => {
    
    const context = useContext(GameContext);

    if (!context) {
        throw new Error('Context must be used within a GameProvider');
    }

    const { setCubes } = context;

    const cubes = [
        new Vector3(0, 0, 0),
        new Vector3(1, 0, 0),
        new Vector3(2, 0, 0),
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