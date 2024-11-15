import { AxiosRequestConfig, CanceledError } from "axios";
import { useMutation, UseMutationOptions, useQuery, UseQueryOptions } from 'react-query';
import apiClient from "../services/api-client";
import { StatusCodes } from "http-status-codes";
import { authService } from "../services/AuthService";

interface FetchResponse<T> {
    status: StatusCodes;
    data: T; // The array of items returned
    message: string;
}

/**
 * Custom hook to fetch data from an API using `react-query` and Axios.
 * 
 * @template T - The type of data to be fetched (expected array of items).
 * 
 * @param {string} endpoint - The API endpoint to fetch data from.
 * @param {AxiosRequestConfig} [config] - Optional Axios configuration for the request.
 * @param {UseQueryOptions<T[], Error>} [options] - Optional react-query options for customization.
 * 
 * @returns {UseQueryResult<T[], Error>} - The query result, containing data, loading state, and error information.
 */
const useData = <T>(
  endpoint: string,
  config?: AxiosRequestConfig,
  options?: UseQueryOptions<T[], Error>
) => {
  return useQuery<T[], Error>(
    [endpoint], // Query key
    async () => {
      try {
        const token = authService.getToken(); // Get the JWT token for authentication
        console.log('Token:', token); 
        console.log('Requesting from:', endpoint);

        // Send the API request using Axios
        const response = await apiClient.get<{ data: T[] }>(endpoint, {
          ...config,
          headers: {
            ...config?.headers,
            Authorization: token ? `Bearer ${token}` : '', // Set the Authorization header if token exists
          },
        });

        console.log('Full API Response:', response); // Debug log for full API response
        const dataArray = response.data?.data || response.data; // Extract the data array
        console.log('Extracted Data:', dataArray); // Debug log for the extracted data
        return dataArray; // Return the extracted data

      } catch (error) {
        console.error('Error during fetch:', error); 
        throw error; // Throw the error to be handled by react-query
      }
    },
    options // Pass react-query options (e.g., refetch settings, retry, etc.)
  );
};

/**
 * Custom hook to send POST requests to an API using `react-query` and Axios.
 * 
 * @template T - The expected type of the response data.
 * @template P - The type of data to be posted (defaults to `unknown`).
 * 
 * @param {string} endpoint - The API endpoint to send the POST request to.
 * @param {AxiosRequestConfig} [config] - Optional Axios configuration for the request.
 * @param {UseMutationOptions<T, Error, P>} [options] - Optional react-query mutation options for customization.
 * 
 * @returns {UseMutationResult<T, Error, P>} - The mutation result, including methods to trigger the mutation.
 */
const usePost = <T, P = unknown>(
  endpoint: string,
  config?: AxiosRequestConfig,
  options?: UseMutationOptions<T, Error, P>
) => {
  return useMutation<T, Error, P>(
    async (data?: P): Promise<T> => {
      const token = authService.getToken();
      const isFormData = data instanceof FormData;

      const response = await apiClient.post<T>(endpoint, data, {
        ...config,
        headers: {
          ...config?.headers,
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': isFormData ? 'multipart/form-data' : 'application/json',
        },
      });

      return response.data;
    },
    options
  );
};


const usePut = <T, P = unknown>(
  endpoint: string,
  config?: AxiosRequestConfig, // Optional Axios config
  options?: UseMutationOptions<T, Error, P> // Optional mutation options
) => {
  return useMutation<T, Error, P>(
    async (data?: P): Promise<T> => {
      const token = authService.getToken(); // Retrieve the token

      const isFormData = data instanceof FormData;

      try {
        const response = await apiClient.put<FetchResponse<T>>(endpoint, data, {
          ...config,
          headers: {
            ...config?.headers,
            Authorization: token ? `Bearer ${token}` : '',
            'Content-Type': isFormData ? 'multipart/form-data' : 'application/json',
          },
        });
        return response.data.data; // Return the extracted data from the response
      } catch (error) {
        // Handle error, possibly log it or show a notification
        console.error("Error during PUT request:", error);
        throw error; // Rethrow the error for useMutation to handle
      }
    },
    options // Pass mutation options (e.g., success/failure callbacks, retry settings, etc.)
  );
};

export default {
    useData, usePost, usePut
}
