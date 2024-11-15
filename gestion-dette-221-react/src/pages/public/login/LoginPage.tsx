import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { authService, Credentials } from '../../../services/AuthService';
import './LoginPage.css';
import { useAuth } from '../../../utils/AuthProvider';

export default function LoginPage() {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const authProvider = useAuth();

    const handleConnexion = async (credentials: Credentials) => {
        try {
            const res = await authService.login(credentials);
            console.log("Login Response:", res.data.data.token);
            const { token, user } = res.data.data;
    
            console.log("Token before saving:", token);
            authService.saveToken(token);
            console.log("Token in local storage after saving:", localStorage.getItem('token')); // Check saved token
            localStorage.setItem('user', JSON.stringify(user));
            authProvider.setUser(user);
            console.log("User in Auth Provider:", authProvider.user);
    
            // Navigate based on user role
            if (user.role === 'CLIENT') {
                navigate('/boutique/demande/nouvelle', { replace: true });
            } else if (user.role === 'BOUTIQUIER' || user.role === 'ADMIN') {
                navigate('/boutique/article', { replace: true });
            } else {
                console.log("Unknown role:", user.role);
            }
        } catch (error) {
            console.log("Login error:", error);
        }
    };
        
    
    return (
        <div className="bg-white shadow-2xl rounded-lg overflow-hidden max-w-4xl w-full grid grid-cols-1 md:grid-cols-2">
            <div className="relative bg-gradient-to-br from-blue-900 to-blue-700 p-8 text-white flex flex-col justify-center">
                <div className="absolute top-0 left-0 bg-yellow-400 w-24 h-24 rounded-full transform -translate-x-12 -translate-y-12 parallax-shape"></div>
                <div className="absolute bottom-0 right-0 bg-yellow-400 w-36 h-36 rounded-full transform translate-x-12 translate-y-12 parallax-shape"></div>
                <div className="relative z-10 flex flex-col items-center">
                    <div className="p-4 flex items-center h-32">
                        <svg className="w-20 h-20 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="40" height="24" rx="4" fill="white" />
                            <path d="M17 8H7C5.89543 8 5 8.89543 5 10V16C5 17.1046 5.89543 18 7 18H17C18.1046 18 19 17.1046 19 16V10C19 8.89543 18.1046 8 17 8Z" stroke="#1E40AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M12 12C12.5523 12 13 11.5523 13 11C13 10.4477 12.5523 10 12 10C11.4477 10 11 10.4477 11 11C11 11.5523 11.4477 12 12 12Z" stroke="#1E40AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M16 16H8" stroke="#1E40AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <div className="flex flex-col">
                            <span className="text-white font-bold text-xl">GESTION</span>
                            <span className="text-white font-bold text-xl">BOUTIQUE</span>
                        </div>
                    </div>
                    <h2 className="text-4xl font-extrabold mb-4 text-center">Bienvenue <br /> Diallo Boutique</h2>
                    <p className="text-lg text-blue-200 mb-6 text-center">La plateforme idéale pour gérer vos ventes, articles et clients avec efficacité.</p>
                </div>
            </div>
            <div className="p-10 flex flex-col justify-center">
                <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">Connexion</h1>
                <p className="text-lg text-gray-500 text-center mb-8">Connectez-vous pour accéder à votre espace de gestion.</p>
                <form method="POST" className="space-y-6" onSubmit={handleSubmit(handleConnexion)}>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Adresse e-mail</label>
                        <input type="text" id="email"
                            className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 form-focus"
                            {...register("login", { required: true })}
                        />
                        {errors.login && <span className="text-red-500 text-sm">Ce champ est requis</span>}
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Mot de passe</label>
                        <input type="password" id="password"
                            className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 form-focus"
                            {...register("password", { required: true })}
                        />
                        {errors.password && <span className="text-red-500 text-sm">Ce champ est requis</span>}
                    </div>
                    <button type="submit"
                        className="w-full px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Connexion
                    </button>
                </form>
            </div>
        </div>
    );
}
