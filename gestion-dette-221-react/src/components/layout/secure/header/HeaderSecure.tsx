import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../../../services/AuthService";
import { useAuth } from "../../../../utils/AuthProvider";

/**
 * HeaderSecure component
 * 
 * This component represents the header section of a secure area within the app. 
 * It includes a search bar, user profile display with popover, and a logout button.
 */
export default function HeaderSecure() {
    const navigate = useNavigate();
    const authProvider = useAuth();
    const [isPopoverVisible, setPopoverVisible] = useState(false); // Manages the visibility of the popover
    const popoverRef = useRef<HTMLDivElement>(null); // Ref for the popover

    /**
     * Logs out the user and navigates them to the home page
     */
    const handleClick = () => {
        authService.logout(); // Calls the logout function from the authService
        navigate('/'); // Redirects to the home page after logout
    };

    /**
     * Toggles the visibility of the user profile popover
     */
    const togglePopover = () => {
        setPopoverVisible(!isPopoverVisible); // Toggles the popover's visibility state
    };

  

    /**
     * Closes the popover and notification dropdown when clicking outside of them
     */
    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
                setPopoverVisible(false); // Closes the popover if clicked outside
            }
        };

        document.addEventListener('mousedown', handleOutsideClick); // Adds event listener for outside clicks
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick); // Cleans up the event listener on component unmount
        };
    }, []);

    /**
     * Retrieves the full name of the authenticated user.
     * If the user is associated with a client, it returns the client's first and last name.
     * Otherwise, it defaults to 'User without Client'.
     */
    const fullname = authProvider.user?.client 
        ? `${authProvider.user.client.prenom} ${authProvider.user.client.nom}` 
        : 'User without Client';

    return (
        <header className="flex sticky top-0 z-50 flex-col sm:flex-row justify-between items-center bg-white shadow-md px-4 py-2 header">
            {/* Toggle button for the sidebar (visible on small screens) */}
            <button id="sidebarToggle" className="sm:hidden text-gray-500 mb-2 sm:mb-0">
                <svg className="w-8 h-8" stroke="currentColor" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
            </button>  

            {/* Search bar */}
            <div className="search-bar flex items-center w-full sm:w-1/2 lg:w-3/5 mb-2 sm:mb-0">
                <input 
                    type="text" 
                    placeholder="Rechercher dans votre boutique..."
                    className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm sm:text-base" 
                />
            </div>
            {/* User profile button */}
            <button 
                className="header-user flex items-center mt-2 sm:mt-0" 
                onClick={togglePopover} 
                type="button"
            >
                <img 
                    src={authProvider.user?.client?.photo ? authProvider.user.client.photo : "https://images.unsplash.com/photo-1499714608240-22fc6ad53fb2"} 
                    alt="Photo Utilisateur"
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-blue-500" 
                />
         <span className="absolute profil right-0 bottom-0 h-2 w-2 rounded-full bg-green-400 ring ring-white"></span>
                <div className="pl-2 sm:pl-4 py-1 ml-2">
                    <p className="text-gray-700 text-xs sm:text-sm font-semibold">
                        {authProvider.user?.client?.prenom}
                    </p>
                    <p className="text-gray-700 text-xs sm:text-sm font-semibold">
                        {authProvider.user?.role}
                    </p>
                </div>
            </button>

            {/* User profile popover */}
            <div 
                ref={popoverRef} // Popover ref for outside click detection
                data-popover 
                id="popover-bottom" 
                role="tooltip"
                className={`absolute right-2 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ${isPopoverVisible ? '' : 'invisible'}`} // Popover is hidden when `isPopoverVisible` is false
                style={{ top: 3 }}
            >
                <div className="px-4 py-2 text-center">
                    <img 
                        className="w-16 h-16 rounded-full mx-auto"
                        src={authProvider.user?.client?.photo}
                        alt="User avatar" 
                    />
                    <p className="mt-2 font-semibold">{fullname}</p> {/* Displays the user's full name */}
                </div>

                <button 
                    type="button" 
                    onClick={handleClick} // Handles logout action
                    className="block px-12 py-2 text-sm text-center text-gray-700 hover:bg-gray-100"
                >
                    DECONNEXION
                </button>
            </div>
        </header>
    );
}
