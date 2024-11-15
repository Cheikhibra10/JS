import React, { useState } from "react";
import { useClientsDettesDetails, useDetteArticles } from "../../../../hooks/useDette";
import { useLocation } from "react-router-dom";
import axiosFetch from "../../../../hooks/axios.fetch";

export default function DetteClientDetailComponent() {
  const { data, error, isLoading, refetch } = useClientsDettesDetails();
  const [activeTab, setActiveTab] = useState('articles');
  const [filterValue, setFilterValue] = useState('');
  const [montantPaye, setMontantPaye] = useState('');
  const { data: details } = useDetteArticles();
  const location = useLocation();
  const { montantDue, montantVerser: initialMontantVerser, montantRestant, id } = location.state || {};
  const [montantVerser, setMontantVerser] = useState(initialMontantVerser || 0); // Initialize state for montantVerser
  const [montantRestantState, setMontantRestant] = useState(montantRestant || 0); // Initialize state for montantRestant
  const [message, setMessage] = useState('');
  const [isMessageVisible, setIsMessageVisible] = useState(false);
  const [messagee, setMessagee] = useState('');
  const [isMessageVisiblee, setIsMessageVisiblee] = useState(false);
  // Payment hook
  const { mutate: createPayment } = axiosFetch.usePut(`/dettes/${id}/paiements`, 
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
    {
      onSuccess: () => {
        refetch(); // Refetch client details after successful payment
        showNotification('Le paiement a été successivement effectué');
      },
      onError: (error) => {
        console.error("Error saving payment:", error);
      },
    }
  );

  // Check for data availability
  if (!data || data.length === 0) {
    return <div>No dettes found</div>;
  } 
  
  const client = data[0]?.client;
  const clientEmail = client?.email || 'N/A';
  const articles = data[0]?.articles;


  const handlePaymentSubmit = async (e) => {
    e.preventDefault();

    if (montantRestantState <= 0) {
      showNotification('Le montant a déjà été entièrement payé.');
      return;
    }

    const montantToPay = parseFloat(montantPaye);
    if (isNaN(montantToPay) || montantToPay <= 0) {
      showNotification('Montant invalide');
      return;
    }

    if (montantToPay > montantRestantState) {
      showNotificatione('Le montant est supérieur au montant restant.');
      return;
    }

    try {
      await createPayment({ montant: montantToPay });

      const newMontantVerser = montantVerser + montantToPay;
      const newMontantRestant = montantDue - newMontantVerser;

      setMontantPaye(''); // Reset the input field
      setMontantVerser(newMontantVerser);
      setMontantRestant(newMontantRestant);
    } catch (error) {
      console.error('Error processing payment:', error);
    }
  };

  const showNotificatione = (msg) => {
    setMessagee(msg);
    setIsMessageVisiblee(true);
    setTimeout(() => {
      setIsMessageVisiblee(false);
      setMessagee('');
    }, 3000); // Hide message after 3 seconds
  };
  
  const showNotification = (msg) => {
    setMessage(msg);
    setIsMessageVisible(true);
    setTimeout(() => {
      setIsMessageVisible(false);
      setMessage('');
    }, 3000); // Hide message after 3 seconds
  };

  return (
    <main className="mt-8 mx-4 md:mr-8 rounded-xl bg-white screen p-4 shadow-sm flex flex-col">
      {isMessageVisiblee && ( 
           <div className="flex rounded-md bg-green-50 z-50 p-4 notificatione text-sm text-red-500 fade-in">
           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="mr-3 h-5 w-5 flex-shrink-0">
           <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
           </svg>
           <div><b>Error alert: </b>{messagee}</div>
       </div>
      )}
      {isMessageVisible && ( 
          <div className="flex rounded-md bg-green-50 z-50 p-4 notification text-sm text-green-500 fade-in">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="mr-3 h-5 w-5 flex-shrink-0">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
          </svg>
          <div><b>Success alert: </b>{message}</div>
      </div>
      )}
      <div className="p-4 sm:p-6 md:p-8 mb-8" style={{ background: "linear-gradient(to right, #2b6cb0, #2d3748)" }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <div className="stat-card rounded-lg p-4 sm:p-6 text-white font-semibold text-lg sm:text-xl md:text-2xl flex flex-col justify-between">
            <div className="flex flex-col justify-center space-y-4">
              <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 md:space-x-8">
                {client?.photo ? (
                  <img
                    src={client.photo || 'https://via.placeholder.com/150'}
                    alt="Client Photo"
                    className="w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full"
                  />
                ) : (
                  <i className="fas fa-user-circle text-4xl sm:text-6xl text-gray-500"></i>
                )}
                <div className="flex flex-col justify-between h-full pb-4 text-center sm:text-left">
                  <p>Prenom: {client?.prenom || 'N/A'}</p>
                  <p>Nom: {client?.nom || 'N/A'}</p>
                  <p>Tel: {client?.telephone || 'N/A'}</p>
                </div>
              </div>
              <p className="email text-center sm:text-left">Email: {clientEmail}</p>
            </div>
          </div>
          <div className="stat-card rounded-lg p-4 sm:p-6 font-semibold text-white text-lg sm:text-xl md:text-3xl flex flex-col justify-between">
            <p>Montant Total: {montantDue} FCFA</p>
            <p>Montant Versé: {montantVerser} FCFA</p>
            <p>Montant Restant: {montantRestantState} FCFA</p>
          </div>
        </div>
      </div>
      
      <div className="flex justify-start mb-2">
        <button
          className={`px-6 py-2 ${activeTab === 'articles' ? 'bg-blue-800 text-white' : 'border-b-2 border-blue-800'} font-semibold`}
          onClick={() => handleTabChange('articles')} disabled
        >
          Articles
        </button>
        <button
          className={`px-6 py-2 ${activeTab === 'paiements' ? 'bg-blue-800 text-white' : 'border-b-2 border-blue-800'} font-semibold`}
          disabled
        >
          Paiements
        </button>
      </div>
      {activeTab === 'articles' ? (
        <div className="flex flex-col lg:flex-row justify-between gap-4 mb-6 w-full">
          <div className="bg-white rounded-lg shadow p-4 w-full lg:w-2/3">
            <table className="w-full text-center">
              <thead className="bg-blue-700 text-white">
                <tr>
                  <th className="py-2 px-4 text-center">Article</th>
                  <th className="py-2 px-4 text-center">Prix</th>
                  <th className="py-2 px-4 text-center">Quantité</th>
                </tr>
              </thead>
              <tbody>
                {details?.articles && details.articles.length ? (
                  details.articles.map((article) => (
                    <tr key={article.id} className="border-b">
                      <td className="py-2 px-4 text-center">{article.article.libelle}</td>
                      <td className="py-2 px-4 text-center">{article.prixVente} FCFA</td>
                      <td className="py-2 px-4 text-center">{article.qteVente}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="py-2 px-4 text-center">    
                      No articles available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className="mt-4 flex justify-end space-x-1">
            <button className="bg-blue-600 text-white py-1 px-3 rounded-l-md">1</button>
              <button className="bg-gray-200 text-gray-600 py-1 px-3 rounded-md hover:bg-gray-300 focus:outline-none">
                &lt;
              </button>
              <button className="bg-blue-600 text-white py-1 px-3 rounded-r-md">2</button>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 w-full lg:w-1/3">
            <form onSubmit={handlePaymentSubmit}>
              <div className="flex flex-col mb-4">
                <label htmlFor="montantPaye" className="font-semibold mb-2 text-blue-800">Montant à payer: {montantRestantState} FCFA</label>
                <input
                  type="number"
                  id="montantPaye"
                  value={montantPaye}
                  onChange={(e) => setMontantPaye(e.target.value)}
                  className="border rounded-lg p-2"
                  required
                />
              </div>
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700" 
                disabled={montantRestantState == 0}
              >
                Effectuer le paiement
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div>
          <p>Details des paiements</p>
          {/* Render payment details here */}
        </div>
      )}
    </main>
  );
}
