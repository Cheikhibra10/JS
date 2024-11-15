import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Article } from "../../../../models/article.model";
import { Client } from "../../../../models/client.model";
import { authService } from "../../../../services/AuthService";
import { useDetteDemandes } from "../../../../hooks/useDette";
import { Dette } from "../../../../models/dette.model";
import { useArticleContext } from "../../../../utils/ArticleContext";
import DemandListSkeleton from "../../../skeleton/DemandeListSkeleton";

interface Demande {
  id: number;
  date: string;
  montant: number;
  montantVerser: number;
  montantDue: number;
  status: string;
  articles: Article[];
  client: Client;
  dettes: Dette[]
}

export default function DemandeComponent() {
  const { data: dettes } = useDetteDemandes();
  const [demandes, setDemandes] = useState<Demande[]>(dettes || []); // Initialize with dettes data
  const [selectedStatus, setSelectedStatus] = useState<string>("EN_COURS");
  const [currentPage, setCurrentPage] = useState(1);
  const demandesPerPage = 2;
  const [isDemandeLoading, setIsDemandeLoading] = useState<boolean>(true);

  useEffect(() => {
      setTimeout(() => setIsDemandeLoading(false), 2000);
  }, []);
  // Update demandes when dettes data changes
  useEffect(() => {
    if (dettes) {
      setDemandes(dettes);
    }
  }, [dettes]);

  // Filter demandes based on selected status
  const filteredDemandes = Array.isArray(demandes)
    ? demandes.filter((demande) => demande.status === selectedStatus)
    : [];

  // Calculate total pages
  const totalPages = Math.ceil(filteredDemandes.length / demandesPerPage);

  // Get current demandes for the page
  const startIndex = (currentPage - 1) * demandesPerPage;
  const currentDemandes = filteredDemandes.slice(startIndex, startIndex + demandesPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <main className="mt-8 mx-4 md:mr-8 rounded-xl bg-white p-4 shadow-sm flex flex-col main-content">
        {isDemandeLoading ? (
         <DemandListSkeleton/>
        ):(
      <div className="product-lists">
        <div className="product-list bg-white rounded-lg shadow p-4 w-full">
          <div className="flex justify-between items-center mb-4">
            <div className="text-xl font-bold text-blue-800">Liste des demandes</div>
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
                  <th className="px-6 py-4 text-lg font-medium text-white-900">DATE</th>
                  <th className="px-6 py-4 text-lg font-medium text-white-900">MONTANT</th>
                  <th className="px-6 py-4 text-lg font-medium text-white-900">NOM COMPLET</th>
                  <th className="px-6 py-4 text-lg font-medium text-white-900 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 border-t border-gray-100">
                {currentDemandes.length > 0 ? (
                  currentDemandes.map((demande, index) => {
                    const { id, client, articles, date } = demande;
                    const { nom, prenom } = client || { nom: "N/A", prenom: "N/A" };
                    const montantTotal = articles.reduce((total, article) => total + (article.qteVente * article.prixVente), 0);                    
                    return (
                      <tr key={id} className="hover:bg-gray-50 text-neutral-800">
                        <td className="px-5 py-2 text-md font-medium whitespace-nowrap">{new Date(date).toLocaleDateString()}</td>
                        <td className="px-5 py-2 text-md font-medium whitespace-nowrap">{montantTotal.toLocaleString()} FCFA</td>
                        <td className="px-5 py-2 text-md font-medium whitespace-nowrap">{prenom} {nom}</td>
                        <td className="px-5 py-2 text-md font-medium whitespace-nowrap text-right">
                          <NavLink
                            to={`/boutique/demande/clients/${client.id}/dettes/dette/${id}/demande/articles`}
                            state={{ id, client, articles }}
                          >
                            <button className="bg-gray-400 hover:bg-gray-500 text-green-500 py-1 px-4 rounded">
                              <i className="fas fa-eye"></i> Détails
                            </button>
                          </NavLink>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={4} className="border-t border-gray-200 py-2 px-4 text-center">Aucune demande à afficher.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="w-full h-12 flex justify-between mt-4 flex-wrap">
          <div className="flex justify-center mt-2">
        <nav aria-label="Pagination">
          <ul className="inline-flex items-center space-x-1 rounded-md text-sm">
            {/* Previous Button */}
            <li>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`inline-flex items-center space-x-2 rounded-full border border-gray-300 bg-white px-2 py-2 font-medium text-gray-500 hover:bg-gray-50 ${currentPage === 1 ? 'cursor-not-allowed opacity-50' : ''}`}
              >
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                </svg>
              </button>
            </li>

            {/* Page Info */}
            <li>
              <span className="inline-flex items-center space-x-1 rounded-md bg-white px-4 py-2 text-gray-500">
                Page <b className="mx-1">{currentPage}</b> à <b className="ml-1">{totalPages}</b>
              </span>
            </li>

            {/* Next Button */}
            <li>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`inline-flex items-center space-x-2 rounded-full border border-gray-300 bg-white px-2 py-2 font-medium text-gray-500 hover:bg-gray-50 ${currentPage === totalPages ? 'cursor-not-allowed opacity-50' : ''}`}
              >
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                </svg>
              </button>
            </li>
          </ul>
        </nav>
      </div>
      </div>
        </div>
      </div>
        )}
    </main>
  );
}
