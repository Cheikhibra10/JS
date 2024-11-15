import { FormEvent, useEffect, useState, useRef, ChangeEvent } from "react";
import { z } from "zod"; // Import Zod
import { Client } from "../../../../models/client.model";
import apiClient from "../../../../services/api-client";
import { authService } from "../../../../services/AuthService";
import { UserConnect } from "../../../../models/user.model";
import useClient, { useClientHasUser, useClientNotUser } from "../../../../hooks/useClient";
import UserSkeleton from "../../../skeleton/UserSkeleton";
import axiosFetch from "../../../../hooks/axios.fetch";


// Define a Zod schema for validation
const userSchema = z.object({
  nom: z.string().min(1, { message: "Le nom est obligatoire" }),
  prenom: z.string().min(1, { message: "Le prénom est obligatoire" }),
  telephone: z.string().length(9, { message: "Le téléphone doit contenir exactement 9 chiffres" }),
  login: z.string().email({ message: "L'email doit être valide" }),
  password: z.string().min(6, { message: "Le mot de passe doit contenir au moins 6 caractères" }),
  role: z.string().min(1, { message: "Le rôle est obligatoire" })
});


export default function UserComponent() {
  const { data: client1} = useClientNotUser(); // Ensure you're handling'
  const { data: client2} = useClientHasUser(); // Ensure you're handling'
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [telephone, setTelephone] = useState('');
  const [adresse, setAdresse] = useState('');
  const [photo, setPhoto] = useState<File | null>(null); // Initialize photo state
  const [categorieId, setCategorieId] = useState<number>(3); // Default is 3 (Bronze)
  const [maxMontant, setMaxMontant] = useState<number | null>(null); // For categorieId = 2
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<string>(''); // State for role
  const [clientId, setClientId] = useState<number | null>(null);
 const [isEditing, setIsEditing] = useState(false); // Track editing state
  const [editingUserId, setEditingUserId] = useState<number | null>(null); // Track the user ID being edited
  const usersPerPage = 3; // Change this to the number of users you want per page
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [filter, setFilter] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // Modal state
  const [isModalOpened, setIsModalOpened] = useState<boolean>(false); // Modal state
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null); // Reference for file input
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState('');
  const [isMessageVisible, setIsMessageVisible] = useState(false);
  const [isUserLoading, setIsUserLoading] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState(false);
  const { mutate: createUser} = axiosFetch.usePost<UserConnect>(
    '/users',
    {
        headers: {
            'Content-Type': 'application/json',
        },
    },
    {
         onSuccess: () => {
          setLogin('');  // Reset login input
          setPassword('');  // Reset password input
          closeModale();    // Close the modal after submission
          showNotification("L'utilisateur a été successivement ajouté");
      }
      ,
    }
);
  useEffect(() => {
      setTimeout(() => setIsUserLoading(false), 2000);
  }, []);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const closeModale = () => setIsModalOpened(false);

  const showNotification = (msg: string) => {
    setMessage(msg);
    setIsMessageVisible(true);
    setTimeout(() => {
      setIsMessageVisible(false);
      setMessage('');
    }, 3000); // Hide message after 3 seconds
  };
  
  const validateForm = () => {
    try {
      userSchema.parse({
        nom,
        prenom,
        telephone,
        adresse,
        categorieId,
        max_montant: categorieId === 2 ? maxMontant : null,
        login,
        password,
        role,
        clientId
      });
      return true; // If validation passes
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
      return false; // If validation fails
    }
  };


  const handleRoleClick = (selectedRole: string) => {
    setRole(selectedRole);
};

const handleCreateAccountClick = (client: Client) => {
  console.log('cmo', client.id);
  setSelectedClient(client);  // Set the selected client to show details
  setClientId(client.id);  // Set the clientId
  setIsModalOpened(true);  // Open the modal
};

const handleCreateUser = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setIsLoading(true); 

  console.log({ login, password, clientId });

  if (!login || !password || !clientId) {
    console.error('Missing fields for user creation');
    return;
  }
  const userData = {
    login,
    password,
    clientId
  };
console.log('user',userData);

  try {
    await createUser(userData);
  } catch (error) {
    console.error('Error creating user:', error);
  }finally {
    setIsLoading(false);
  }  
};

