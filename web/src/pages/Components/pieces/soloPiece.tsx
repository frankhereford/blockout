import { Vector3, Euler } from 'three';
import { Cube } from '../Cube';

interface SoloPieceProps {
    offset: Vector3;
    rotation?: Vector3;
    origin?: Vector3;
}

export const SoloPiece = ({ offset, rotation = new Vector3(0, 0, 0), origin = new Vector3(0,0,0) }: SoloPieceProps) => {
    const cube = new Vector3(0, 0, 0).clone().sub(origin).applyEuler(new Euler(rotation.x, rotation.y, rotation.z)).add(origin);

    return <Cube location={cube.add(offset)} />;
};