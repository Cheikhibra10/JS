import { Navigate, NavLink, Outlet } from "react-router-dom";
import { authService } from "../services/AuthService";

export default function AuthGuard(){
    const logged = authService.isLogged();
    if(!logged) return <Navigate to="/login"/>
    return<Outlet/>;
}