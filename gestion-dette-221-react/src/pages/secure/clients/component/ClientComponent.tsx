import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import useClient, { useClientDettes } from "../../../../hooks/useClient";
import { NavLink } from "react-router-dom";
import { z } from "zod";
import axiosFetch from "../../../../hooks/axios.fetch";
import { Client } from "../../../../models/client.model";


// Zod schema updated for conditional validation
const userSchema = (showAccountFields: boolean) => z.object({
  nom: z.string().min(1, "Le nom est requis"),
  prenom: z.string().min(1, "Le prénom est requis"),
  telephone: z.string()
    .min(1, { message: "Le téléphone est requis" })
    .refine((val) => val.length === 9, { message: "Le numéro de téléphone doit avoir 9 caractères" }),
  adresse: z.string().min(5, "L'adresse est requise"),
  categorieId: z.number().min(1, "La catégorie est requise"),
  max_montant: z.number().optional().nullable(), // Optional based on categorieId
  password: showAccountFields ? z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères") : z.string().optional(),
  login: showAccountFields ? z.string().min(1, "Le login est requis") : z.string().optional(),
});

export default function ClientComponent() {

    const { data: clients } = useClient();
    console.log('cli',clients);
    
    const [nom, setNom] = useState('');
    const [prenom, setPrenom] = useState('');
    const [telephone, setTelephone] = useState('');
    const [adresse, setAdresse] = useState('');
    const [photo, setPhoto] = useState<File | null>(null); // Initialize photo state
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [categorieId, setCategorieId] = useState<number>(3); // Default is 3 (Bronze)
    const [maxMontant, setMaxMontant] = useState<number | null>(null); // For categorieId = 2
    const [showSuccess, setShowSuccess] = useState(false); // State for success message
    const [showAccountFields, setShowAccountFields] = useState(false); // State for account fields
    const fileInputRef = useRef<HTMLInputElement>(null); // Create a ref for the file input
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filterValue, setFilterValue] = useState('');
    const clientsPerPage = 2;
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages , setTotalPages] = useState(1);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [message, setMessage] = useState('');
    const [isMessageVisible, setIsMessageVisible] = useState(false);


  
    // Use the mutation hook to create a client
    const { mutate: createClient, isLoading} = axiosFetch.usePost<Client>('/clients', {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  
  
  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterValue(event.target.value);
  };
  
  const filteredClients = Array.isArray(clients) 
  ? clients.filter(client => client.telephone.includes(filterValue)) 
  : [];

// State to control modal visibility


// Update totalPages whenever filteredClients changes
useEffect(() => {
  setTotalPages(Math.ceil(filteredClients.length / clientsPerPage));
}, [filteredClients]);

// Get the clients for the current page
const indexOfLastClient = currentPage * clientsPerPage;
const indexOfFirstClient = indexOfLastClient - clientsPerPage;
const currentClients = filteredClients.slice(indexOfFirstClient, indexOfLastClient);

const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
  if (e.target.files && e.target.files[0]) {
    setPhoto(e.target.files[0]);
  }
};

const showNotification = (msg: string) => {
  setMessage(msg);
  setIsMessageVisible(true);
  setTimeout(() => {
    setIsMessageVisible(false);
    setMessage('');
  }, 3000); // Hide message after 3 seconds
};

// Validate form using Zod
const validateForm = (formData: Record<string, unknown>) => {
  try {
    userSchema(showAccountFields).parse(formData); // Pass showAccountFields to the schema
    return true;
  } catch (e) {
    if (e instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      e.errors.forEach((error) => {
        if (error.path.length > 0) {
          errors[error.path[0]] = error.message;
        }
      });
      setFormErrors(errors);
    }
    return false;
  }
};

