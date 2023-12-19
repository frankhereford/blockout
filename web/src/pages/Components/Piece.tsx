import { Cube } from './Cube';
import { pieces } from './pieces';
import type { PieceType } from './pieces';
import { Vector3, Euler } from 'three';

interface PieceProps {
    piece?: PieceType;
    location?: Vector3;
    rotation?: Vector3;
}

export const Piece = ({ piece = 'tee', location = new Vector3(0, 0, 0), rotation = new Vector3(0, 0, 0) }: PieceProps) => {

    const createCubes = (pieceName: PieceType) => {
        const { coordinates, color, origin } = pieces[pieceName];
        const rotation_unit = Math.PI / 2;
        const eulerRotation = new Euler(rotation.x * rotation_unit, rotation.y * rotation_unit, rotation.z * rotation_unit);
        return coordinates.map((coordinate, index) => {
            const offsetCoordinate = coordinate.clone().sub(origin);
            offsetCoordinate.applyEuler(eulerRotation);
            offsetCoordinate.add(origin);
            offsetCoordinate.add(location);
            return <Cube key={index} location={offsetCoordinate} color={color} />;
        });
    };

    return (
        <>
            {createCubes(piece)} 
        </>
    );

};
