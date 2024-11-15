import React, {  } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/public/login/LoginPage';
import AuthGuard from './utils/AuthGuard';
import ErrorPage from './utils/ErrorPage';
import { ArticleProvider } from './utils/ArticleContext';
import AuthProvider, { DetteProvider } from './utils/AuthProvider';
import { DemandeProvider } from './utils/DemandeContext';
import SecureRouter from './pages/secure/SecureRouter';

const queryClient = new QueryClient();
const App: React.FC = () => {
  return (
    <DetteProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
        <DemandeProvider>
        <ArticleProvider>
          <BrowserRouter>
            <Routes>
              <Route index element={<LoginPage />} />
              <Route path="login" element={<LoginPage />} />
              <Route element={<AuthGuard />}>
                <Route path="/boutique/*" element={<SecureRouter />} />
              </Route>
              <Route path="*" element={<ErrorPage />} />
            </Routes>
          </BrowserRouter>
          </ArticleProvider>
        </DemandeProvider>
        </AuthProvider>
      </QueryClientProvider>
     </DetteProvider>
  );
};

export default App;

