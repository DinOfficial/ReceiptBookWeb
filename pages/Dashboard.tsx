
import React, { useEffect, useState } from 'react';
import { useUser } from '../App';
import { getInvoices, getCustomers } from '../services/database';
import { Invoice, Customer } from '../types';
import { 
  TrendingUp, 
  Users, 
  FileText, 
  Clock, 
  ArrowRight,
  PlusCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Loader } from '../components/Loader';
import { useLanguage } from '../context/LanguageContext';

const Dashboard: React.FC = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const { t, isRTL } = useLanguage();

  useEffect(() => {
    const loadData = async () => {
      if (user) {
        const [invData, custData] = await Promise.all([
          getInvoices(user.uid),
          getCustomers(user.uid)
        ]);
        setInvoices(invData);
        setCustomers(custData);
      }
      setLoading(false);
    };
    loadData();
  }, [user]);

  const totalSales = invoices.reduce((sum, inv) => sum + inv.total, 0);
  const pendingInvoices = invoices.filter(i => i.status !== 'Paid').length;

  if (loading) return <Loader fullScreen={false} />;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header Section */}
      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 ${isRTL ? 'md:flex-row-reverse' : ''}`}>
        <div className={isRTL ? 'text-right' : 'text-left'}>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">{t('dashboard')}</h1>
          <p className="text-slate-500 dark:text-slate-400">{t('welcomeMessage')}</p>
        </div>
        <button 
          onClick={() => navigate('/invoices/new')}
          className={`bg-primary text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-primary/90 shadow-lg shadow-primary/25 transform hover:-translate-y-0.5 transition-all ${isRTL ? 'flex-row-reverse' : ''}`}
        >
          <PlusCircle size={20} />
          {t('createInvoice')}
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title={t('totalRevenue')}
          value={`$${totalSales.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} 
          icon={<TrendingUp className="text-green-600" />}
          color="bg-green-100"
        />
        <StatCard 
          title={t('totalInvoices')}
          value={invoices.length.toString()} 
          icon={<FileText className="text-primary" />}
          color="bg-blue-100"
        />
        <StatCard 
          title={t('totalCustomers')}
          value={customers.length.toString()} 
          icon={<Users className="text-purple-600" />}
          color="bg-purple-100"
        />
        <StatCard 
          title={t('pending')}
          value={pendingInvoices.toString()} 
          icon={<Clock className="text-orange-600" />}
          color="bg-orange-100"
        />
      </div>

      {/* Recent Invoices Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
        <div className={`p-6 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
          <h2 className="text-lg font-bold text-slate-800 dark:text-white">{t('recentInvoices')}</h2>
          <button 
            onClick={() => navigate('/invoices')}
            className={`text-primary font-medium text-sm flex items-center gap-1 hover:underline ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            {t('viewAll')} <ArrowRight size={16} className={isRTL ? 'rotate-180' : ''} />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className={`w-full text-left ${isRTL ? 'text-right' : ''}`}>
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-semibold">
                <th className={`px-6 py-4 ${isRTL ? 'text-right' : 'text-left'}`}>{t('invoiceNum')}</th>
                <th className={`px-6 py-4 ${isRTL ? 'text-right' : 'text-left'}`}>{t('customer')}</th>
                <th className={`px-6 py-4 ${isRTL ? 'text-right' : 'text-left'}`}>{t('date')}</th>
                <th className={`px-6 py-4 ${isRTL ? 'text-right' : 'text-left'}`}>{t('amount')}</th>
                <th className={`px-6 py-4 ${isRTL ? 'text-right' : 'text-left'}`}>{t('status')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {invoices.slice(0, 5).map((invoice) => (
                <tr key={invoice.id} className="hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-800 dark:text-white">#{invoice.invoiceNo}</td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                    {invoice.customerName || 'Unknown'}
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                    {invoice.date?.toDate ? invoice.date.toDate().toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-800 dark:text-white">${invoice.total.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      invoice.status === 'Paid' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                    }`}>
                      {invoice.status}
                    </span>
                  </td>
                </tr>
              ))}
              {invoices.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    {t('noInvoices')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => {
  const { isRTL } = useLanguage();
  return (
    <div className={`bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center gap-4 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
      <div className={`p-4 rounded-xl ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{title}</p>
        <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{value}</h3>
      </div>
    </div>
  );
};

export default Dashboard;
