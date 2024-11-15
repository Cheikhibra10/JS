import { useParams } from "react-router-dom";
import axiosFetch from "./axios.fetch";
import { Dette } from "../models/dette.model";
import { useAuth, useDette } from "../utils/AuthProvider";
import { useEffect } from "react";
import axios from "axios";
import { Client } from "../models/client.model";
import { useQuery } from "react-query";
import apiClient from "../services/api-client";
import { authService } from "../services/AuthService";

export const useClientDettesDetails = () => {
    const { telephone } = useParams<{ telephone: string }>(); // Extract the telephone from URL parameters
  
    console.log("Telephone from URL:", telephone); // Log the telephone value
  
    if (!telephone) {
      throw new Error("Telephone parameter is missing");
    }
  
    const { data, error, isLoading, refetch } = axiosFetch.useData<Dette>(
      `/clients/${telephone}/dette`, 
      {}, 
      { staleTime: 5000 }
    );
  
    console.log("Dette Data:", data);
    console.log("Error:", error);
    console.log("Loading:", isLoading);
  
    return { data, error, isLoading, refetch };
  };
  
  export const useClientTelephone = () => {
    const { telephone } = useParams<{ telephone: string }>(); // Extract the telephone from URL parameters
  
    console.log("Telephone from URL:", telephone); // Log the telephone value
  
    if (!telephone) {
      throw new Error("Telephone parameter is missing");
    }
  
    const { data, error, isLoading } = axiosFetch.useData<Dette>(
      `/clients/telephone/${telephone}`, 
      {}, 
      { staleTime: 5000 }
    );
  
    console.log("Dette Data:", data);
    console.log("Error:", error);
    console.log("Loading:", isLoading);
  
    return { data, error, isLoading };
  };

  export const useClientsDettesDetails = () => {
    const { telephone } = useParams<{ telephone: string }>(); // Extract the telephone from URL parameters
  
    if (!telephone) {
      throw new Error("Telephone parameter is missing"); // Ensure parameter is present
    }
  
    // Use a standard API call instead of a hook-based fetch
    return useQuery(['clientDette', telephone], async () => {
      const token = authService.getToken(); // Get token
  
      const response = await apiClient.get(`/clients/${telephone}/dette`, {
        headers: {
          'Authorization': `Bearer ${token}`, // Pass the token in the headers
        },
      });
  
      console.log('response', response); // For debugging, if needed
      
      // Access the nested data
      return response.data.data; // Return the actual data array
    }, {
      staleTime: 5000, // Customize staleTime if needed
    });
  };
  

export const useClientDettesDetailes = () => {
    const { telephone } = useDette(); // Access telephone from context
  
    console.log("Telephone from context:", telephone); // Log the telephone value
    
    if (!telephone) {
      throw new Error("Telephone parameter is missing");
    }
  
    const { data, error, isLoading } = axiosFetch.useData<Dette>(
      `/clients/${telephone}/dette`,
      {},
      { staleTime: 5000 }
    );
  
    console.log("Dette Data:", data);
    console.log("Error:", error);
    console.log("Loading:", isLoading);
  
    return { data, error, isLoading };
  };

export const useDetteArticles = () => {
    const { id } = useParams<{ id: string }>(); // Extract id from URL params

if (!id) {
    throw new Error("id parameter is missing");
}

// Use axios to fetch the articles data
const { data, error, isLoading } = axiosFetch.useData<Dette>(
    `/dettes/${id}/articles`, // Use id in the request URL
    {}, 
    { staleTime: 5000 }
);

return { data, error, isLoading };
};  

export const useDettesArticles = () => {
  const { id } = useParams<{ id: string }>(); // Extract id from URL params

  if (!id) {
    throw new Error("Client ID is missing");
  }

  // Fetch dette details with articles using react-query
  const { data, error, isLoading } = useQuery(
    ['detteArticles', id],
    async () => {
      const response = await apiClient.get(`/dettes/dette/${id}/articles`);
      return response.data;
    },
    {
      staleTime: 5000, // 5 seconds cache
      retry: 1, // Retry once if the request fails
    }
  );

  return { data, error, isLoading };
};  

export const useDetteId = () => {
  const { id } = useParams<{ id: string }>(); // Extract id from URL params

if (!id) {
  throw new Error("id parameter is missing");
}

// Use axios to fetch the articles data
const { data, error, isLoading } = axiosFetch.useData<Dette>(
  `/dettes/${id}`, // Use id in the request URL
  {}, 
  { staleTime: 5000 }
);

return { data, error, isLoading };
};  

export const useClientDettesDetailsArticle = () => {
    const { setDetteData } = useDette(); // Accessing setDetteData to update the context
  
    useEffect(() => {
      // Fetch dette data from API
      const fetchDettes = async () => {
        try {
          const response = await axios.get("/dettes");
          setDetteData(response.data); // Set the fetched data in context
        } catch (error) {
          console.error("Failed to fetch dettes data", error);
        }
      };
  
      fetchDettes();
    }, [setDetteData]);
  
    return {}; // This hook can return data or functions if needed
  };

  export const useDetteDemande = (clientId: any) => {
    return axiosFetch.useData<Client>(`clients/${clientId}/dettes`, {}, { staleTime: 5000 });
  };
   
  export const useDetteArticle = (id: any) => {  
  if (!id) {
    throw new Error("id parameter is missing");
  }
  
  // Use axios to fetch the articles data
  const { data, error, isLoading } = axiosFetch.useData<Dette>(
    `/dettes/${id}/articles`, // Use id in the request URL
    {}, 
    { staleTime: 5000 }
  );
  
  return { data, error, isLoading };
  };  
  
  export const useDettesDemandesArticles = (id: any) => {  
    if (!id) {
      throw new Error("id parameter is missing");
    }
    
    // Use axios to fetch the articles data
    const { data, error, isLoading } = axiosFetch.useData<Dette>(
      `/dettes/${id}/demande/articles`, // Use id in the request URL
      {}, 
      { staleTime: 5000 }
    );
    
    return { data, error, isLoading };
    };

  export const useDetteDemandes = () => {
    return axiosFetch.useData<Dette>(
      '/dettes', // API endpoint for fetching articles
      {}, // Optional Axios config (you can add headers like token if needed)
      { staleTime: 5000 } // Optional React Query options (e.g., 5 seconds stale time)
    );
  };

  export const useDetteDemandesEnCours = () => {
    return axiosFetch.useData<Dette>(
      '/dettes/total/demande', // API endpoint for fetching articles
      {}, // Optional Axios config (you can add headers like token if needed)
      { staleTime: 5000 } // Optional React Query options (e.g., 5 seconds stale time)
    );
  };

  export const useTotalDettes = () => {
    return axiosFetch.useData<Dette>(
      '/dettes/total/dette', // API endpoint for fetching articles
      {}, // Optional Axios config (you can add headers like token if needed)
      { staleTime: 5000 } // Optional React Query options (e.g., 5 seconds stale time)
    );
  };
  export const useDetteDemandesClientConnected = () => {
    return axiosFetch.useData<Dette>(
      '/dettes/demandes/client', // API endpoint for fetching articles
      {}, // Optional Axios config (you can add headers like token if needed)
      { staleTime: 5000 } // Optional React Query options (e.g., 5 seconds stale time)
    );

    
  };