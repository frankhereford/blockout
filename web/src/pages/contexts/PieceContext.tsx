import { createContext, useContext } from 'react';
import { Vector3 } from 'three';

interface PieceContextType {
    pieceType: 'el' | 'tee' | 'block' | 'solo';
    setPieceType: (pieceType: 'el' | 'tee' | 'block' | 'solo') => void;
    cubes: Vector3[];
    setCubes: (cubes: Vector3[]) => void;
}

export const PieceContext = createContext<PieceContextType | undefined>(undefined);