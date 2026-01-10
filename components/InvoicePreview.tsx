
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
  const template = company?.templateId || 'standard';

  // --- MINIMAL TEMPLATE ---
  if (template === 'minimal') {
    return (
      <div className="bg-white text-slate-900 p-8 shadow-2xl shadow-slate-200 border border-slate-100 min-h-[29.7cm] w-full max-w-[21cm] mx-auto print:shadow-none print:border-none print:w-full print:max-w-none font-mono">
        <div className="border-b-2 border-black pb-8 mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold uppercase tracking-tighter mb-2">{company?.name || 'COMPANY NAME'}</h1>
              <div className="text-sm space-y-1">
                <p>{company?.address}</p>
                <p>{company?.phone}</p>
                <p>{company?.email}</p>
              </div>
            </div>
            <div className="text-right">
              <h2 className="text-xl font-bold">INVOICE</h2>
              <p className="text-lg">#{invoice.invoiceNo}</p>
              <p className="text-sm mt-2">
                {invoice.date?.toDate 
                  ? invoice.date.toDate().toLocaleDateString() 
                  : new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="font-bold border-b border-black inline-block mb-2">BILL TO:</h3>
          <p className="text-lg">{invoice.customerName}</p>
        </div>

        <table className="w-full text-left mb-8">
          <thead>
            <tr className="border-b border-black">
              <th className="py-2 font-bold w-1/2">ITEM</th>
              <th className="py-2 font-bold text-center">QTY</th>
              <th className="py-2 font-bold text-right">PRICE</th>
              <th className="py-2 font-bold text-right">TOTAL</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index} className="border-b border-dashed border-gray-300">
                <td className="py-3">{item.name}</td>
                <td className="py-3 text-center">{item.quantity}</td>
                <td className="py-3 text-right">${item.price.toFixed(2)}</td>
                <td className="py-3 text-right">${item.total.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end">
          <div className="w-1/2 space-y-2 text-right">
            <div className="flex justify-between"><span>Subtotal:</span> <span>${subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Discount:</span> <span>-${(subtotal * (discount / 100)).toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Tax:</span> <span>+${((subtotal - (subtotal * (discount / 100))) * (tax / 100)).toFixed(2)}</span></div>
            <div className="flex justify-between border-t-2 border-black pt-2 font-bold text-xl">
              <span>TOTAL:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- MODERN TEMPLATE ---
  if (template === 'modern') {
    return (
      <div className="bg-white text-slate-800 min-h-[29.7cm] w-full max-w-[21cm] mx-auto shadow-2xl shadow-slate-200 border border-slate-100 print:shadow-none print:border-none print:w-full print:max-w-none overflow-hidden rounded-none">
        {/* Colorful Header */}
        <div className="bg-[#2692CE] text-white p-12 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold tracking-tight mb-2">{company?.name || 'Company'}</h1>
            <p className="opacity-80 text-sm max-w-xs">{company?.address}</p>
          </div>
          <div className="text-right">
             <div className="text-5xl font-black opacity-20">INVOICE</div>
             <div className="text-xl font-bold mt-[-20px] relative z-10">#{invoice.invoiceNo}</div>
          </div>
        </div>

        <div className="p-12">
          <div className="flex justify-between mb-12">
            <div>
               <h3 className="text-xs font-bold text-slate-400 uppercase mb-2">Billed To</h3>
               <p className="text-2xl font-bold text-slate-800">{invoice.customerName}</p>
            </div>
            <div className="text-right">
               <h3 className="text-xs font-bold text-slate-400 uppercase mb-2">Date Issued</h3>
               <p className="text-lg font-medium">
                 {invoice.date?.toDate 
                    ? invoice.date.toDate().toLocaleDateString() 
                    : new Date().toLocaleDateString()}
               </p>
            </div>
          </div>

          <table className="w-full mb-12">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="py-4 px-4 text-left rounded-l-lg">Description</th>
                <th className="py-4 px-4 text-center">Qty</th>
                <th className="py-4 px-4 text-right">Price</th>
                <th className="py-4 px-4 text-right rounded-r-lg">Total</th>
              </tr>
            </thead>
            <tbody>
               {items.map((item, index) => (
                <tr key={index} className="border-b border-slate-50 last:border-0">
                  <td className="py-4 px-4 font-bold text-slate-700">{item.name}</td>
                  <td className="py-4 px-4 text-center text-slate-500">{item.quantity}</td>
                  <td className="py-4 px-4 text-right text-slate-500">${item.price.toFixed(2)}</td>
                  <td className="py-4 px-4 text-right font-bold text-primary">${item.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-end">
             <div className="bg-slate-50 p-6 rounded-xl w-1/2">
                <div className="flex justify-between mb-2">
                  <span className="text-slate-500">Subtotal</span>
                  <span className="font-bold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-slate-500">Discount</span>
                  <span className="text-red-500">-${(subtotal * (discount / 100)).toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-4">
                  <span className="text-slate-500">Tax</span>
                  <span>+${((subtotal - (subtotal * (discount / 100))) * (tax / 100)).toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-4">
                  <span className="text-xl font-bold text-slate-800">Total</span>
                  <span className="text-xl font-bold text-[#2692CE]">${total.toFixed(2)}</span>
                </div>
             </div>
          </div>
          
          <div className="mt-12 text-center text-slate-400 text-sm">
             <p>{company?.email} • {company?.phone}</p>
          </div>
        </div>
      </div>
    );
  }

  // --- STANDARD TEMPLATE (Default) ---
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
