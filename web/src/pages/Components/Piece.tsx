import { Cube } from './Cube';
import { pieces } from './pieces';

type PieceType = 'el' | 'tee' | 'block' | 'solo';

interface PieceProps {
    piece: PieceType;
}

export const Piece = ({ piece = 'tee' }: PieceProps) => {

    const createCubes = (pieceName: PieceType) => {
        const { coordinates, color } = pieces[pieceName];
        return coordinates.map((coordinate, index) => <Cube key={index} location={coordinate} color={color} />);
    };

    return (
        <>
            {createCubes(piece)} 
        </>
    );
};