const handleEditClick = (client?: Client) => {
  if (!client) {
    console.warn('Client is undefined or null');
    return; 
  }

  console.log('Selected client for editing:', client);
  setIsEditing(true);
  setEditingUserId(client.id);

  setNom(client.nom || '');
  setPrenom(client.prenom || '');
  setTelephone(client.telephone || '');
  setAdresse(client.adresse || '');
  setCategorieId(client.categorieId || 3)

  if(client.categorieId == 2){
    setMaxMontant(client.max_montant || 0);
  }
  if (client.userCount && client.userCount.length > 0) {
    const firstUser = client.userCount[0];
    setLogin(firstUser.login);
    setRole(firstUser.role);
  } else {
    console.warn('userCount is empty or undefined');
    setLogin('');
    setRole('');
  }

  setPassword('');
  setClientId(client.id);
  setIsModalOpen(true);
};

const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setIsLoading(true); 

  setFormErrors({});

  if (!validateForm()) {
    setIsLoading(false); 
    return;
  }

  const formData = new FormData();
  formData.append('nom', nom);
  formData.append('prenom', prenom);
  formData.append('telephone', telephone);
  formData.append('adresse', adresse);
  formData.append('login', login);
  formData.append('password', password);  
  formData.append('role', role);  
  formData.append('categorieId', categorieId.toString());
  
  if (categorieId === 2 && maxMontant !== null) {
    formData.append('max_montant', maxMontant.toString());
  }
  
if (clientId !== null) {
  formData.append('clientId', clientId.toString()); 
}

  if (photo) formData.append('photo', photo);

  try {
    const token = authService.getToken();
    if (isEditing && editingUserId) {
      const clientResponse = await apiClient.put(`/clients/${editingUserId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });
      console.log('edit', clientResponse);
      console.log('editingUserId before PUT:', editingUserId);
      showNotification("L'utilisateur (trice) a été mis à jour avec succès");
    } else {      
      const clientResponse = await apiClient.post(`/clients/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });
      console.log('save', clientResponse);
      showNotification("L'utilisateur (trice) a été ajouté(e) avec succès");
    }
    setNom('');
    setPrenom('');
    setTelephone('');
    setAdresse('');
    setCategorieId(3);
    setMaxMontant(null);
    setLogin('');
    setPassword('');
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    setIsEditing(false);
    setEditingUserId(null);
    closeModal();
  } catch (err) {
    console.error('Error:', err);
  } finally {
    setIsLoading(false);
  }
};

  

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  };
  
  const filteredUsers: UserConnect[] = (filter === 'ALL'
    ? [
        ...(client1?.map(client => ({
          id: client.id,
          nom: client.nom,
          prenom: client.prenom,
          telephone: client.telephone,
          adresse: client.adresse,
          photo: client.photo,
          login: 'Non Disponible',
          role: 'Néant',
          clientId: null,
          userCount: 0,
        })) || []),
        ...(client2?.flatMap(client => 
          client.users.map(user => ({
            id: user.id,
            login: user.login,
            role: user.role,
            clientId: user.clientId,
            client: {
              id: client.id,
              nom: client.nom,
              prenom: client.prenom,
              telephone: client.telephone,
              adresse: client.adresse,
              photo: client.photo,
              categorieId: client.categorieId,
              max_montant: client.max_montant,
              userCount: client.users,
            },
          }))
        ) || []), // Fallback to an empty array if client2 is undefined
      ]
    : client2?.flatMap(client =>
        client.users
          .filter(user => user.role === filter) 
          .map(user => ({
            id: user.id, 
            login: user.login,
            role: user.role,
            clientId: user.clientId,
            client: {
              id: client.id,
              nom: client.nom,
              prenom: client.prenom,
              telephone: client.telephone,
              adresse: client.adresse,
              photo: client.photo,
              categorieId: client.categorieId,
              max_montant: client.max_montant,
              userCount: client.users,
            },
          }))
      ) || [] 
    )

    console.log('cli',client1);
      useEffect(() => {
    setTotalPages(Math.ceil(filteredUsers.length / usersPerPage));
  }, [filteredUsers, usersPerPage]);
  
 
    
    const handlePageChange = (page: number) => {
      setCurrentPage(page);
    };

  const startIndex = (currentPage - 1) * usersPerPage;
  const endIndex = startIndex + usersPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);
