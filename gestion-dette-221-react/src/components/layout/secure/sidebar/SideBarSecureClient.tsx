import { NavLink } from "react-router-dom";
import "./SideBarSecure.css";
export default function SideBarSecureClient(){
    return (
        <div className="sidebar " id="sidebar">
             <button id="closeSidebar" className="absolute top-4 right-4 text-white hover:text-gray-300">
                <svg className="w-6 h-6" stroke="currentColor" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 18L18 6M6 6l12 12">
                    </path>
                </svg>
            </button>
            <div className="p-4 flex items-center h-32 logo">
                <svg className="w-20 h-20 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="40" height="24" rx="4" fill="white" />
                    <path
                    d="M17 8H7C5.89543 8 5 8.89543 5 10V16C5 17.1046 5.89543 18 7 18H17C18.1046 18 19 17.1046 19 16V10C19 8.89543 18.1046 8 17 8Z"
                    stroke="#1E40AF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <path
                    d="M12 12C12.5523 12 13 11.5523 13 11C13 10.4477 12.5523 10 12 10C11.4477 10 11 10.4477 11 11C11 11.5523 11.4477 12 12 12Z"
                    stroke="#1E40AF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M16 16H8" stroke="#1E40AF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <div className="flex flex-col">
                    <span className=" text-white font-bold text-xl">GESTION</span>
                    <span className=" text-white font-bold text-xl">BOUTIQUE</span>
                </div>
            </div>
        <NavLink className="block px-4 py-2 mt-2 text-sm font-semibold text-white hover:bg-gray-600"
          to="demande/list"><i className="fas fa-envelope text-lg mr-3"></i>Listes Demandes
        </NavLink>
        <NavLink className="block px-4 py-2 mt-2 text-sm font-semibold text-white hover:bg-gray-600"
          to="demande/nouvelle"><i className="fas fa-envelope text-lg mr-3"></i>Mes Demandes
        </NavLink>
     </div>
    )
}