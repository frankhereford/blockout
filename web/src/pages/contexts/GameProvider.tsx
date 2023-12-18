import { useState } from 'react';
import type { Vector3 } from 'three';
import { GameContext } from './GameContext';

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [pieceType, setPieceType] = useState<'el' | 'tee' | 'block' | 'solo'>('el');
    const [cubes, setCubes] = useState<Vector3[]>([]);

    return (
        <GameContext.Provider value={{ pieceType, setPieceType, cubes, setCubes }}>
            {children}
        </GameContext.Provider>
    );
};