// Handle page change
  const handlePageChange = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };


  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormErrors({});

    // Apply default or conditional logic for max_montant
    const formData: Record<string, any> = {
      nom,
      prenom,
      telephone,
      adresse,
      categorieId,
      max_montant: categorieId === 2 ? maxMontant : null, // Only set max_montant for categorieId = 2
    };

    // Add login and password only if showAccountFields is true
    if (showAccountFields) {
      formData.login = login;
      formData.password = password;
    }

    // Validate form data
    if (!validateForm(formData)) return;

    const finalFormData = new FormData();
    finalFormData.append('nom', nom);
    finalFormData.append('prenom', prenom);
    finalFormData.append('telephone', telephone);
    finalFormData.append('adresse', adresse);
    finalFormData.append('categorieId', categorieId.toString());
    if (categorieId === 2 && maxMontant !== null) {
      finalFormData.append('max_montant', maxMontant.toString());
    }
    if (showAccountFields) {
      finalFormData.append('login', login);
      finalFormData.append('password', password);
    }
    if (photo) finalFormData.append('photo', photo);

    try {
      createClient(finalFormData, {
        onSuccess: (data: Client) => {
          // Reset fields
          setNom('');
          setPrenom('');
          setTelephone('');
          setAdresse('');
          setCategorieId(3); // Reset to default category
          setMaxMontant(null); // Reset max_montant
          setLogin('');
          setPassword('');
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
          setPhoto(null);
          closeModal();
          showNotification('Client(e) a été successivement crée(e)');
        },
        onError: (err) => {
          console.error('Error creating client:', err);
        },
      });
    } catch (err) {
      console.error('Error:', err);
    }
  };

   // Remove error on field change
   const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>, field: string) => {
    return (e: ChangeEvent<HTMLInputElement>) => {
      setter(e.target.value);
      if (formErrors[field]) {
        setFormErrors((prev) => ({ ...prev, [field]: '' })); // Clear specific error
      }
    };
  };

  // Toggle visibility of account fields
  const handleToggleChange = () => {
    setShowAccountFields(!showAccountFields);
  };

  return (
    <main className="mt-8 mx-4 md:mr-8 rounded-xl bg-white p-4 shadow-sm flex flex-col main-content">
      {isMessageVisible && (
      <div className="flex rounded-md bg-green-50 p-4 notification text-sm text-green-500 fade-in">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="mr-3 h-5 w-5 flex-shrink-0">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
        </svg>
        <div><b>Succes alert: </b>{message}</div>
     </div>
        )}
      <div className="product-lists">
        <div className="product-list bg-white rounded-lg shadow p-4 w-full">
          <div className="mb-4 text-xl font-bold text-blue-800">Lister Clients</div>

          {/* <!-- Filter and New Client Button --> */}
          <div className="flex flex-wrap justify-between items-center mb-4">
            {/* <!-- Filter by Phone --> */}
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={filterValue}
                onChange={handleFilterChange}
                placeholder="Filtrer par Telephone"
                className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none w-1/2"
              />
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                OK
              </button>
            </div>

            {/* <!-- New Client Button --> */}
            <div className="flex gap-4">
              <button
                data-modal-target="clientModal"
                data-modal-toggle="clientModal"
                onClick={openModal}
                className="px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 mt-2 sm:mt-0"
              >
                Nouvelle Client
              </button>
            </div>
          </div>

          {/* <!-- Table --> */}
          <div className="overflow-hidden rounded-lg border border-gray-200 shadow-md">
            <table className="min-w-full border-collapse bg-white text-left text-sm text-gray-500">
              <thead className="bg-gray-50">
                <tr className="text-neutral-500">
                  <th className="px-5 py-3 text-lg font-medium text-left uppercase">PRENOM ET NOM</th>
                  <th className="px-5 py-3 text-lg font-medium text-left uppercase">TELEPHONE</th>
                  <th className="px-5 py-3 text-lg font-medium text-left uppercase">ADRESSE</th>
                  <th className="px-5 py-3 text-lg font-medium text-left uppercase">MONTANT DUE</th>
                  <th className="px-5 py-3 text-lg font-medium text-left uppercase">ACTION</th>
                </tr>
              </thead>
              {clients && currentClients.length > 0 ? (
              <tbody className="divide-y divide-neutral-200">
                {currentClients.map((client) => (
                  <tr key={client.telephone} className="text-neutral-800">
                    <td className="px-5 py-2 text-md font-medium whitespace-nowrap">{client.nom} {client.prenom}</td>
                    <td className="px-5 py-2 text-md font-medium whitespace-nowrap">{client.telephone}</td>
                    <td className="px-5 py-2 text-md font-medium whitespace-nowrap">{client.adresse}</td>
                    <td className="px-5 py-2 text-md font-medium whitespace-nowrap">{client.totalMontantDue} FCFA</td>
                    <td className="px-5 py-2 text-md font-medium whitespace-nowrap">
                      <NavLink to={`clients/${client.telephone}/dette`}>
                        <button className="px-4 py-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600">
                          Détails
                        </button>
                      </NavLink>
                    </td>
                  </tr>
                ))}
              </tbody>
            ) : (
              <p className="text-gray-500 textp">Aucun client disponible</p>
            )}             
        </table>
          </div>

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

      {/* Popup Modal */}
      {isModalOpen && (
        <div
          id="clientModal"
          tabIndex={-1}
          aria-hidden="true"
          className="fixed top-0 right-0 left-0 z-50 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center"
        >
          <div className="relative bg-white rounded-lg shadow-lg w-[90%] max-w-2xl p-6">
            <button
              type="button"
              className="absolute top-3 right-3 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
              onClick={closeModal}
            >
              <svg
                aria-hidden="true"
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 011.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </button>
            <h3 className="mb-4 text-lg font-normal text-gray-500">N. UTILISATEUR</h3>
            <div className="p-6 text-center border rounded-xl">            
            <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4">
        <div className="form-row mb-4 flex items-center space-x-2">
          <label htmlFor="prenom" className="w-full sm:w-1/4 flex-shrink-0 font-semibold text-gray-700 flex items-center">
            <i className="fas fa-user mr-2"></i>Prenom 
          </label>
          <input 
            type="text" 
            id="prenom" 
            name="prenom" 
            className="input-shadow flex-grow p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" 
            placeholder="Entrer le prénom" 
            value={prenom}
            onChange={handleInputChange(setPrenom, 'prenom')}
          />
        </div>
        {formErrors.prenom && <p className="text-red-500">{formErrors.prenom}</p>}

        <div className="form-row mb-4 flex items-center space-x-2">
          <label htmlFor="nom" className="w-full sm:w-1/4 flex-shrink-0 font-semibold text-gray-700 flex items-center">
            <i className="fas fa-user mr-2"></i>Nom 
          </label>
          <input 
            type="text" 
            id="nom" 
            name="nom" 
            className="input-shadow flex-grow p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" 
            placeholder="Entrer le nom" 
            value={nom}
            onChange={handleInputChange(setNom, 'nom')}
          />
        </div>
        {formErrors.nom && <p className="text-red-500">{formErrors.nom}</p>}
        <div className="form-row mb-4 flex items-center space-x-2">
          <label htmlFor="telephone" className="w-1/4 flex-shrink-0 font-semibold text-gray-700 flex items-center">
            <i className="fas fa-phone mr-2"></i>Téléphone
          </label>
          <input 
            type="tel" 
            id="telephone" 
            name="telephone" 
            className="input-shadow flex-grow p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" 
            placeholder="Entrer le téléphone" 
            value={telephone}
            onChange={handleInputChange(setTelephone, 'telephone')}
          />
        </div>
        {formErrors.telephone && <p className="text-red-500">{formErrors.telephone}</p>}
        <div className="form-row mb-4 flex items-center space-x-2">
          <label htmlFor="adresse" className="w-1/4 flex-shrink-0 font-semibold text-gray-700 flex items-center">
            <i className="fas fa-map-marker-alt mr-2"></i>Adresse 
          </label>
          <input 
            type="text" 
            id="adresse" 
            name="adresse" 
            className="input-shadow flex-grow p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" 
            placeholder="Entrer l'adresse" 
            value={adresse}
            onChange={handleInputChange(setAdresse, 'adresse')}
          />
        </div>
        {formErrors.adresse && <p className="text-red-500">{formErrors.adresse}</p>}
        <div className="form-row mb-4 flex items-center space-x-2">
          <label htmlFor="photo" className="w-1/5 flex-shrink-0 font-semibold text-gray-700 flex items-center">
            <i className="fas fa-camera mr-2"></i>Photo 
          </label>
          <input 
            type="file" 
            id="photo" 
            name="photo" 
            className="input-shadow flex-grow p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" 
            onChange={handleFileChange}
            ref={fileInputRef}
          />
        </div>
        <div className="form-row mb-4 flex items-center space-x-2">
          <label htmlFor="categorieId" className="w-1/4 flex-shrink-0 font-semibold text-gray-700 flex items-center">
            <i className="fas fa-tags mr-2"></i>Catégorie
          </label>
          <select
            id="categorieId"
            name="categorieId"
            className="input-shadow flex-grow p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            value={categorieId}
            onChange={(e) => setCategorieId(Number(e.target.value))}
          >
            <option value={3}>Bronze</option>
            <option value={2}>Silver</option>
            <option value={1}>Gold</option>
          </select>
        </div>

        {/* Conditional max_montant field */}
        {categorieId === 2 && (
          <div className="form-row mb-4 flex items-center space-x-2">
            <label htmlFor="maxMontant" className="w-1/4 flex-shrink-0 font-semibold text-gray-700 flex items-center">
              <i className="fas fa-money-bill-wave mr-2"></i>Montant Maximum
            </label>
            <input
              type="number"
              id="maxMontant"
              name="max_montant"
              className="input-shadow flex-grow p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Entrer le montant maximum"
              value={maxMontant ?? ''}
              onChange={(e) => setMaxMontant(Number(e.target.value))}
            />
          </div>
        )}
        {/* Toggle pour Création de Compte */}
        <div className="mb-4 flex items-center">
          <span className="toggle-label mr-2">Créer un compte :</span>
          <label className="toggle-switch">
            <input 
              type="checkbox" 
              id="creerCompte" 
              className="sr-only" 
              checked={showAccountFields}
              onChange={handleToggleChange}
            />
            <span className="slider"></span>
          </label>
          <span className="toggle-label ml-2 text-gray-700 font-semibold">
            {showAccountFields ? 'Oui' : 'Non'}
          </span>
        </div>

        {/* Champs Supplémentaires pour la Création de Compte */}
        {showAccountFields && (
          <div id="accountFields">
            {/* Champ Login */}
            <div className="form-row mb-4 flex items-center space-x-2">
              <label htmlFor="login" className="w-1/4 flex-shrink-0 font-semibold text-gray-700 flex items-center">
                <i className="fas fa-envelope mr-2"></i>Login
              </label>
              <input 
                type="text" 
                id="login" 
                name="login" 
                value={login}  
                onChange={handleInputChange(setLogin, 'login')}
                className="input-shadow flex-grow p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            {formErrors.login && <p className="text-red-500">{formErrors.login}</p>}
            {/* Champ Password */}
            <div className="form-row mb-2 flex items-center space-x-2">
              <label htmlFor="password" className="w-1/4 flex-shrink-0 font-semibold text-gray-700 flex items-center">
                <i className="fas fa-lock mr-2"></i>Password
              </label>
              <input 
                type="password" 
                id="password" 
                name="password" 
              value={password} 
              onChange={handleInputChange(setPassword, 'password')}
              className="input-shadow flex-grow p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
              {formErrors.password && <p className="text-red-500">{formErrors.password}</p>}
          </div>
        )}

        <div className="flex justify-center hum">
          <button 
            type="button" 
            className="btn font-bold bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 mr-12"
            onClick={() => window.location.reload()}
          >
            <i className="fas fa-arrow-left mr-2"></i>Retour
          </button>

          <button 
            type="submit" 
            className="btn font-bold bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
            disabled={isLoading}
          >
            {isLoading ? 'Envoi en cours...' : 'Enregistrer'}
          </button>
        </div>
      </form>
          </div>
          </div>
        </div>
      )}
    </main>
  );
}
