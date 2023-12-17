import { useState } from 'react';
import { PieceContext } from './PieceContext';

export const PieceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [pieceType, setPieceType] = useState<'el' | 'tee' | 'block' | 'solo'>('el');

    return (
        <PieceContext.Provider value={{ pieceType, setPieceType }}>
            {children}
        </PieceContext.Provider>
    );
};