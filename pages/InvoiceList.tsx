
import React, { useEffect, useState } from 'react';
import { useUser } from '../App';
import { getInvoices, deleteInvoice } from '../services/database';
import { Invoice } from '../types';
import { 
  Search, 
  Download, 
  Eye, 
  Filter, 
  ChevronRight,
  Plus,
  FileText,
  Trash2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Loader } from '../components/Loader';
import { useLanguage } from '../context/LanguageContext';

const InvoiceList: React.FC = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { t, isRTL } = useLanguage();

  const loadData = async () => {
    if (user) {
      const invData = await getInvoices(user.uid);
      setInvoices(invData);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleDelete = async (e: React.MouseEvent, invoice: Invoice) => {
    e.stopPropagation();
    if (!user || !invoice.customerId || !invoice.id) return;
    if (confirm(t('deleteInvoiceConfirm'))) {
        await deleteInvoice(user.uid, invoice.customerId, invoice.id);
        await loadData();
    }
  };

  const filteredInvoices = invoices.filter(inv => {
    return (
      inv.invoiceNo.includes(searchTerm) ||
      inv.customerName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  if (loading) return <Loader fullScreen={false} />;

  return (
    <div className={`max-w-7xl mx-auto space-y-6 ${isRTL ? 'text-right' : 'text-left'}`}>
      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 ${isRTL ? 'md:flex-row-reverse' : ''}`}>
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">{t('invoices')}</h1>
          <p className="text-slate-500 dark:text-slate-400">{t('invoicesCount').replace('{count}', invoices.length.toString())}</p>
        </div>
        <button 
          onClick={() => navigate('/invoices/new')}
          className={`bg-primary text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-primary/90 shadow-lg shadow-primary/25 transition-all ${isRTL ? 'flex-row-reverse' : ''}`}
        >
          <Plus size={20} />
          {t('createInvoice')}
        </button>
      </div>

      {/* Filters & Search */}
      <div className={`bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col md:flex-row gap-4 items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className="relative flex-1 w-full">
          <Search className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-slate-400`} size={20} />
          <input
            type="text"
            placeholder={t('searchInvoicePlaceholder')}
            className={`input-primary ${isRTL ? 'pr-12' : 'pl-12'} dark:bg-slate-700 dark:border-slate-600`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className={`w-full text-left ${isRTL ? 'text-right' : ''}`}>
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-semibold">
                <th className={`px-6 py-4 ${isRTL ? 'text-right' : 'text-left'}`}>{t('invoiceNum')}</th>
                <th className={`px-6 py-4 ${isRTL ? 'text-right' : 'text-left'}`}>{t('customer')}</th>
                <th className={`px-6 py-4 ${isRTL ? 'text-right' : 'text-left'}`}>{t('issuedDate')}</th>
                <th className={`px-6 py-4 ${isRTL ? 'text-right' : 'text-left'}`}>{t('amount')}</th>
                <th className={`px-6 py-4 ${isRTL ? 'text-right' : 'text-left'}`}>{t('status')}</th>
                <th className={`px-6 py-4 ${isRTL ? 'text-left' : 'text-right'}`}>{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {filteredInvoices.map((invoice) => {
                return (
                  <tr 
                    key={invoice.id} 
                    className="group hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                    onClick={() => navigate(`/invoices/${invoice.customerId}/${invoice.id}`)}
                  >
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800 dark:text-white">#{invoice.invoiceNo}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-800 dark:text-white">{invoice.customerName}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                      {invoice.date?.toDate ? invoice.date.toDate().toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800 dark:text-white">${invoice.total.toFixed(2)}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        invoice.status === 'Paid' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                      }`}>
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity ${isRTL ? 'justify-start' : 'justify-end'}`}>
                        <button className="p-2 text-slate-400 hover:text-primary transition-colors" title={t('view')}>
                          <Eye size={18} />
                        </button>
                        <button 
                            className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                            onClick={(e) => handleDelete(e, invoice)}
                            title={t('delete')}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredInvoices.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-20 text-center text-slate-400">
                    <div className="flex flex-col items-center gap-2">
                      <FileText size={48} className="opacity-20 mb-2" />
                      <p>{t('noInvoicesMatch')}</p>
                    </div>
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

export default InvoiceList;
