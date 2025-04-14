import { createContext, useState, useContext } from 'react';

// Create a context for captain data
export const CaptainDataContext = createContext();

const CaptainDataProvider = ({ children }) => {
    const [captain, setCaptain] = useState(null);  // Holds captain data
    const [isLoading, setIsLoading] = useState(false);  // Manages loading state
    const [error, setError] = useState(null);  // Manages error state

    // Function to update captain data
    const updateCaptain = (captainData) => {
        setCaptain(captainData);
    };

    const value = {
        captain,
        setCaptain,
        isLoading,
        setIsLoading,
        error,
        setError,
        updateCaptain,
    };

    return (
        <CaptainDataContext.Provider value={value}>
            {children}
        </CaptainDataContext.Provider>
    );
};

export default CaptainDataProvider;
