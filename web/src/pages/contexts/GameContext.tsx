import { createContext } from 'react';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface GameContextType {

}

export const GameContext = createContext<GameContextType | undefined>(undefined);
