import { createContext, useContext } from 'react';

interface PieceContextType {
    pieceType: 'el' | 'tee' | 'block' | 'solo';
    setPieceType: (pieceType: 'el' | 'tee' | 'block' | 'solo') => void;
}

export const PieceContext = createContext<PieceContextType | undefined>(undefined);