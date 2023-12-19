import { GameContext } from './GameContext';

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    return (
        <GameContext.Provider value={{  }}>
            {children}
        </GameContext.Provider>
    );
};