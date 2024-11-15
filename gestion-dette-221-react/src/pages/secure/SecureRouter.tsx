import { Route, Routes } from "react-router-dom";
import { ArticlePage, DashboardPage, ErrorPage, LayoutSecure } from "./export";
import DettePage from "./dettes/DettePage";
import DetteDetailComponent from "./dettes/components/DetteDetailComponent";
import ClientPage from "./clients/ClientPage";
import DetteClientDetailComponent from "./dettes/components/DetteClientDetailComponent";
import DetteNouvelleComponent from "./dettes/components/DetteNouvelleComponent";
import UserComponent from "./users/component/UserComponent";
import DemandePage from "./demandes/DemandePage";
import { useAuth } from "../../utils/AuthProvider";
import LayoutSecureClient from "../../components/layout/secure/LayoutSecureClient";
import DemandeDetailComponent from "./demandes/component/DemandeDetailComponent";
import DemandeListComponent from "./demandes/component/DemandeListComponent";
import { NouvelleDemandeComponent } from "./demandes/component/NouvelleDemandeComponent";

export default function SecureRouter(){
    const { isAdmin, isBoutiquier, isClient } = useAuth(); // Get role check functions
    return(
        <Routes>
            {isBoutiquier() || isAdmin() ? (
            <Route element={<LayoutSecure/>}>
                <Route index element={<ArticlePage/>}/>
                <Route path='dashboard' element={<DashboardPage/>} />
                <Route path='article' element={<ArticlePage/>} />
                <Route path='dette' element={<DettePage/>} />
                <Route path='dette/clients/:telephone/dette' element={<DetteDetailComponent/>} />
                <Route path='dette/clients/:telephone/dette/nouvelle' element={<DetteNouvelleComponent/>} />
                <Route path='client/clients/:telephone/dette' element={<DetteDetailComponent/>} />
                <Route path='dette/clients/:telephone/dette/:id/articles' element={<DetteClientDetailComponent />} />
                <Route path='client' element={<ClientPage/>} />
                <Route path='user' element={<UserComponent/>} />
                <Route path='demande' element={<DemandePage/>} />
                <Route path='demande/clients/:telephone/dettes/dette/:clientId/demande/articles' element={<DemandeDetailComponent />} />
            </Route>
            ): isClient() ? (
                <Route element={<LayoutSecureClient />}>
                <Route path='demande/list' element={<DemandeListComponent/>} />
                <Route path='demande/nouvelle' element={<NouvelleDemandeComponent/>} />
                <Route path='dashboard' element={<DashboardPage/>} />
                </Route>
            ) : (
                <Route path='*' element={<ErrorPage />} />
            )}
        </Routes>
    )
}
