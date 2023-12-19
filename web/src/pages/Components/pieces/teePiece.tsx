import { Vector3, Euler } from 'three';
import { Cube } from '../Cube';
import { useContext, useEffect } from 'react';
import { GameContext } from '../../contexts/GameContext';
import { set } from 'zod';

interface TeePieceProps {
    offset: Vector3;
    rotation?: Vector3;
    origin?: Vector3;
    color?: string;
}

export const TeePiece = ({ offset, rotation = new Vector3(0, 0, 0), origin = new Vector3(1, 1, 0), color = 'blue' }: TeePieceProps) => {
    const context = useContext(GameContext);

    if (!context) {
        throw new Error('Context must be used within a GameProvider');
    }

    const { setCubes, setBaseCubes, setBaseOrigin }  = context;

    const cubes = [
        new Vector3(0, 1, 0),
        new Vector3(1, 1, 0), // origin
        new Vector3(2, 1, 0),
        new Vector3(1, 0, 0),
    ];

    setBaseCubes(cubes);
    setBaseOrigin(origin);

    const computePieceLocation = (cubes: Vector3[], offset: Vector3, rotation: Vector3) => {
        return cubes.map(cube => cube.clone().sub(origin).applyEuler(new Euler(rotation.x, rotation.y, rotation.z)).add(origin).add(offset));
    };

    const pieceLocation = computePieceLocation(cubes, offset, rotation);

    useEffect(() => {
        setCubes(pieceLocation);
    }, [offset, rotation]);

    return (
        <>
            {pieceLocation.map((location, index) => (
                <Cube key={index} location={location} color={color} />
            ))}
        </>
    );
};