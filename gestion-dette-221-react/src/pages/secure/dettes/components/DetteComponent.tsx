import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import QRCode from 'react-qr-code'; // Use react-qr-code
import useClient from '../../../../hooks/useClient';

export default function DetteComponent() {
  const [telephone, setTelephone] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isQrScanned, setIsQrScanned] = useState(false); // State to track QR scan
  const [scannedClientData, setScannedClientData] = useState<any>(null); // State to hold scanned client data

  const { data: clients, error, isLoading } = useClient();

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSearchQuery(telephone);
  };

  // Find client by telephone
  const filteredClient = clients?.find(client => client.telephone === searchQuery);

  const handleTelephoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Allow only numeric characters
    if (/^\d*$/.test(value)) {
      setTelephone(value);
      setErrorMessage(''); // Clear error message if input is valid
      setSearchQuery(value); // Update the search query while typing
    } else {
      setErrorMessage('Veuillez entrer uniquement des chiffres.'); // Show error message
    }

    // Reset search query if the input is cleared
    if (value === '') {
      setSearchQuery('');
    }
  };

  // Create the QR code content for the filtered client
  const generateQRCodeValue = (client: any) => {
    if (!client) return '';
        // Format the client data as key-value pairs
        return `
       Nom: ${client.nom}
       Prenom: ${client.prenom}
       Telephone: ${client.telephone}
       Adresse: ${client.adresse || 'Adresse non disponible'}
        `.trim(); // Trim to remove leading and trailing spaces
};

  // Simulate QR code scan
  const handleQrScan = () => {
    if (filteredClient) {
      console.log("Client found for QR scan:", filteredClient); // Debug log
      setScannedClientData(filteredClient); // Save the scanned client data
      setIsQrScanned(true); // Set QR scan state to true
    } else {
      console.error('No client data found to scan.');
    }
  };
  

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-blue-800">
        <i className="fas fa-search-dollar mr-2"></i>Suivi de Dette
      </h2>

      <form className="mb-4 flex flex-col sm:flex-row gap-2" method="POST" onSubmit={handleSearch}>
        <label 
          htmlFor="telephone" 
          className="w-full sm:w-auto flex-shrink-0 font-semibold text-gray-700 flex items-center"
        >
          <i className="fas fa-phone mr-2"></i>Tél :
        </label>
        <input 
          type="tel" 
          id="telephone" 
          name="telephone" 
          value={telephone}
          onChange={handleTelephoneChange}
          className="input-shadow flex-grow p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          placeholder="Entrer le numéro de téléphone"
        />
        <button 
          type="submit" 
          className="btn bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 mt-2 sm:mt-0"
        >
          <i className="fas fa-search mr-2"></i>OK
        </button>
      </form>
 
      {errorMessage && (
        <p className="text-red-500 mb-4">{errorMessage}</p>
      )}
      
      {filteredClient?.telephone && (
        <div className="mb-4 flex flex-wrap justify-start gap-4 sm:gap-2">
          <button className="bg-red-500 text-white px-4 py-2 rounded flex items-center" onClick={handleQrScan}>
            <i className="fas fa-user mr-2"></i>Infos
          </button>
          <NavLink to={`clients/${telephone}/dette`}>
            <button className="bg-gray-300 text-gray-700 px-4 py-2 rounded flex items-center">
              <i className="fas fa-file-invoice-dollar mr-2"></i>Voir Dettes
            </button>
          </NavLink>

          <NavLink to={`clients/${telephone}/dette/nouvelle`}>
            <button className="bg-gray-300 text-gray-700 px-4 py-2 rounded flex items-center">
              <i className="fas fa-plus mr-2"></i>Nouvelle
            </button>
          </NavLink>
        </div>
      )}
  
      <div className="flex flex-col items-center justify-center mb-2">
        {isLoading && <p>Loading...</p>}
        {error && <p className="text-red-500">Error: {error.message}</p>}
        {filteredClient ? (
          <div className="flex flex-col sm:flex-row items-center justify-center space-x-2">
            {/* User photo */}
            <div className="w-32 h-32 sm:w-40 sm:h-40 bg-gray-300 rounded-full overflow-hidden flex items-center justify-center mb-4 sm:mb-0">
              {filteredClient.photo ? (
                <img 
                  src={filteredClient.photo} 
                  alt={`${filteredClient.nom} ${filteredClient.prenom}`} 
                  className="w-full h-full object-cover"
                  onError={(e) => { 
                    console.error('Image failed to load:', e);
                    e.currentTarget.src = ''; 
                  }}
                />
              ) : (
                <i className="fas fa-user-circle text-4xl sm:text-6xl text-gray-500"></i>
              )}
            </div>

            <div className="space-y-2 text-center sm:text-left">
              <div className="mb-2">
                <p className="block font-semibold text-gray-700 mb-1">
                  <i className="fas fa-user mr-2"></i>Nom : {filteredClient.nom}
                </p>
              </div>
              <div className="mb-2">
                <p className="block font-semibold text-gray-700 mb-1">
                  <i className="fas fa-user mr-2"></i>Prénom : {filteredClient.prenom}
                </p>
              </div>
              <div className="mb-2">
                <p className="block font-semibold text-gray-700 mb-1">
                  <i className="fas fa-phone mr-2"></i>Téléphone : {filteredClient.telephone}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-500">Aucun client disponible</p>
        )}
      </div>

      {/* Display QR Code */}
      <div className="flex items-center justify-center py-6 mb-4">
        {filteredClient && (
          <div id="qr-code" className="w-40 h-40 sm:w-48 sm:h-48 border border-gray-300 code flex items-center justify-center">
            <QRCode
              value={generateQRCodeValue(filteredClient)}
              size={200}
              bgColor={"#ffffff"}
              fgColor={"#000000"}
              level={"L"}
            />
          </div>
        )}
      </div>

      {/* QR Code Information Section */}
      {isQrScanned && scannedClientData && (
  <div className="bg-white rounded-lg shadow-md my-2 p-4 sm:p-6 max-w-sm mx-auto ">
    <h2 className="text-xl font-bold mb-4 text-blue-800 ">
      Informations Client
    </h2>
    <div className="space-y-4">
      <p className="block font-semibold text-gray-700 mb-1">
        <i className="fas fa-user mr-2"></i>Nom : {scannedClientData.nom}
      </p>
      <p className="block font-semibold text-gray-700 mb-1">
        <i className="fas fa-user mr-2"></i>Prénom : {scannedClientData.prenom}
      </p>
      <p className="block font-semibold text-gray-700 mb-1">
        <i className="fas fa-phone mr-2"></i>Téléphone : {scannedClientData.telephone}
      </p>
      <p className="block font-semibold text-gray-700 mb-1">
        <i className="fas fa-map-marker-alt mr-2"></i>Adresse : {scannedClientData.adresse || 'Non renseignée'}
      </p>
    </div>
  </div>
)}
    </div>
  );
}
