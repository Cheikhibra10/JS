import { useEffect } from "react";
import { useAuth } from "./AuthProvider";
import { authService } from "../services/AuthService";
import { UserConnect } from "../models/user.model";

export const useLoginUser = () => {
    const { setUser } = useAuth();

    const loginUser = async (userData: UserConnect) => {
        let clientData = null;

        if (userData.clientId) {
            clientData = await fetchClientById(userData.clientId);  
        }

        setUser({
            ...userData,
            client: clientData
        });
    };

    const fetchClientById = async (clientId: number) => {
        const response = await fetch(`/api/clients/${clientId}`);
        return await response.json();
    };

    return { loginUser };
};
