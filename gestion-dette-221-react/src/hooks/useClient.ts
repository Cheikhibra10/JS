import { useQuery } from "react-query";
import { Client } from "../models/client.model";
import axiosFetch from "./axios.fetch";
import { Dette } from "../models/dette.model";
import apiClient from "../services/api-client";




const useClient = () => {
    return axiosFetch.useData<Client>(
      '/clients', // API endpoint for fetching articles
      {}, // Optional Axios config (you can add headers like token if needed)
      { staleTime: 5000 } // Optional React Query options (e.g., 5 seconds stale time)
    );
  };

  export const useClientNotUser = () => {
    return axiosFetch.useData<Client>(
      '/clients?hasUser=false', // API endpoint for fetching articles
      {}, // Optional Axios config (you can add headers like token if needed)
      { staleTime: 5000 } // Optional React Query options (e.g., 5 seconds stale time)
    );
  };

  export const useClientHasUser = () => {
    return axiosFetch.useData<Client>(
      '/clients?hasUser=true', // API endpoint for fetching articles
      {}, // Optional Axios config (you can add headers like token if needed)
      { staleTime: 5000 } // Optional React Query options (e.g., 5 seconds stale time)
    );
  };

  export const useClientDettes = () => {
    return axiosFetch.useData<Client>(
      '/clients/dette',
      {}, 
      { staleTime: 5000 } 
    );
    
  };
  export const fetchDettesForClient = async (clientId: number): Promise<Dette[]> => {
    // Replace with the actual API call to fetch dettes
    return await apiClient.get(`/clients/${clientId}/dettes`);
};

export const storeTemporaryDemande = async (demandeBody) => {
  try {
    const token = localStorage.getItem('token'); // Fetch the token from localStorage
    const response = await apiClient.post(
      'dettes/demande/temporaire',
      demandeBody, // The body of the request
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Authorization header
        }
      }
    );
    return response; // Return the full response object
  } catch (error) {
    console.error('Error storing demande:', error);
    throw error; // Rethrow the error for handling in the component
  }
};
  

export const useTotalClient = () => {
  return axiosFetch.useData<Client>(
    '/clients/total/client', // API endpoint for fetching articles
    {}, // Optional Axios config (you can add headers like token if needed)
    { staleTime: 5000 } // Optional React Query options (e.g., 5 seconds stale time)
  );
};
 export default useClient; 