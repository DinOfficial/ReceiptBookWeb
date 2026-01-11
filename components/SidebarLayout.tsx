
import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useUser } from '../App';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  LogOut, 
  PlusCircle,
  Menu,
  X,
  Settings,
  Sun,
  Moon,
  Globe
} from 'lucide-react';
import { Logo } from './Logo';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { Language } from '../utils/translations';

const SidebarLayout: React.FC = () => {
  const { user, company } = useUser();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t, isRTL } = useLanguage();

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  const navItems = [
    { name: t('dashboard'), path: '/dashboard', icon: LayoutDashboard },
    { name: t('invoices'), path: '/invoices', icon: FileText },
    { name: t('customers'), path: '/customers', icon: Users },
    { name: t('settings'), path: '/settings', icon: Settings },
  ];

  const toggleLang = () => {
    const langs: Language[] = ['en', 'bn', 'ar'];
    const nextIdx = (langs.indexOf(language) + 1) % langs.length;
    setLanguage(langs[nextIdx]);
  };

  return (
    <div className={`flex h-screen bg-slate-50 dark:bg-slate-900 overflow-hidden ${isRTL ? 'flex-row-reverse' : ''}`}>
      {/* Sidebar Desktop */}
      <aside className={`hidden md:flex flex-col w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 shadow-sm ${isRTL ? 'border-l border-r-0' : ''}`}>
        <div className="p-6">
          <div className={`flex items-center gap-3 mb-8 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center shadow-md shadow-primary/20 shrink-0">
              <Logo className="text-white" size={18} />
            </div>
            <div className={`min-w-0 ${isRTL ? 'text-right' : 'text-left'}`}>
              <h1 className="font-bold text-slate-800 dark:text-white leading-tight truncate">{t('companyName')}</h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider truncate">
                {company?.name || 'Business'}
              </p>
            </div>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `
                  flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                  ${isActive 
                    ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-primary dark:hover:text-white'}
                  ${isRTL ? 'flex-row-reverse' : ''}
                `}
              >
                <item.icon size={20} />
                <span className="font-medium">{item.name}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-slate-100 dark:border-slate-700">
          <button 
            onClick={handleLogout}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-all w-full ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <LogOut size={20} />
            <span className="font-medium">{t('logout')}</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className={`h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-6 z-10 print:hidden ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className="flex items-center gap-4">
             <button 
                className="md:hidden text-slate-600 dark:text-slate-300"
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu size={24} />
              </button>
          </div>

          <div className={`flex items-center gap-4 ${isRTL ? 'mr-auto' : 'ml-auto'}`}>
            {/* Language Toggle */}
            <button 
              onClick={toggleLang}
              className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg flex items-center gap-2"
              title="Change Language"
            >
              <Globe size={20} />
              <span className="text-xs font-bold uppercase">{language}</span>
            </button>

            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <button 
              onClick={() => navigate('/invoices/new')}
              className={`hidden sm:flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-primary/90 transition-all shadow-md shadow-primary/20 ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              <PlusCircle size={18} />
              {t('newInvoice')}
            </button>
            <div className="h-8 w-px bg-slate-200 dark:bg-slate-600"></div>
            <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200 hidden sm:block">
                {company?.name || user?.email}
              </span>
              <img 
                src={company?.photo || `https://ui-avatars.com/api/?name=${company?.name || user?.email || 'User'}`} 
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-600"
              />
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50 dark:bg-slate-900">
          <Outlet />
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex" style={{ direction: 'ltr' }}>
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}></div>
          <div className={`relative w-64 bg-white dark:bg-slate-800 h-full shadow-2xl flex flex-col ${isRTL ? 'ml-auto' : ''}`}>
            <div className={`p-6 flex items-center justify-between border-b border-slate-100 dark:border-slate-700 ${isRTL ? 'flex-row-reverse' : ''}`}>
               <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                 <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                    <Logo className="text-white" size={18} />
                 </div>
                 <span className="font-bold text-slate-800 dark:text-white">{t('companyName')}</span>
               </div>
              <button onClick={() => setMobileMenuOpen(false)} className="text-slate-500 dark:text-slate-400"><X size={24} /></button>
            </div>
            <nav className="p-4 space-y-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) => `
                    flex items-center gap-3 px-4 py-3 rounded-xl
                    ${isActive ? 'bg-primary text-white' : 'text-slate-600 dark:text-slate-400'}
                    ${isRTL ? 'flex-row-reverse text-right' : ''}
                  `}
                >
                  <item.icon size={20} />
                  <span className="font-medium">{item.name}</span>
                </NavLink>
              ))}
              <button 
                onClick={handleLogout}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 dark:text-red-400 w-full ${isRTL ? 'flex-row-reverse text-right' : ''}`}
              >
                <LogOut size={20} />
                <span className="font-medium">{t('logout')}</span>
              </button>
            </nav>
          </div>
        </div>
      )}
    </div>
  );
};

export default SidebarLayout;
