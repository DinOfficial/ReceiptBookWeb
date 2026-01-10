
import React, { createContext, useContext, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './firebase';
import { getCompanyByOwner } from './services/database';
import { Company, UserContextType } from './types';
import { ToastProvider } from './context/ToastContext';
import { Loader } from './components/Loader';

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

  // Load theme preference
  useEffect(() => {
    const applyTheme = () => {
      const savedTheme = localStorage.getItem('theme') || 'system';
      const root = document.documentElement;
      
      if (savedTheme === 'dark') {
        root.classList.add('dark');
      } else if (savedTheme === 'light') {
        root.classList.remove('dark');
      } else {
        // System preference
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
      }
    };

    applyTheme();

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemChange = () => applyTheme();
    
    mediaQuery.addEventListener('change', handleSystemChange);
    return () => mediaQuery.removeEventListener('change', handleSystemChange);
  }, []);

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
    <ToastProvider>
      <UserContext.Provider value={{ user, company, loading, refreshCompany }}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<RootRoute />} />
            <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" replace />} />
            
            <Route element={<ProtectedRoute />}>
              <Route path="/setup" element={<CompanySetup />} />
              
              <Route element={<CompanyRequiredRoute />}>
                <Route element={<SidebarLayout />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/invoices" element={<InvoiceList />} />
                  <Route path="/invoices/new" element={<CreateInvoice />} />
                  <Route path="/invoices/:customerId/:invoiceId" element={<InvoiceDetails />} />
                  <Route path="/customers" element={<CustomerList />} />
                  <Route path="/settings" element={<Settings />} />
                </Route>
              </Route>
            </Route>
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </UserContext.Provider>
    </ToastProvider>
  );
};

const RootRoute = () => {
  const { user, company } = useUser();
  if (user) {
    // If logged in, redirect based on company existence
    return company ? <Navigate to="/dashboard" replace /> : <Navigate to="/setup" replace />;
  }
  return <Landing />;
};

const ProtectedRoute = () => {
  const { user } = useUser();
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

const CompanyRequiredRoute = () => {
  const { company } = useUser();
  // Check if we are already on the setup page to avoid infinite redirect loop
  const isSetupPage = window.location.pathname === '/setup';
  return company ? <Outlet /> : (isSetupPage ? <Outlet /> : <Navigate to="/setup" replace />);
};

export default App;
