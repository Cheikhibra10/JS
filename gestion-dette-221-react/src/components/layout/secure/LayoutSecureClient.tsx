import { Outlet } from "react-router-dom";
import SideBarSecureClient from "./sidebar/SideBarSecureClient";
import HeaderSecureClient from "./header/HeaderSecureClient";

/**
 * LayoutSecure component
 * 
 * This component represents the layout structure for the secure part of the application.
 * It provides the overall layout for secured pages, including a sidebar, header, and content area.
 */
export default function LayoutSecureClient() {
    return (
       <>
        {/* Sidebar component for secure layout */}
        <SideBarSecureClient />

        {/* Overlay for toggling sidebar visibility on smaller screens */}
        <div className="overlay" id="overlay"></div>

        {/* Main content area */}
        <div className="content">
            {/* Header component that includes user information and search bar */}
            <HeaderSecureClient />
            
            {/* Outlet renders the child components associated with the current route */}
            <Outlet />
        </div>
       </>
    );
}
