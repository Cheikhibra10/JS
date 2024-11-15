import React, { useEffect, useState } from "react";
import { useDetteDemandesClientConnected } from "../../../../hooks/useDette";
import apiClient from "../../../../services/api-client";
import { authService } from "../../../../services/AuthService";
import { addMinutes, isBefore } from 'date-fns';

export default function DemandeListComponent() {
  const { data: demandes = [] } = useDetteDemandesClientConnected();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState<string>("EN_COURS");
  const demandesPerPage = 2;
  const [message, setMessage] = useState('');
  const [isMessageVisible, setIsMessageVisible] = useState(false);
  const filteredDemandes = demandes.filter(demande => demande.status === selectedStatus);
  const totalPages = Math.ceil(filteredDemandes.length / demandesPerPage);
  const startIndex = (currentPage - 1) * demandesPerPage;
  const currentDemandes = filteredDemandes.slice(startIndex, startIndex + demandesPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleRelance = async (id: number) => {
    const token = authService.getToken();
    try {
      const response = await apiClient.put(
        `/dettes/relance/${id}`,
        {}, // Empty body if not needed
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      console.log("Relance successful:", response.data);
      console.log('res', response);
      showNotification('La demande a été relancée avec success')
    } catch (error) {
      console.error("Error relancing demande:", error.response?.data || error.message);
    }
  };

  const isRelanceDisabled = (updatedAt: string) => {
    const updatedAtDate = new Date(updatedAt); // Convert string to Date
    
    // Add 5 minutes (5 * 60 * 1000 milliseconds) to the updatedAt date
    const fiveMinutesAfterCancellation = new Date(updatedAtDate.getTime() + 5 * 60 * 1000);
    
    // Get the current date and time
    const currentDate = new Date();
    
    // Return true if current date is before five minutes after updatedAt, false otherwise
    return currentDate > fiveMinutesAfterCancellation;
  };
  
  const showNotification = (msg: string) => {
    setMessage(msg);
    setIsMessageVisible(true);
    setTimeout(() => {
      setIsMessageVisible(false);
      setMessage('');
    }, 3000); // Hide message after 3 seconds
  };

  return (
    <main className="mt-8 mx-4 md:mr-8 rounded-xl bg-white p-4 shadow-sm flex screene flex-col main-content">
      {isMessageVisible && (
       <div className="flex rounded-md bg-green-50 p-4 notification text-sm text-green-500 fade-in">
       <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="mr-3 h-5 w-5 flex-shrink-0">
       <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
       </svg>
       <div><b>Success alert: </b>{message}</div>
       <button className="ml-auto" onClick={() => setIsMessageVisible(false)}>
       <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
           <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
       </svg>
       </button>
   </div>
      )}
      <div className="product-lists">
        <div className="product-list bg-white rounded-lg shadow p-4 w-full">
          <div className="flex justify-between items-center mb-4">
            <div className="text-xl font-bold">Liste des demandes</div>
            <div className="flex items-center">
              <label htmlFor="status" className="mr-2">Statut :</label>
              <select 
                id="status" 
                className="border border-gray-300 rounded px-2 py-1"
                value={selectedStatus}
                onChange={(e) => {
                  setSelectedStatus(e.target.value);
                  setCurrentPage(1); // Reset to first page when status changes
                }}
              >
                <option value="EN_COURS">En cours</option>
                <option value="ACCEPTE">Accepté</option>
                <option value="ANNULE">Annulé</option>
              </select>
            </div>
          </div>
          <div className="overflow-hidden rounded-lg border border-gray-200 shadow-md">
            <table className="min-w-full border-collapse bg-white text-left text-sm text-gray-500">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-2 px-4 text-center">DATE</th>
                  <th className="py-2 px-4 text-center">MONTANT</th>
                  <th className="py-2 px-4 text-center">ARTICLE</th>
                  <th className="py-2 px-4 text-center">TELEPHONE</th>
                  <th className="py-2 px-4 text-center">STATUS</th>
                  {selectedStatus === "ANNULE" && (
                    <th className="py-2 px-4 text-center">ACTION</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {currentDemandes.length > 0 ? (
                  currentDemandes.map((demande) => {
                    const { id, client, articles, date, status, updatedAt } = demande;
                    const { nom = "N/A", prenom = "N/A", telephone = "N/A" } = client || {};
                    const dateFormatted = new Date(date).toLocaleDateString();
                    const montantTotal = (articles || []).reduce((sum, article) => sum + (article.prixVente || 0), 0);
                    const statusClass = status === "ACCEPTE" ? "text-green-500" : status === "ANNULE" ? "text-red-500" : "text-gray-500";

                    return (
                      <tr key={id}>
                        <td className="border-t border-gray-200 py-2 px-4 text-center">{dateFormatted}</td>
                        <td className="border-t border-gray-200 py-2 px-4 text-center">{montantTotal.toLocaleString()} FCFA</td>
                        <td className="border-t border-gray-200 py-2 px-4 text-center">
                          {articles && articles.length > 0 ? (
                            articles.map((article, idx) => (
                              <span key={article.article.id}>
                                {article.article.libelle}
                                {idx < articles.length - 1 && ", "}
                              </span>
                            ))
                          ) : (
                            "N/A"
                          )}
                        </td>
                        <td className="border-t border-gray-200 py-2 px-4 text-center">{telephone}</td>
                        <td className="px-6 py-4 text-center space-x-4">
                          {status === "ACCEPTE" ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-xs font-semibold text-green-600">
                              ACCEPTÉ
                            </span>
                          ) : status === "ANNULE" ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-1 text-xs font-semibold text-red-600">
                              ANNULÉ
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-600">
                              {status}
                            </span>
                          )}
                        </td>
                        {status === "ANNULE" && (
                          <td className="px-6 py-4 text-center">
                            <button
                              title="RELANCÉE LA DEMANDE"
                              className={`rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-600 ${
                                isRelanceDisabled(updatedAt) ? 'cursor-not-allowed opacity-50' : ''
                              }`}
                              onClick={() => handleRelance(id)}
                              disabled={isRelanceDisabled(updatedAt)}
                            >
                              RELANCÉE
                              <i className="fas fa-user-plus mr-2"></i>
                            </button>
                          </td>
                        )}
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="border-t border-gray-200 py-2 px-4 text-center">Aucune demande à afficher.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="w-full h-12 flex justify-between mt-4 flex-wrap">
            <div className="flex justify-center mt-2">
              <nav aria-label="Pagination">
                <ul className="inline-flex items-center space-x-1 rounded-md text-sm">
                  <li>
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`inline-flex items-center space-x-2 rounded-full border border-gray-300 bg-white px-2 py-2 font-medium text-gray-500 hover:bg-gray-50 ${
                        currentPage === 1 ? 'cursor-not-allowed opacity-50' : ''
                      }`}
                    >
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </li>
                  <li>
                    <span className="font-medium text-gray-700">{currentPage}/{totalPages}</span>
                  </li>
                  <li>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`inline-flex items-center space-x-2 rounded-full border border-gray-300 bg-white px-2 py-2 font-medium text-gray-500 hover:bg-gray-50 ${
                        currentPage === totalPages ? 'cursor-not-allowed opacity-50' : ''
                      }`}
                    >
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M7.21 5.23a.75.75 0 01.02 1.06L11.168 10 7.23 13.71a.75.75 0 101.04 1.08l4.5-4.25a.75.75 0 000-1.08l-4.5-4.25a.75.75 0 00-1.06.02z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
