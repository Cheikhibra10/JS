import { jwtDecode } from "jwt-decode";
import apiClient, { RestResponse } from "./api-client";

export interface Credentials {
    login: string,  // User's login identifier
    password: string // User's password
}

export type CredentialsOrNull = Credentials | null; // Type alias for credentials or null

// Function to log in and fetch a token
const login = (credentials: CredentialsOrNull) => {
    return apiClient.post<RestResponse<{token: string}>>('/auth/login', credentials);
}



// Function to log out and remove token from local storage
const logout = () => {
    localStorage.removeItem('token'); // Clear token from local storage
}

/** 
 * Check if a user is logged in
 * @returns {boolean} - True if logged in, otherwise false
*/
const isLogged = () => {
    const token = localStorage.getItem('token'); // Get token from local storage
    return !!token; // Return true if token exists, false otherwise
}

/** 
 * Retrieve the stored token
 * @returns {string} - The stored token or null if not found
*/
const getToken = () => {
    const token = localStorage.getItem('token');
    console.log("Retrieved token:", token); // Log token for verification
    return token; // Return the token
};

/** 
 * Get the payload of the token
 * @returns {object} - Decoded token payload
*/
const getTokenInfo = () => {
    const token = getToken();
    if (!token) {
        console.log("No token found"); // Log if token is not found
        return null; // Return null if no token
    }
    return jwtDecode(token); // Decode and return token info
}

// Save the token to local storage
const saveToken = (token: string) => {
    localStorage.setItem('token', token); // Store token in local storage
    console.log("Token saved:", token); // Log saved token
}


// Exporting the authentication service functions
export const authService = {
    login, 
    logout, 
    isLogged, 
    getToken, 
    getTokenInfo, 
    saveToken
}
