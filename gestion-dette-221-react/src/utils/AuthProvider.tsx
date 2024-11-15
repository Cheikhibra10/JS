import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { UserConnect, UserConnectOrNull } from '../models/user.model'; // Import UserConnect type
import { Dette } from '../models/dette.model';
import { fetchDettesForClient } from '../hooks/useClient';

// Define the shape of the authentication context
interface AuthContextProps {
  user: UserConnectOrNull; // Current user or null if not logged in
  setUser: React.Dispatch<React.SetStateAction<UserConnectOrNull>>; // Function to update user state
  isAdmin: () => boolean; // Function to check if user is admin
  isBoutiquier: () => boolean; // Function to check if user is boutiquier
  isClient: () => boolean; // Function to check if user is client
  dettes: Dette[]; // Include dettes array in context
}

// Create the authentication context
const AuthContext = createContext<AuthContextProps | undefined>(undefined);

interface Props {
  children: ReactNode; // Children components
}

// Mock function to simulate fetching dettes by clientId (replace with real API call)
export const fetchDettesForUser = async (user: UserConnect): Promise<Dette[]> => {
  if (user.clientId) {
      return await fetchDettesForClient(user.clientId); // Call your API or service
  }
  return []; // Return an empty array if no clientId
};


// AuthProvider component to provide authentication context
const AuthProvider = ({ children }: Props) => {
    const [user, setUser] = useState<UserConnectOrNull>(null); // Initialize user state
    const [dettes, setDettes] = useState<Dette[]>([]); // Initialize dettes state
  
    useEffect(() => {
        // Load user from localStorage if available
        const storedUser = localStorage.getItem('user');
        // console.log('sto',storedUser);
        
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser); // Parse and set user state
            } catch (error) {
                console.error("Failed to parse user from localStorage:", error);
            }
        }
    }, []); // Only run on mount
  
    // Effect to fetch dettes whenever user changes
    useEffect(() => {
        const fetchDettes = async () => {
            if (user) {
                const userDettes = await fetchDettesForUser(user);
                setDettes(userDettes);
            }
        };
        fetchDettes();
    }, [user]); // Fetch dettes whenever user changes
  
    // Function to check if the user is an admin
    const isAdmin = () => {
        return user?.role === 'ADMIN';
    };
  
    // Function to check if the user is a boutiquier
    const isBoutiquier = () => {
        return user?.role === 'BOUTIQUIER';
    };
  
    // Function to check if the user is a client
    const isClient = () => {
        return user?.role === 'CLIENT';
    };
  
    return (
        <AuthContext.Provider value={{ user, setUser, isAdmin, isBoutiquier, isClient, dettes }}>
            {children}
        </AuthContext.Provider>
    );
  };
  
export default AuthProvider;

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext); // Access the context
  if (context === undefined) {
      throw new Error('useAuth must be used within an AuthProvider'); // Error if used outside provider
  }
  return context; // Return context values
};

// Define the expected shape of the Dette context data
interface DetteContextType {
    telephone: string; // Telephone number
    detteData: any; // Placeholder for dette-related data
    setDetteData: React.Dispatch<any>; // Function to update dette data
}

const DetteContext = createContext<DetteContextType | null>(null); // Create Dette context

// Custom hook to use the DetteContext
export const useDette = (): DetteContextType => {
    const context = useContext<DetteContextType | null>(DetteContext); // Access context
    if (!context) {
        throw new Error("useDette must be used within a DetteProvider"); // Error if used outside provider
    }
    return context; // Return context values
};

// DetteProvider component to provide Dette context
export const DetteProvider = ({ children }: Props) => {
    const [detteData, setDetteData] = useState<any>({
        telephone: '', // Initialize telephone
        // other detteData fields as needed
    });

    return (
        <DetteContext.Provider value={{ ...detteData, setDetteData }}>
            {children} 
        </DetteContext.Provider>
    );
};


