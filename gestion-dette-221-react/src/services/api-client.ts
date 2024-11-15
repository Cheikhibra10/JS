import axios from "axios";

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    timeout: 60000,
    headers: {
        'Content-Type': 'application/json',
    }
})

export interface RestResponse<T> {
    message: string,
    status: string, 
    results: T,
    data: T
}



export default apiClient;
