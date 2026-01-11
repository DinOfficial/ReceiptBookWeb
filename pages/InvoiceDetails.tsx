
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '../App';
import { getInvoiceById, deleteInvoice } from '../services/database';
import { Invoice } from '../types';
import { InvoicePreview } from '../components/InvoicePreview';
import { ChevronLeft, Printer, Trash2 } from 'lucide-react';
import { Loader } from '../components/Loader';
import { useLanguage } from '../context/LanguageContext';

const InvoiceDetails: React.FC = () => {
  const { invoiceId, customerId } = useParams();
  const { user, company } = useUser();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const { t, isRTL } = useLanguage();

  useEffect(() => {
    const loadInvoice = async () => {
      if (user && invoiceId && customerId) {
        const data = await getInvoiceById(user.uid, customerId, invoiceId);
        setInvoice(data);
      }
      setLoading(false);
    };
    loadInvoice();
  }, [user, invoiceId, customerId]);

  const handleDelete = async () => {
    if (!user || !invoice || !invoice.customerId) return;
    if (confirm(t('deleteInvoiceConfirm'))) {
        await deleteInvoice(user.uid, invoice.customerId, invoice.id!);
        navigate('/invoices');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <Loader fullScreen={false} />;
  if (!invoice) return <div>Invoice not found</div>;

  return (
    <div className={`max-w-7xl mx-auto space-y-6 ${isRTL ? 'text-right' : 'text-left'}`}>
      <div className={`flex items-center justify-between print:hidden ${isRTL ? 'flex-row-reverse' : ''}`}>
        <button onClick={() => navigate(-1)} className={`flex items-center gap-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <ChevronLeft size={20} className={isRTL ? 'rotate-180' : ''} /> {t('back')}
        </button>
        <div className="flex gap-3">
          <button 
            onClick={handleDelete}
            className={`flex items-center gap-2 px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <Trash2 size={18} /> {t('delete')}
          </button>
          <button 
            onClick={handlePrint}
            className={`flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 shadow-md ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <Printer size={18} /> Print / Save PDF
          </button>
        </div>
      </div>

      <div className="flex justify-center">
        <InvoicePreview 
          company={company}
          invoice={invoice}
          items={invoice.items}
          subtotal={invoice.subtotal}
          discount={invoice.discount}
          tax={invoice.tax}
          total={invoice.total}
        />
      </div>
    </div>
  );
};

export default InvoiceDetails;
