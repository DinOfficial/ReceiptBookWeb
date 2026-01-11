
import React, { createContext, useContext, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './firebase';
import { getCompanyByOwner } from './services/database';
import { Company, UserContextType } from './types';
import { ToastProvider } from './context/ToastContext';
import { Loader } from './components/Loader';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CompanySetup from './pages/CompanySetup';
import InvoiceList from './pages/InvoiceList';
import CreateInvoice from './pages/CreateInvoice';
import InvoiceDetails from './pages/InvoiceDetails';
import CustomerList from './pages/CustomerList';
import Settings from './pages/Settings';

// Layout
import SidebarLayout from './components/SidebarLayout';

const UserContext = createContext<UserContextType>({
  user: null,
  company: null,
  loading: true,
  refreshCompany: async () => {},
});

export const useUser = () => useContext(UserContext);

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshCompany = async (uid?: string) => {
    const userId = uid || user?.uid;
    if (userId) {
      const companyData = await getCompanyByOwner(userId);
      setCompany(companyData);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await refreshCompany(currentUser.uid);
      } else {
        setCompany(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user?.uid]);

  if (loading) {
    return <Loader fullScreen={true} />;
  }

  return (
    <ThemeProvider>
      <LanguageProvider>
        <ToastProvider>
          <UserContext.Provider value={{ user, company, loading, refreshCompany }}>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<RootRoute />} />
                <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" replace />} />
                
                <Route element={<ProtectedRoute />}>
                  {/* Dashboard and Main App Routes - No longer requires company check for access */}
                  <Route element={<SidebarLayout />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/invoices" element={<InvoiceList />} />
                    <Route path="/invoices/new" element={<CreateInvoice />} />
                    <Route path="/invoices/:customerId/:invoiceId" element={<InvoiceDetails />} />
                    <Route path="/customers" element={<CustomerList />} />
                    <Route path="/settings" element={<Settings />} />
                  </Route>

                  {/* Setup Route */}
                  <Route path="/setup" element={<CompanySetup />} />
                </Route>
                
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </BrowserRouter>
          </UserContext.Provider>
        </ToastProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};

const RootRoute = () => {
  const { user } = useUser();
  // Redirect strictly based on login status, ignoring company existence
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  return <Landing />;
};

const ProtectedRoute = () => {
  const { user } = useUser();
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default App;
