import { createContext } from 'react';
import type { Vector3 } from 'three';

interface GameContextType {
    pieceType: 'el' | 'tee' | 'block' | 'solo';
    setPieceType: (pieceType: 'el' | 'tee' | 'block' | 'solo') => void;
    cubes: Vector3[];
    setCubes: (cubes: Vector3[]) => void;
    baseCubes: Vector3[];
    setBaseCubes: (cubes: Vector3[]) => void;
    baseOrigin: Vector3;
    setBaseOrigin: (cubes: Vector3) => void;
}

export const GameContext = createContext<GameContextType | undefined>(undefined);
