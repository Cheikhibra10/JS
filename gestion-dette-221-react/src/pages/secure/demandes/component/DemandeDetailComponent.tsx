import { useState } from 'react';
import apiClient from '../../../../services/api-client';
import { useLocation } from 'react-router-dom';
import { useDettesDemandesArticles } from '../../../../hooks/useDette';
import { authService } from '../../../../services/AuthService';

export default function DemandeDetailComponent() {
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const { id } = location.state || {};
  const { data: demande, isLoading: demandeLoading } = useDettesDemandesArticles(id);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [isMessageVisible, setIsMessageVisible] = useState(false);

  const { 
    montant = 0, 
    montantVerser = 0, 
    montantDue = 0, 
    date = '', 
    prenom = 'N/A', 
    nom = 'N/A', 
    telephone = 'N/A', 
    user = 'N/A', 
    photo = '', 
    articles = [], 
    status = 'N/A' 
  } = demande || {}; 

  const handleAnnuler = async () => {
    const token = authService.getToken();
    try {
      // Update the status to 'ANNULE'
      await apiClient.patch(`/dettes/${id}/status`, {
        status: 'ANNULE',
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      // Fetch the message for the client
      const response = await apiClient.get(`/notifications/client/${demande?.clientId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const notificationMessage = response.data.message;

      // Send notification to the client
      await apiClient.post('/notifications', {
        clientId: demande?.clientId,
        message: `La demande ${articles[0]?.libelle} a été annulée ❌. 
        Veuillez nous contacter pour savoir les raisons 🙏`,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      showNotification('La demande a été annulée avec succès');
    } catch (error) {
      console.error(error);
      showNotification("Erreur lors de l'annulation de la demande");
    }
  };

  const handleConfirmer = async () => {
    const token = authService.getToken();
    try {
      // Update the status to 'ACCEPTE'
      await apiClient.patch(`/dettes/${id}/status`, {
        status: 'ACCEPTE',
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      // Fetch the message for the client
      const response = await apiClient.get(`/notifications/client/${demande?.clientId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const notificationMessage = response.data.message;
      console.log('sms',notificationMessage);
      
      // Send notification to the client
      await apiClient.post('/notifications', {
        clientId: demande?.clientId,
        message: `La demande ${articles[0]?.libelle} a été acceptée ✅. 
        Vous pouvez passez à la boutique 🙏`,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      showNotification('La demande a été acceptée avec succès');
    } catch (error) {
      console.error(error);
      showNotification("Erreur lors de l'acceptation de la demande");
    }
  };

  // Show the notification message and then hide it
  const showNotification = (msg: string) => {
    setMessage(msg);
    setIsMessageVisible(true);
    setTimeout(() => {
      setIsMessageVisible(false);
      setMessage('');
    }, 3000); // Hide message after 3 seconds
  };

  return (
    <main className="mt-8 mx-4 md:mr-8 rounded-xl bg-white p-4 screene shadow-sm flex flex-col">
      {isMessageVisible && (
       <div className="flex rounded-md bg-green-50 p-4 notification text-sm text-green-500 fade-in">
       <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="mr-3 h-5 w-5 flex-shrink-0">
       <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
       </svg>
       <div><b>Success alert: </b>{message}</div>
   </div>
      )}
      <div
        className="p-4 sm:p-6 md:p-8 mb-8"
        style={{ background: "linear-gradient(to right, #2b6cb0, #2d3748)" }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* No Data View */}
          <div className="stat-card rounded-lg p-4 sm:p-6 text-white font-semibold text-lg sm:text-xl md:text-2xl flex flex-col justify-between">
            <div className="flex flex-col justify-center space-y-4">
              <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 md:space-x-8">
                <img
                  src={photo || 'https://via.placeholder.com/150'}
                  alt="Client Photo"
                  className="w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full"
                />
                <div className="flex flex-col justify-between h-full pb-4 text-center sm:text-left">
                  <p>Prenom: {prenom || 'N/A'}</p>
                  <p>Nom: {nom || 'N/A'}</p>
                  <p>Tel: {telephone || 'N/A'}</p>
                </div>
              </div>
              <p className="email text-center sm:text-left">Email: {user}</p>
            </div>
          </div>
          {/* Carte Demandes en Cours */}
          <div className="stat-card rounded-lg p-4 sm:p-6 font-semibold text-white text-lg sm:text-xl md:text-3xl flex flex-col justify-between">
            <p>Montant Total: {montant || 0} FCFA</p>
            <p>Montant Versé: {montantVerser || 0} FCFA</p>
            <p>Montant Restant: {montantDue || 0} FCFA</p>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <div className="flex justify-end gap-4 mb-4">
          <button type="button" onClick={handleAnnuler} className="bg-red-500 text-white px-4 py-2 rounded"
            disabled={status === "ACCEPTE" || status === "ANNULE"}
          >
            ANNULER
          </button>
          <button type="button" onClick={handleConfirmer} className="bg-blue-600 text-white px-4 py-2 rounded"
            disabled={status === "ACCEPTE" || status === "ANNULE"}
          >
            CONFIRMER
          </button>
        </div>
        <table className="w-full">
          <thead>
            <tr className="bg-blue-500 text-white">
              <th className="py-2 px-4 text-center">DATE</th>
              <th className="py-2 px-4 text-center">ARTICLE</th>
              <th className="py-2 px-4 text-center">PRIX</th>
              <th className="py-2 px-4 text-center">QUANTITÉ</th>
              <th className="py-2 px-4 text-center">MONTANT</th>
            </tr>
          </thead>
          <tbody>
            {articles && articles.length > 0 ? (
              articles.map((article, index) => {
                const montantArticle = article.prixVente * (article.qteVente || 1);

                return (
                  <tr key={index}>
                    <td className="border-t border-gray-200 py-2 px-4 text-center">{date}</td>
                    <td className="border-t border-gray-200 py-2 px-4 text-center">{article.libelle}</td>
                    <td className="border-t border-gray-200 py-2 px-4 text-center">{article.prixVente} FCFA</td>
                    <td className="border-t border-gray-200 py-2 px-4 text-center">{article.qteVente || 1}</td>
                    <td className="border-t border-gray-200 py-2 px-4 text-center">{montantArticle} FCFA</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className="border-t border-gray-200 py-2 text-center">Aucun article trouvé.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
