import React, { useEffect, useState, useTransition } from 'react';
import { useClientDettesDetails, useClientTelephone } from '../../../../hooks/useDette';
import { NavLink, useNavigate } from 'react-router-dom';
import DetailClientComponent from '../../DetailClientComponent';
import { useClientDettes } from '../../../../hooks/useClient';

export default function DetteDetailComponent() {
  const { data: clients, error, isLoading } = useClientDettesDetails();
  const { data } = useClientDettesDetails();
  const { data: client2 } = useClientTelephone();
  const clientsPerPage = 2;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState<string>(''); // Default to show all dettes
  const navigate = useNavigate();
  console.log('dta',client2?.users[0]?.login);
  
  // Handle loading and error states
  useEffect(() => {
    if (isLoading) return; // Skip further execution if loading
    if (error) return console.error('Error loading data:', error.message);

    // Update total pages based on filtered dettes
    if (Array.isArray(clients)) {
      const filteredDettes = clients.filter((dette) => {
        switch (filter) {
          case 'Non soldées':
            return dette.montantRestant > 0;
          case 'Soldées':
            return dette.montantRestant === 0;
          default:
            return true; // Show all dettes
        }
      });

      setTotalPages(Math.ceil(filteredDettes.length / clientsPerPage));
    }
  }, [clients, error, isLoading, filter]);

  const handleClick = (dette) => {
    const montantRestant = dette.montantDue - dette.montantVerser;
    console.log('Remaining Amount:', montantRestant);

    navigate(`/boutique/dette/clients/${dette.client.telephone}/dette/${dette.id}/articles`, {
      state: {
        montantDue: dette.montantDue,
        montantVerser: dette.montantVerser,
        montantRestant,
        id: dette.id
      }
    });
  };

  // Handle page change
  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Get the client from data
  const client = data?.[0]?.client || {};
  const clientEmail = client?.email;
  const clientEmaile = client2?.users[0]?.login;
  
  // Calculate total dettes, montantVerser, etc.
  const totalMontantDue = data?.reduce((acc, dette) => acc + dette.montantDue, 0) || 0;
  const totalMontantVerser = data?.reduce((acc, dette) => acc + dette.montantVerser, 0) || 0;
  const totalMontantRestant = totalMontantDue - totalMontantVerser;

  // Get the dettes for the current page
  const filteredDettes = Array.isArray(clients) ? clients.filter((dette) => {
    switch (filter) {
      case 'Non soldées':
        return dette.montantRestant > 0;
      case 'Soldées':
        return dette.montantRestant === 0;
      default:
        return true; // Show all dettes
    }
  }) : [];

  const indexOfLastDette = currentPage * clientsPerPage;
  const indexOfFirstDette = indexOfLastDette - clientsPerPage;
  const currentDettes = filteredDettes.slice(indexOfFirstDette, indexOfLastDette);

  return (
    <main className="mt-8 mx-4 md:mr-8 rounded-xl bg-white p-4 shadow-sm screen flex flex-col main-content">
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
                  <p>Prenom: {client?.prenom ||  client2?.prenom || 'N/A'}</p>
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

      <div className="overflow-x-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Liste des dettes</h2>
          <div>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded mr-2"
              onClick={() => setFilter('Non soldées')}>
              Non soldées
            </button>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded mt-2 sm:mt-0"
              onClick={() => setFilter('Soldées')}>
              Soldées
            </button>
          </div>
        </div>
        <table className="w-full">
          <thead className="bg-blue-500 text-white">
            <tr>
              <th className="p-2 text-center">DATE</th>
              <th className="p-2 text-center">MONTANT</th>
              <th className="p-2 text-center">VERSER</th>
              <th className="p-2 text-center">RESTANT</th>
              <th className="p-2 text-center">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {currentDettes.length > 0 ? (
              currentDettes.map((dette) => (
                <tr key={dette.id}>
                  <td className="p-2 text-center">{new Date(dette.date).toLocaleDateString()}</td>
                  <td className="p-2 text-center">{dette.montantDue} FCFA</td>
                  <td className="p-2 text-center">{dette.montantVerser} FCFA</td>
                  <td className="p-2 text-center">{dette.montantRestant} FCFA</td>
                  <td className="p-2 text-center">
                    <button className="px-4 py-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600"
                      onClick={() => handleClick(dette)}>
                      Détails
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-2 text-center">Aucune dette disponible</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="w-full h-12 flex justify-center mt-4 flex-wrap">
        <div className="flex justify-center mt-4 mb-2 sm:mb-0">
          <button
            className="px-3 py-1 border rounded mr-1"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}>&lt;</button>
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              className={`px-3 py-1 border rounded mr-1 ${currentPage === index + 1 ? 'bg-blue-500 text-white' : ''}`}
              onClick={() => handlePageChange(index + 1)}>
              {index + 1}
            </button>
          ))}
          <button
            className="px-3 py-1 border rounded"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}>&gt;</button>
        </div>
      </div>
    </main>
  );
}
