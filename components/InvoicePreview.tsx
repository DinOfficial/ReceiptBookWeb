
import React from 'react';
import { Company, Invoice } from '../types';

interface InvoicePreviewProps {
  invoice: Partial<Invoice>;
  company: Company | null;
  items: any[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
}

export const InvoicePreview: React.FC<InvoicePreviewProps> = ({
  invoice,
  company,
  items,
  subtotal,
  discount,
  tax,
  total,
}) => {
  return (
    <div className="bg-white text-slate-800 p-8 shadow-2xl shadow-slate-200 border border-slate-100 min-h-[29.7cm] w-full max-w-[21cm] mx-auto print:shadow-none print:border-none print:w-full print:max-w-none">
      {/* Header */}
      <div className="flex justify-between items-start mb-12">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
             {company?.photo && (
               <img src={company.photo} alt="Logo" className="w-12 h-12 object-contain rounded-lg" />
             )}
             <div>
                <h1 className="text-2xl font-bold text-primary">{company?.name || 'Your Company'}</h1>
                <p className="text-xs text-slate-500">{company?.address}</p>
                <p className="text-xs text-slate-500">{company?.phone} | {company?.email}</p>
             </div>
          </div>
        </div>
        <div className="text-right">
          <h2 className="text-4xl font-black text-slate-100 uppercase tracking-widest mb-2">Invoice</h2>
          <p className="font-bold text-slate-600">#{invoice.invoiceNo || '0000'}</p>
          <p className="text-sm text-slate-500">
            {invoice.date?.toDate 
              ? invoice.date.toDate().toLocaleDateString() 
              : new Date().toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Bill To */}
      <div className="mb-12 p-6 bg-slate-50 rounded-xl border border-slate-100">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Bill To</h3>
        <h4 className="text-lg font-bold text-slate-800 mb-1">{invoice.customerName || 'Customer Name'}</h4>
        {/* We might not have full customer object here in preview mode sometimes, but in Details we will */}
        {/* Placeholder if details missing */}
      </div>

      {/* Items */}
      <div className="mb-8">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b-2 border-slate-100">
              <th className="py-3 text-xs font-bold text-slate-400 uppercase tracking-wider w-1/2">Description</th>
              <th className="py-3 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Qty</th>
              <th className="py-3 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Price</th>
              <th className="py-3 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {items.map((item, index) => (
              <tr key={index}>
                <td className="py-4 text-sm font-medium text-slate-700">{item.name || 'Item Name'}</td>
                <td className="py-4 text-sm text-slate-500 text-center">{item.quantity}</td>
                <td className="py-4 text-sm text-slate-500 text-right">${item.price.toFixed(2)}</td>
                <td className="py-4 text-sm font-bold text-slate-700 text-right">${item.total.toFixed(2)}</td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={4} className="py-8 text-center text-slate-300 italic">No items added</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="flex justify-end">
        <div className="w-1/2 space-y-3">
          <div className="flex justify-between text-sm text-slate-500">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm text-slate-500">
            <span>Discount ({discount}%)</span>
            <span>-${(subtotal * (discount / 100)).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm text-slate-500">
            <span>Tax ({tax}%)</span>
            <span>+${((subtotal - (subtotal * (discount / 100))) * (tax / 100)).toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center pt-4 border-t-2 border-slate-100">
            <span className="font-bold text-slate-800">Grand Total</span>
            <span className="text-2xl font-bold text-primary">${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Footer / Notes */}
      <div className="mt-20 pt-8 border-t border-slate-100 text-center">
        <p className="text-sm font-bold text-slate-700 mb-1">Thank you for your business!</p>
        <p className="text-xs text-slate-400">Payment Due: {invoice.paymentSystem || 'Cash'}</p>
      </div>
    </div>
  );
};