// console.log('cuu',currentUsers);
  return (
    <main className="mt-8 mx-4 md:mx-8 rounded-xl bg-white p-4 shadow-sm flex screen flex-col">
      {isMessageVisible && (
      <div className="flex rounded-md bg-green-50 p-4 notification text-sm text-green-500 fade-in">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="mr-3 h-5 w-5 flex-shrink-0">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
        </svg>
        <div><b>Succes alert: </b>{message}</div>
     </div>
        )}
         {isUserLoading ? (
            <UserSkeleton/>
         ) : (
      <div className="flex flex-col justify-between gap-4 mb-6 bg-white rounded-lg shadow p-4">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
          <div className="text-xl text-blue-800 font-bold mb-2 sm:mb-0">Ecran Admin</div>
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <div className="flex flex-wrap justify-center sm:justify-start gap-2">
            <button className="bg-red-500 text-white px-3 py-1 rounded" onClick={() => setFilter('ALL')}>ALL</button>
            <button className="bg-white border border-gray-300 px-3 py-1 rounded" onClick={() => setFilter('ADMIN')}>Admin</button>
            <button className="bg-white border border-gray-300 px-3 py-1 rounded" onClick={() => setFilter('BOUTIQUIER')}>Boutiquier</button>
            <button className="bg-white border border-gray-300 px-3 py-1 rounded" onClick={() => setFilter('CLIENT')}>Client</button>
          </div>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded mt-2 sm:mt-0"
            onClick={openModal}
          >
            NOUVEAU
          </button>
        </div>
        {/* Table responsive */}
        <div className="overflow-x-auto">
          <table className="min-w-full w-20 divide-y divide-neutral-200">
            <thead>
              <tr className="text-neutral-500">
                <th className="px-5 py-3 text-lg font-medium text-left uppercase">ROLE</th>
                <th className="px-5 py-3 text-lg font-medium text-left uppercase">NOM COMPLET</th>
                <th className="px-5 py-3 text-lg font-medium text-left uppercase">LOGIN</th>
                <th className="px-5 py-3 text-lg font-medium text-left uppercase">TELEPHONE</th>
                <th className="px-5 py-3 text-lg font-medium text-right uppercase">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
  {currentUsers.length > 0 ? (
    currentUsers.map((user: UserConnect) => (
      <tr key={user.id} className="text-neutral-800">
        <td className="px-5 py-2 text-md font-medium whitespace-nowrap">
          {user.role || 'Néant'}
        </td>
        <td className="px-5 py-2 text-md whitespace-nowrap">
         {user.client?.prenom  || user?.prenom} {user.client?.nom  || user?.nom}
        </td>
        <td className="px-5 py-2 text-md whitespace-nowrap">
          {user.login || 'Non Disponible'}
        </td>
        <td className="px-5 py-2 text-md whitespace-nowrap">
          {user.client?.telephone || user?.telephone}
        </td>
        <td className="px-5 py-2 text-md font-medium text-right whitespace-nowrap space-x-1  mt-2 sm:mt-0">
          {/* Show button to create account if user role is 'Néant' */}
          {user.userCount === 0 && user.role === 'Néant' && (
            
            <button
              title="CREATION COMPTE"
              className="bg-blue-500 text-white py-1 px-4 rounded"
            onClick={() => handleCreateAccountClick(user)}
            >
              <i className="fas fa-user-plus mr-2"></i>
            </button>
          )}
         <button 
        title="MODIFIER"
        className="bg-blue-500 text-white px-3 py-1 rounded"
        onClick={() => {
          if (user?.client) {
            handleEditClick(user.client);
          } else {
            console.warn('Client is undefined or null');
          }
        }}
      >
        <i className="fas fa-edit"></i>
      </button>

        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan={5} className="py-2 px-4 text-center">
        Pas d'utilisateurs trouvés
      </td>
    </tr>
  )}
</tbody>

          </table>
        </div>
        {/* Pagination */}
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
         )}
    {/* Modal */}
    {isModalOpen && (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Nouveau Utilisateur</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4">
            <input type="text" name="prenom" placeholder="Prenom"  value={prenom} onChange={(e) => setPrenom(e.target.value)}
                className="border border-gray-300 p-2 w-full rounded-lg" />
                      {formErrors.prenom && <p className="text-red-500">{formErrors.prenom}</p>}
            <input type="text" name="nom" placeholder="Nom"  value={nom} onChange={(e) => setNom(e.target.value)}
                className="border border-gray-300 p-2 w-full rounded-lg" />
                      {formErrors.nom && <p className="text-red-500">{formErrors.nom}</p>}
            <input type="text" name="telephone" placeholder="Tel" value={telephone} onChange={(e) => setTelephone(e.target.value)}
                className="border border-gray-300 p-2 w-full rounded-lg" />
                      {formErrors.telephone && <p className="text-red-500">{formErrors.telephone}</p>}
            <input type="text" name="adresse" placeholder="Adresse" value={adresse} onChange={(e) => setAdresse(e.target.value)}
                className="border border-gray-300 p-2 w-full rounded-lg" />
                      {formErrors.adresse && <p className="text-red-500">{formErrors.adresse}</p>}
            <input type="text" name="login" placeholder="Login" value={login} onChange={(e) => setLogin(e.target.value)}
                className="border border-gray-300 p-2 w-full rounded-lg" />
                      {formErrors.login && <p className="text-red-500">{formErrors.login}</p>}
            <input type="password" name="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
                className="border border-gray-300 p-2 w-full rounded-lg" />
                      {formErrors.password && <p className="text-red-500">{formErrors.password}</p>}
            <div className="flex items-center">
                <input id="fileInput" name="fileInput" type="file"  onChange={handleFileChange} ref={fileInputRef}
                    className="border border-gray-300 w-full rounded-r-lg pl-2" />
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
            <div className="flex flex-wrap justify-between gap-2">
            <button
                    type="button"
                    onClick={() => handleRoleClick('ADMIN')}
                    className={`bg-gray-300 text-gray-700 px-4 py-2 rounded flex-grow ${role === 'ADMIN' ? 'bg-blue-500 text-white' : ''}`}
                >
                    Admin
                </button>
                <button
                    type="button"
                    onClick={() => handleRoleClick('BOUTIQUIER')}
                    className={`bg-gray-300 text-gray-700 px-4 py-2 rounded flex-grow ${role === 'BOUTIQUIER' ? 'bg-blue-500 text-white' : ''}`}
                >
                    Boutiquier
                </button>
                <button
                    type="button"
                    onClick={() => handleRoleClick('CLIENT')}
                    className={`bg-gray-600 text-white px-4 py-2 rounded flex-grow ${role === 'CLIENT' ? 'bg-blue-500 text-white' : ''}`}
                >
                    Client
                </button>
                    </div>
            <div className="flex justify-between">
                <button type="button"  onClick={closeModal} className="bg-red-500 text-white px-4 py-2 rounded">ANNULER</button>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                {isEditing
                  ? (isLoading ? 'Modification en cours...' : 'Modifier')
                  : (isLoading ? 'Envoi en cours...' : 'Enregistrer')}
              </button>

            </div>
        </form>
        </div>
    </div>
      )}

{isModalOpened && selectedClient && (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
        <div className="relative bg-white shadow-lg pt-10 px-6 pb-6 rounded-xl">
            <button type="button"
                className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                onClick={() => setIsModalOpened(false)}>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd"
                        d="M10 8.586L15.707 2.879a1 1 0 111.414 1.414L11.414 10l5.707 5.707a1 1 0 01-1.414 1.414L10 11.414l-5.707 5.707a1 1 0 01-1.414-1.414L8.586 10 2.879 4.293a1 1 0 111.414-1.414L10 8.586z"
                        clipRule="evenodd"></path>
                </svg>
            </button>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">COMPTE</h3>
            <div className="p-6 text-center border border-gray-200 rounded-2xl">
                <div className="flex justify-start gap-4 mb-6">
                    <img src={selectedClient.photo} alt="User Image"
                        className="w-40 h-40 object-cover rounded-lg" />
                    <div className="text-left flex flex-col justify-between h-40 space-y-1">
                        <p className="text-gray-700"><span className="font-semibold">Prénom:</span> {selectedClient.prenom}</p>
                        <p className="text-gray-700"><span className="font-semibold">Nom:</span> {selectedClient.nom}</p>
                        <p className="text-gray-700"><span className="font-semibold">Tel:</span> {selectedClient.telephone}</p>
                        <p className="text-gray-700"><span className="font-semibold">Adresse:</span> {selectedClient.adresse}</p>
                    </div>
                </div>
                <form onSubmit={handleCreateUser} className="mt-8 space-y-4">
                    <div>
                        <label htmlFor="login" className="block text-left font-medium text-gray-700">Login</label>
                        <input type="text" name="login" id="login" placeholder="Login"
                            value={login}
                            onChange={(e) => setLogin(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-left font-medium text-gray-700">Password</label>
                        <input type="password" name="password" id="password" placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" />
                    </div>
                <div className="flex justify-between mt-8">
                    <button type="button" onClick={closeModale}
                        className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition duration-200">ANNULER
                    </button>
                    <button
                    type="submit"  // Make sure this is set to "submit"
                    className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition duration-200"
                    >
                    {isLoading? 'Envoi en cours...' : 'Enregistrer'}
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
