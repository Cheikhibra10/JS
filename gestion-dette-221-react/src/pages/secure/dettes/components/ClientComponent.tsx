import React, { ChangeEvent, FormEvent, useRef, useState } from 'react';
import { z } from "zod";
import axiosFetch from '../../../../hooks/axios.fetch';
import { Client } from '../../../../models/client.model';

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

const ClientComponent = () => {
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [telephone, setTelephone] = useState('');
  const [adresse, setAdresse] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [categorieId, setCategorieId] = useState<number>(3); // Default is 3 (Bronze)
  const [maxMontant, setMaxMontant] = useState<number | null>(null); // For categorieId = 2
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showAccountFields, setShowAccountFields] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState('');
  const [isMessageVisible, setIsMessageVisible] = useState(false);


  const { mutate: createClient, isLoading } = axiosFetch.usePost<Client>('/clients', {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

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
    
    // Validate required fields
    if (!categorieId) {
        setFormErrors((prev) => ({ ...prev, categorieId: 'Categorie is required' }));
        return;
    }

    // Conditional check for max_montant
    if (categorieId === 2 && maxMontant === null) {
        setFormErrors((prev) => ({ ...prev, maxMontant: 'Max montant is required for category 2' }));
        return;
    }

    if (!validateForm(formData)) return;
    const finalFormData = new FormData();
    finalFormData.append('nom', nom);
    finalFormData.append('prenom', prenom);
    finalFormData.append('telephone', telephone);
    finalFormData.append('adresse', adresse);
    finalFormData.append('categorieId', categorieId.toString());
    
    // Append max_montant only if required
    if (categorieId === 2 && maxMontant !== null) {
        finalFormData.append('max_montant', maxMontant.toString());
    }
    
    // Append photo only if provided
    if (photo) {
        finalFormData.append('photo', photo);
    }
    
    // Add login and password only if showAccountFields is true
    if (showAccountFields) {
        finalFormData.append('login', login);
        finalFormData.append('password', password);
    }

    console.log('Final form data:', finalFormData);

    try {
        await createClient(finalFormData, {
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
                showNotification('Client(e) a été successivement ajouté(e)');
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

  const handleToggleChange = () => {
    setShowAccountFields(!showAccountFields);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
       {isMessageVisible && (
             <div className="flex rounded-md bg-green-50 p-4 notification text-sm text-green-500 fade-in">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="mr-3 h-5 w-5 flex-shrink-0">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
      </svg>
      <div><b>Success alert: </b>{message}</div>
  </div>
        )}
      <h2 className="text-2xl font-bold mb-6 text-blue-800">
        <i className="fas fa-user-plus mr-2"></i>Nouveau Client
      </h2>
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
            placeholder="Entrer le numéro de téléphone"
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

        <div className="form-row mb-4 flex items-center space-x-2 ">
        <label htmlFor="photo" className="w-1/4 flex-shrink-0 font-semibold text-gray-700 flex items-center">
            <i className="fas fa-file-upload mr-2"></i>Photo
          </label>        
          <input type="file" 
          id="photo" name="photo" className="block w-80 border border-gray-200 shadow-sm rounded-lg text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400
          file:bg-gray-50 file:border-0
          file:me-4
          file:py-3 file:px-4
          dark:file:bg-neutral-700 dark:file:text-neutral-400"
          onChange={handleFileChange}
          ref={fileInputRef}
          />
        </div>

        <div className="form-row mb-4 flex items-center space-x-2">
          <label htmlFor="categorieId" className="w-1/4 flex-shrink-0 font-semibold text-gray-700 flex items-center">
            Catégorie
          </label>
          <select
            id="categorieId"
            className="input-shadow flex-grow p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            value={categorieId}
            onChange={(e) => {
              setCategorieId(Number(e.target.value));
              if (Number(e.target.value) !== 2) setMaxMontant(null); // Reset maxMontant if not categorieId 2
            }}
          >
            <option value={1}>Gold</option>
            <option value={2}>Silver</option>
            <option value={3}>Bronze</option>
          </select>
        </div>

        {categorieId === 2 && (
          <div className="form-row mb-4 flex items-center space-x-2">
            <label htmlFor="maxMontant" className="w-1/4 flex-shrink-0 font-semibold text-gray-700 flex items-center">
              Montant Max
            </label>
            <input
              type="number"
              id="maxMontant"
              name="maxMontant"
              className="input-shadow flex-grow p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              value={maxMontant === null ? '' : maxMontant}
              onChange={e => setMaxMontant(e.target.value === '' ? null : Number(e.target.value))}
            />
          </div>
        )}
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
          <span className="toggle-label ml-2 text-gray-600"> {showAccountFields ? 'Oui' : 'Non'}</span>
        </div>
        {showAccountFields && (
          <div id="accountFields">
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
        {formErrors.adresse && <p className="text-red-500">{formErrors.adresse}</p>}
          </div>
        )}
        <div className="flex justify-end">
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
        {showSuccess && (
          <div className="mt-4 p-2 bg-green-100 text-green-700 rounded">
            Client créé avec succès !
          </div>
        )}
      </form>
    </div>
  );
};

export default ClientComponent;
