import { useState } from 'react';
import type { Vector3 } from 'three';
import { PieceContext } from './PieceContext';

export const PieceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [pieceType, setPieceType] = useState<'el' | 'tee' | 'block' | 'solo'>('el');
    const [cubes, setCubes] = useState<Vector3[]>([]);

    return (
        <PieceContext.Provider value={{ pieceType, setPieceType, cubes, setCubes }}>
            {children}
        </PieceContext.Provider>
    );
};