import { Vector3, Euler } from 'three';
import { Cube } from '../Cube';
import { useContext, useEffect } from 'react';
import { PieceContext } from '../../contexts/PieceContext';

interface SoloPieceProps {
    offset: Vector3;
    rotation?: Vector3;
    origin?: Vector3;
    color?: string;
}

export const SoloPiece = ({ offset, rotation = new Vector3(0, 0, 0), origin = new Vector3(0,0,0), color = 'green' }: SoloPieceProps) => {

    const context = useContext(PieceContext);

    if (!context) {
        throw new Error('TeePiece must be used within a PieceProvider');
    }

    const { setCubes } = context;

    const cube = new Vector3(0, 0, 0).clone().sub(origin).applyEuler(new Euler(rotation.x, rotation.y, rotation.z)).add(origin);
    const cubes = [cube];

    useEffect(() => {
        setCubes(cubes);
    }, [offset, rotation]);

    return <Cube location={cube.add(offset)} color={color} />;
};