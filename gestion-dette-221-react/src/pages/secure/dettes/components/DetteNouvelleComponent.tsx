import React, { useEffect, useState } from "react";
import ArticleApproSkeleton from "../../../skeleton/ArticleApproSkeleton";
import ArticleListSkeleton from "../../../skeleton/ArticleListSkeleton";
import ArticleApproComponent from "../../articles/components/ArticleApproComponent";
import ArticleListComponent from "../../articles/components/ArticleListComponent";
import { useArticleContext } from "../../../../utils/ArticleContext";
import { useClientDettesDetails, useClientTelephone } from "../../../../hooks/useDette";
import axiosFetch from "../../../../hooks/axios.fetch";
import useArticle from "../../../../hooks/useArticle";

export default function DetteNouvelleComponent() {
  const { data, error, isLoading, refetch } = useClientDettesDetails();
  const { selectedArticles, quantities, clearAllArticles } = useArticleContext();
  const { data: client2 } = useClientTelephone();
  const [isArticleListLoading, setIsArticleListLoading] = useState(true);
  const [isArticleApproLoading, setIsArticleApproLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [isMessageVisible, setIsMessageVisible] = useState(false);
  
  const { data: allArticles } = useArticle(); 

  const { mutate: saveDette, isLoading: isSaving } = axiosFetch.usePost("/dettes", {}, {
    onSuccess: () => {
      console.log("Successfully saved dette:", data);
      refetch(); // Re-fetch dettes after saving to update the display.
      clearAllArticles();
      showNotification("La dette a été validée avec succès.");
    }
  });
  
  const showNotification = (msg) => {
    setMessage(msg);
    setIsMessageVisible(true);
    setTimeout(() => {
      setIsMessageVisible(false);
    }, 3000); // Hide message after 3 seconds
  };

  useEffect(() => {
    const loadArticles = () => {
      setIsArticleListLoading(false);
      setIsArticleApproLoading(false);
    };

    // Simulate loading articles
    const loadTimer = setTimeout(loadArticles, 2000);
    
    return () => clearTimeout(loadTimer); // Clean up the timer
  }, []);

  useEffect(() => {
    console.log("Client data:", data);
  }, [data]);

  const client = data?.[0]?.client || {};
  const clientEmail = client?.email;
  const clientEmaile = client2?.users[0]?.login;
  
  // Calculate total dettes, montantVerser, etc.
  const totalMontantDue = data?.reduce((acc, dette) => acc + dette.montantDue, 0) || 0;
  const totalMontantVerser = data?.reduce((acc, dette) => acc + dette.montantVerser, 0) || 0;
  const totalMontantRestant = totalMontantDue - totalMontantVerser;

  const handleSave = async (e) => {
    e.preventDefault();
    console.log("Save button clicked");

    // Check for required data
    if (!client2 || !selectedArticles.length) {
      console.error("Missing client data or no articles selected.");
      return;
    }

    // Map selected articles to include quantity and price details
    const articlesWithDetails = selectedArticles.map((articleId) => {
      const fullArticle = allArticles?.find((article) => article.id === articleId);
      if (!fullArticle) {
        console.error(`Article with id ${articleId} not found`);
        return null; // Return null for filtering out later
      }
      return {
        articleId,
        qteVente: quantities[articleId] || 1,
        prixVente: fullArticle.prix ?? 0,
      };
    }).filter((article) => article && article.qteVente > 0); // Exclude null and zero-quantity entries

    const payload = {
      clientId: client2?.id,
      articles: articlesWithDetails,
    };

    console.log('Final Payload:', payload);

    // Check if there are valid articles in the payload
    if (!payload.articles.length) {
      console.error("No valid articles to save");
      return;
    }

    // Try saving the payload and clearing articles after saving
    try {
      await saveDette(payload);  // Assume this function throws if an error occurs
      clearAllArticles();
      showNotification("La dette a été validée avec succès.");
    } catch (error) {
      console.error("Error saving dette:", error);
      showNotification("Une erreur est survenue lors de la sauvegarde de la dette.");
    }
  };

  return (
    <main className="mt-8 mx-4 md:mr-8 rounded-xl bg-white p-4 screen shadow-sm flex flex-col">
      {isMessageVisible && (
        <div className="flex rounded-md bg-green-50 p-4 notification text-sm text-green-500 fade-in">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="mr-3 h-5 w-5 flex-shrink-0">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
          </svg>
          <div><b>Success alert: </b>{message}</div>
        </div>
      )}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="p-4 sm:p-6 md:p-8 mb-8" style={{ background: "linear-gradient(to right, #2b6cb0, #2d3748)" }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            {/* Client Info */}
            <div className="stat-card rounded-lg p-4 sm:p-6 text-white font-semibold text-lg sm:text-xl md:text-2xl flex flex-col justify-between">
              <div className="flex flex-col justify-center space-y-4">
                <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 md:space-x-8">
                  {client?.photo || client2?.photo ? (
                    <img
                      src={client?.photo || client2?.photo || 'https://via.placeholder.com/150'}
                      alt="Client Photo"
                      className="w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full"
                    />
                  ) : (
                    <i className="fas fa-user-circle text-4xl sm:text-6xl text-gray-500"></i>
                  )}
                  <div className="flex flex-col justify-between h-full pb-4 text-center sm:text-left">
                    <p>Prenom: {client?.prenom || client2?.prenom || 'N/A'}</p>
                    <p>Nom: {client?.nom || client2?.nom || 'N/A'}</p>
                    <p>Tel: {client?.telephone || client2?.telephone || 'N/A'}</p>
                  </div>
                </div>
                <p className="email text-center sm:text-left">Email: {clientEmail || clientEmaile}</p>
              </div>
            </div>
            {/* Montant Details */}
            <div className="stat-card rounded-lg p-4 sm:p-6 font-semibold text-white text-lg sm:text-xl md:text-3xl flex flex-col justify-between">
              <p>Montant Total: {totalMontantDue} FCFA</p>
              <p>Montant Versé: {totalMontantVerser} FCFA</p>
              <p>Montant Restant: {totalMontantRestant} FCFA</p>
            </div>
          </div>
        </div>

        <div className="mb-4 flex justify-between flex-wrap">
          <span className="text-gray-600 text-xl font-bold mb-2 sm:mb-0">
            Nouvelle Dette
          </span>
        </div>

        <div className="product-lists">
          {isArticleListLoading ? <ArticleListSkeleton /> : <ArticleListComponent />}
          {isArticleApproLoading ? <ArticleApproSkeleton /> : <ArticleApproComponent />}
        </div>

        <button
          className="rounded-lg border bg-blue border-blue-500 bg-blue-500 px-5 py-2.5 text-center text-sm font-medium text-white shadow-sm transition-all hover:border-blue-700 hover:bg-blue-700 focus:ring focus:ring-blue-200 disabled:cursor-not-allowed disabled:border-blue-300 disabled:bg-blue-300"
          onClick={handleSave}
          disabled={selectedArticles.length === 0 || isSaving}
        >
          {isSaving ? "Validation en cours..." : "Valider la dette"}
        </button>
      </div>
    </main>
  );
}
