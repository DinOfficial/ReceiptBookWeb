import React, { createContext, useContext, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './firebase';
import { getCompanyByOwner } from './services/database';
import { Company, UserContextType } from './types';

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
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <UserContext.Provider value={{ user, company, loading, refreshCompany }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
          
          <Route element={<ProtectedRoute />}>
            <Route path="/setup" element={company ? <Navigate to="/dashboard" /> : <CompanySetup />} />
            
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
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </UserContext.Provider>
  );
};

const ProtectedRoute = () => {
  const { user } = useUser();
  return user ? <Outlet /> : <Navigate to="/login" />;
};

const CompanyRequiredRoute = () => {
  const { company } = useUser();
  return company ? <Outlet /> : <Navigate to="/setup" />;
};

export default App;