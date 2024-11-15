import { useEffect, useState } from "react";
import ArticleApproSkeleton from "../../../skeleton/ArticleApproSkeleton";
import ArticleListSkeleton from "../../../skeleton/ArticleListSkeleton";
import ArticleApproComponent from "../../articles/components/ArticleApproComponent";
import ArticleListComponent from "../../articles/components/ArticleListComponent";
import { useArticleContext } from "../../../../utils/ArticleContext";
import { useDetteDemande } from "../../../../hooks/useDette";
import axiosFetch from "../../../../hooks/axios.fetch";
import useArticle from "../../../../hooks/useArticle";
import apiClient from "../../../../services/api-client";
import { authService } from "../../../../services/AuthService";
import { useDemande } from "../../../../utils/DemandeContext";
import { useAuth } from "../../../../utils/AuthProvider";

export function NouvelleDemandeComponent() {
  const { selectedArticles, quantities, total, clearAllArticles } = useArticleContext();
  const { user } = useAuth();
  const clientId = user?.client?.id;
  const { data: clientData } = useDetteDemande(clientId);
  const [isArticleListLoading, setIsArticleListLoading] = useState(true);
  const [isArticleApproLoading, setIsArticleApproLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [isMessageVisible, setIsMessageVisible] = useState(false)     ;
  const {  demandes } = useDemande();

  console.log('dta',clientData);
  
  const showNotification = (msg: string) => {
    setMessage(msg);
    setIsMessageVisible(true);
    setTimeout(() => {
      setIsMessageVisible(false);
    }, 3000); // Hide message after 3 seconds
  };
  const { data: allArticles } = useArticle();

 
//   const showNotificatione = (msg: string) => {
//     setMessagee(msg);
//     setIsMessageVisiblee(true);
//     setTimeout(() => {
//       setIsMessageVisiblee(false);
//       setMessagee('');
//     }, 3000); // Hide message after 3 seconds
//   };
  const { isLoading: isSaving, error: saveError } = axiosFetch.usePost(
    "/dettes/demande",
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
    {
      onSuccess: (data) => {
        console.log("Successfully saved dette:", data);
      },
      onError: (error) => {
        console.error("Error saving dette:", error);
      },
    }
  );

  useEffect(() => {
    const timer1 = setTimeout(() => setIsArticleListLoading(false), 2000);
    const timer2 = setTimeout(() => setIsArticleApproLoading(false), 2000);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);
  
  const client = user?.client;
  console.log('my', client);
  
  if (!client) {
    console.error("Client details are missing.");
    return;
  }
  
  const handleSave = async () => {
    if (!client || !selectedArticles.length) {
        alert("Please select a client and at least one article.");
        return;
    }

    const articlesWithDetails = selectedArticles.map((id) => ({
        id,
        qteVente: quantities[id] || 1,
        prixVente: allArticles?.find(article => article.id === id)?.prix || 0,
    }));

    // Validate if any selected article's quantity exceeds its stock
    for (const article of articlesWithDetails) {
        const availableStock = allArticles?.find(a => a.id === article.id)?.qteStock;
        const libelle = allArticles?.find(a => a.id === article.id)?.libelle;
        if (article.qteVente > availableStock) {
            alert(`Quantité choisie pour ${libelle} non disponible. Stock disponible: ${availableStock}`);
            return; // Stop the save operation if validation fails
        }
        console.log('ava',availableStock);        
    }
    if (client.categorieId === 2) { // Silver category check
        try {
            const token = authService.getToken();
            const response = await apiClient.get(`/clients/${client.id}/dettes`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            console.log('res',response);           
            const { max_montant} = response.data.data.client;
            if (total >= max_montant) {
                showNotification(`Le montant maximum de dette atteint. Limite: ${max_montant} FCFA`);
                return; // Stop the save operation if the debt exceeds max_montant
            }
        } catch (error) {
            console.error("Error checking client's debt status for Silver clients:", error);
            alert('Erreur lors de la vérification des dettes du client.');
            return;
        }
    }

    if (client.categorieId === 3) { 
        try {
            const token = authService.getToken();
            const response = await apiClient.get(`/clients/${client.id}/dettes`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            console.log(response);
            const cliente = response.data.data; // Directly access the client data
            const unpaidDebts = cliente.max_montantDue > 0;            
            console.log('rea',unpaidDebts);
            
            if (unpaidDebts) {
                showNotification("Veuillez rembourser la dette précédente d'abord.");
                return; 
            }
        } catch (error) {
            console.error("Error checking client's debt status for Bronze clients:", error);
            alert('Erreur lors de la vérification des dettes du client.');
            return;
        }
    }

    // Proceed with the save operation
    const payload = { clientId: client.id, articles: articlesWithDetails };

    try {
        const token = authService.getToken();
        await apiClient.post("/dettes/demande", payload, {
            headers: {
                'Content-Type': "application/json",
                'Authorization': `Bearer ${token}`,
            },
        });
        clearAllArticles();
        showNotification("La demande a été envoyée avec succès.");
    } catch (error) {
        console.error("Error saving demande:", error);
        alert('Error saving demande. Please try again.');
    }
};

const montant = clientData?.client?.max_montantDue;
  
  const montantVerser = clientData?.client?.totalMontantVerser;
  const montantDue = clientData?.client?.totalMontantRestant;
  
  

 // Inside your NouveauDemandeComponent

if (clientData && clientData.length > 0) {
    console.log('mo',montant);
  const montant = clientData?.client?.max_montant;
  const montantVerser = clientData[0].montantVerser;
  const montantDue = clientData.client.montantDue;

  return (
      <main className="mt-8 mx-4 md:mr-8 rounded-xl bg-white p-4 shadow-sm flex flex-col">
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
                      <div className="stat-card rounded-lg p-4 sm:p-6 text-white font-semibold text-lg sm:text-xl md:text-2xl flex flex-col justify-between">
                          <div className="flex flex-col justify-center space-y-4">
                              <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 md:space-x-8">
                                  <img
                                      src={user?.client?.photo || "https://images.unsplash.com/photo-1499714608240-22fc6ad53fb2"}
                                      alt="User Photo"
                                      className="w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full"
                                  />
                                  <div className="flex flex-col justify-between h-full pb-4 text-center sm:text-left">
                                      <p>Prenom: {user?.client?.prenom || "Unknown"}</p>
                                      <p>Nom: {user?.client?.nom || "Unknown"}</p>
                                      <p>Tel: {user?.client?.telephone || "N/A"}</p>
                                  </div>
                              </div>
                              <p className="email text-center sm:text-left">Email: {user?.login || "N/A"}</p>
                          </div>
                      </div>
                      <div className="stat-card rounded-lg p-4 sm:p-6 font-semibold text-white text-lg sm:text-xl md:text-3xl flex flex-col justify-between">
                          <p>Montant Total: {montant} FCFA</p>
                          <p>Montant Versé: {montantVerser} FCFA</p>
                          <p>Montant Restant: {montantDue} FCFA</p>
                      </div>
                  </div>
              </div>

              <div className="mb-4 flex justify-between flex-wrap">
                  <span className="text-gray-600 text-xl font-bold mb-2 sm:mb-0">Détails du Client</span>
              </div>

              <div className="product-lists">
                  {isArticleListLoading ? <ArticleListSkeleton /> : <ArticleListComponent />}
                  {isArticleApproLoading ? <ArticleApproSkeleton /> : <ArticleApproComponent />}
              </div>

              <button
                  className="bg-blue-500 text-white px-3 rounded mt-4"
                  onClick={handleSave}
                  disabled={selectedArticles.length === 0 || isSaving}
              >
                  {isSaving ? "Saving..." : "SAVE"}
              </button>

              {saveError && <div className="text-red-500 mt-2">Error: {saveError.message}</div>}
          </div>
      </main>
  );
} else {
  // Allow clients without debts to see the page
  return (
      <div>
          <main className="mt-8 mx-4 md:mr-8 rounded-xl bg-white p-4 screen shadow-sm flex flex-col">
              <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="p-4 sm:p-6 md:p-8 mb-8" style={{ background: "linear-gradient(to right, #2b6cb0, #2d3748)" }}>
                  {/* Client Details Section */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                      <div className="stat-card rounded-lg p-4 sm:p-6 text-white font-semibold text-lg sm:text-xl md:text-2xl flex flex-col justify-between">
                          <div className="flex flex-col justify-center space-y-4">
                              <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 md:space-x-8">
                                  <img
                                      src={user?.client?.photo || "https://images.unsplash.com/photo-1499714608240-22fc6ad53fb2"}
                                      alt="User Photo"
                                      className="w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full"
                                  />
                                  <div className="flex flex-col justify-between h-full pb-4 text-center sm:text-left">
                                      <p>Prenom: {user?.client?.prenom || "Unknown"}</p>
                                      <p>Nom: {user?.client?.nom || "Unknown"}</p>
                                      <p>Tel: {user?.client?.telephone || "N/A"}</p>
                                  </div>
                              </div>
                              <p className="email text-center sm:text-left">Email: {user?.login || "N/A"}</p>
                          </div>
                      </div>
                      <div className="stat-card rounded-lg p-4 sm:p-6 font-semibold text-white text-lg sm:text-xl md:text-3xl flex flex-col justify-between">
                          <p>Montant Total: {montant} FCFA</p>
                          <p>Montant Versé: {montantVerser} FCFA</p>
                          <p>Montant Restant: {montantDue} FCFA</p>
                      </div>
                  </div>
              </div>
                  <div>
                      <span className="text-gray-600 text-xl font-bold mb-2 sm:mb-0">Détails du Client</span>
                      <div className="product-lists">
                          {isArticleListLoading ? <ArticleListSkeleton /> : <ArticleListComponent />}
                          {isArticleApproLoading ? <ArticleApproSkeleton /> : <ArticleApproComponent />}
                      </div>
                  </div>
                  <button
                    className="text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-sm px-5 py-2.5"
                    onClick={handleSave}
                    disabled={selectedArticles.length === 0 || isSaving}
                  >
                      {isSaving ? "Saving..." : "VALIDER"}
                  </button>
              </div>
          </main>
      </div>
  );
}
}
