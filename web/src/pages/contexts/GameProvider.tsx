import { useState } from 'react';
import { Vector3 } from 'three';
import { GameContext } from './GameContext';

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [pieceType, setPieceType] = useState<'el' | 'tee' | 'block' | 'solo'>('el');
    const [cubes, setCubes] = useState<Vector3[]>([]);
    const [baseCubes, setBaseCubes] = useState<Vector3[]>([]);
    const [baseOrigin, setBaseOrigin] = useState<Vector3>(new Vector3(0,0,0));

    return (
        <GameContext.Provider value={{ pieceType, setPieceType, cubes: cubes, setCubes, baseCubes: baseCubes, setBaseCubes, baseOrigin, setBaseOrigin }}>
            {children}
        </GameContext.Provider>
    );
};