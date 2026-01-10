
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

const InvoiceList: React.FC = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

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
    if (confirm('Are you sure you want to delete this invoice?')) {
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

  if (loading) return <div>Loading invoices...</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Invoices</h1>
          <p className="text-slate-500">You have {invoices.length} total invoices generated.</p>
        </div>
        <button 
          onClick={() => navigate('/invoices/new')}
          className="bg-primary text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-primary/90 shadow-lg shadow-primary/25 transition-all"
        >
          <Plus size={20} />
          Create Invoice
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Search by invoice number or customer name..."
            className="input-primary pl-12"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold">
                <th className="px-6 py-4">Invoice #</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Issued Date</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInvoices.map((invoice) => {
                return (
                  <tr 
                    key={invoice.id} 
                    className="group hover:bg-slate-50 transition-colors cursor-pointer"
                    onClick={() => navigate(`/invoices/${invoice.customerId}/${invoice.id}`)}
                  >
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800">#{invoice.invoiceNo}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-800">{invoice.customerName}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {invoice.date?.toDate ? invoice.date.toDate().toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800">${invoice.total.toFixed(2)}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        invoice.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 text-slate-400 hover:text-primary transition-colors" title="View">
                          <Eye size={18} />
                        </button>
                        <button 
                            className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                            onClick={(e) => handleDelete(e, invoice)}
                            title="Delete"
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
                      <p>No invoices found matching your search.</p>
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
