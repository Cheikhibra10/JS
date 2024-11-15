import React, { createContext, useContext, useState } from 'react';
import { Article } from '../models/article.model';
import { Client } from '../models/client.model';
import { storeTemporaryDemande } from '../hooks/useClient';

export interface Demande  {
    clientId: number;
    client: Client;
    articles: Article[];
    createdAt: string;
    status: string;
};
const DemandeContext = createContext<{ demandes: Demande[], storeDemande: (body: any) => Promise<void> } | undefined>(undefined);

export const useDemande = () => {
    const context = useContext(DemandeContext);
    if (!context) throw new Error("useDemande must be used within a DemandeProvider");
    return context;
};

export const DemandeProvider = ({ children }: { children: React.ReactNode }) => {
    const [temporaryDemandes, setTemporaryDemandes] = useState<Demande[]>([]); // <--- Add the correct type here

    const storeDemande = async (body: any) => {
        try {
            const response = await storeTemporaryDemande(body);
            const newDemande = response.data.demande as Demande; // Type the response
            setTemporaryDemandes((prevDemandes) => [...prevDemandes, newDemande]); // No more type error
        } catch (error) {
            console.error('Error in storeDemande:', error);
            throw error; // Rethrow for handling in the component
        }
    };

    return (
        <DemandeContext.Provider value={{ demandes: temporaryDemandes, storeDemande }}>
            {children}
        </DemandeContext.Provider>
    );
};
