import { UserConnect } from "../models/user.model";
import axiosFetch from "./axios.fetch";


const useUser = () => {
    return axiosFetch.useData<UserConnect>(
      '/users', // API endpoint for fetching articles
      {}, // Optional Axios config (you can add headers like token if needed)
      { staleTime: 5000 } // Optional React Query options (e.g., 5 seconds stale time)
    );
  };
  
  export default useUser;