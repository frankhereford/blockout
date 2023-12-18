import { createContext } from 'react';
import { Vector3 } from 'three';

interface GameContextType {
    pieceType: 'el' | 'tee' | 'block' | 'solo';
    setPieceType: (pieceType: 'el' | 'tee' | 'block' | 'solo') => void;
    cubes: Vector3[];
    setCubes: (cubes: Vector3[]) => void;
}

export const GameContext = createContext<GameContextType | undefined>(undefined);