import axiosFetch from "./axios.fetch";

interface Article {
  id: number;
  libelle: string;
  prix: number;
  qteStock: number;
}
const useArticle = () => {
    return axiosFetch.useData<Article>(
      '/articles', // API endpoint for fetching articles
      {}, // Optional Axios config (you can add headers like token if needed)
      { staleTime: 5000 } // Optional React Query options (e.g., 5 seconds stale time)
    );
  };
 
  export const useArticleQteStock = () => {
    return axiosFetch.useData<Article>(
      '/articles/qteStock', // API endpoint for fetching articles
      {}, // Optional Axios config (you can add headers like token if needed)
      { staleTime: 5000 } // Optional React Query options (e.g., 5 seconds stale time)
    );
  };
  export default useArticle;