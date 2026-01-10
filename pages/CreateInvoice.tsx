
import React, { useState, useEffect } from 'react';
import { useUser } from '../App';
import { getCustomers, getLatestInvoiceNumber, createInvoice, createCustomer } from '../services/database';
import { Customer, InvoiceItem } from '../types';
import { Timestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { InvoicePreview } from '../components/InvoicePreview';
import { 
  Plus, 
  Trash2, 
  UserPlus, 
  ChevronLeft,
  Eye
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

const CreateInvoice: React.FC = () => {
  const { user, company } = useUser();
  const navigate = useNavigate();
  const { success, error } = useToast();
  
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  
  const [invoiceNo, setInvoiceNo] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [isAddingNewCustomer, setIsAddingNewCustomer] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  const [items, setItems] = useState<InvoiceItem[]>([
    { name: '', quantity: 1, price: 0, total: 0 }
  ]);
  const [discount, setDiscount] = useState(0);
  const [tax, setTax] = useState(0);
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState('Paid');
  const [paymentSystem, setPaymentSystem] = useState('Cash');

  // Derived customer name for preview
  const currentCustomerName = isAddingNewCustomer 
    ? newCustomer.name 
    : customers.find(c => c.id === selectedCustomerId)?.name || '';

  // Use configured payment methods or defaults
  const availablePaymentMethods = company?.paymentMethods && company.paymentMethods.length > 0 
    ? company.paymentMethods 
    : ['Cash', 'Card', 'Bank Transfer'];

  // Initialize paymentSystem with the first available option
  useEffect(() => {
    if (availablePaymentMethods.length > 0 && !availablePaymentMethods.includes(paymentSystem)) {
      setPaymentSystem(availablePaymentMethods[0]);
    }
  }, [availablePaymentMethods]);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        const [custData, latestNum] = await Promise.all([
          getCustomers(user.uid),
          getLatestInvoiceNumber(user.uid)
        ]);
        setCustomers(custData);
        setInvoiceNo(latestNum.toString());
      }
      setLoading(false);
    };
    fetchData();
  }, [user]);

  const handleItemChange = (index: number, field: keyof InvoiceItem, value: any) => {
    const newItems = [...items];
    const item = { ...newItems[index], [field]: value };
    
    if (field === 'quantity' || field === 'price') {
      item.total = item.quantity * item.price;
    }
    
    newItems[index] = item;
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { name: '', quantity: 1, price: 0, total: 0 }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const calculateSubtotal = () => items.reduce((sum, item) => sum + item.total, 0);
  const subtotal = calculateSubtotal();
  const discountAmount = subtotal * (discount / 100);
  const taxAmount = (subtotal - discountAmount) * (tax / 100);
  const total = subtotal - discountAmount + taxAmount;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);

    try {
      let finalCustomerId = selectedCustomerId;
      let finalCustomerName = '';

      if (isAddingNewCustomer) {
        const custRef = await createCustomer({ ...newCustomer, ownerUid: user.uid });
        finalCustomerId = custRef.id;
        finalCustomerName = newCustomer.name;
      } else {
        const existingCust = customers.find(c => c.id === selectedCustomerId);
        if (existingCust) finalCustomerName = existingCust.name;
      }

      if (!finalCustomerId) {
        throw new Error("Please select or create a customer");
      }

      const dateObj = new Date(invoiceDate);
      const timeString = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      await createInvoice({
        invoiceId: '',
        invoiceNo,
        customerId: finalCustomerId,
        customerName: finalCustomerName,
        items,
        subtotal,
        discount,
        tax: taxAmount,
        status,
        date: Timestamp.fromDate(dateObj),
        time: timeString,
        paymentSystem,
        total,
      }, user.uid);

      success('Invoice created successfully!');
      navigate('/invoices');
    } catch (err: any) {
      error(err.message || 'Failed to create invoice');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="animate-pulse p-8">Loading...</div>;

  return (
    <div className="h-[calc(100vh-80px)] overflow-hidden flex flex-col">
      <div className="flex items-center justify-between gap-4 mb-4 px-1 shrink-0">
        <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-white rounded-full transition-colors">
            <ChevronLeft size={24} />
            </button>
            <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Create New Invoice</h1>
            </div>
        </div>
        <button 
          onClick={() => setShowMobilePreview(!showMobilePreview)}
          className="lg:hidden p-2 text-primary border border-primary rounded-lg"
        >
          <Eye size={20} />
        </button>
      </div>

      <div className="flex-1 flex gap-8 overflow-hidden">
        {/* Left Column - Input Form */}
        <div className={`flex-1 overflow-y-auto pb-20 lg:pb-0 ${showMobilePreview ? 'hidden lg:block' : 'block'}`}>
          <form onSubmit={handleSave} className="space-y-6 max-w-2xl">
            {/* Customer Section */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 space-y-6">
              <div className="flex items-center gap-2 text-primary font-bold mb-2">
                <UserPlus size={20} />
                <span>Customer Information</span>
              </div>
              
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setIsAddingNewCustomer(false)}
                  className={`flex-1 py-2 rounded-lg text-sm font-bold border ${!isAddingNewCustomer ? 'bg-primary text-white border-primary' : 'bg-transparent text-slate-400 border-slate-200'}`}
                >
                  Existing
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddingNewCustomer(true)}
                  className={`flex-1 py-2 rounded-lg text-sm font-bold border ${isAddingNewCustomer ? 'bg-primary text-white border-primary' : 'bg-transparent text-slate-400 border-slate-200'}`}
                >
                  New
                </button>
              </div>

              {!isAddingNewCustomer ? (
                <select
                  className="input-primary dark:bg-slate-700"
                  value={selectedCustomerId}
                  onChange={(e) => setSelectedCustomerId(e.target.value)}
                  required={!isAddingNewCustomer}
                >
                  <option value="">Choose a customer...</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  <input
                    placeholder="Customer Name"
                    className="input-primary"
                    value={newCustomer.name}
                    onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                    required
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                        placeholder="Email"
                        className="input-primary"
                        value={newCustomer.email}
                        onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
                        required
                    />
                    <input
                        placeholder="Phone"
                        className="input-primary"
                        value={newCustomer.phone}
                        onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Invoice Details */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 grid grid-cols-2 gap-4">
               <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Invoice #</label>
                  <input className="input-primary" value={invoiceNo} onChange={(e) => setInvoiceNo(e.target.value)} required />
               </div>
               <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Date</label>
                  <input type="date" className="input-primary dark:text-slate-400" value={invoiceDate} onChange={(e) => setInvoiceDate(e.target.value)} required />
               </div>
               <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Status</label>
                  <select className="input-primary dark:bg-slate-700" value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="Paid">Paid</option>
                    <option value="Unpaid">Unpaid</option>
                  </select>
               </div>
               <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Payment</label>
                  <select className="input-primary dark:bg-slate-700" value={paymentSystem} onChange={(e) => setPaymentSystem(e.target.value)}>
                    {availablePaymentMethods.map(method => (
                      <option key={method} value={method}>{method}</option>
                    ))}
                  </select>
               </div>
            </div>

            {/* Items */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
               <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-slate-700 dark:text-slate-300">Items</h3>
                  <button type="button" onClick={addItem} className="text-primary hover:bg-slate-50 dark:hover:bg-slate-700 p-2 rounded"><Plus size={18}/></button>
               </div>
               <div className="space-y-4">
                {items.map((item, index) => (
                  <div key={index} className="grid grid-cols-12 gap-2 items-end border-b border-slate-50 dark:border-slate-700 pb-2">
                    <div className="col-span-5">
                      <input placeholder="Item" className="input-primary text-sm py-2" value={item.name} onChange={(e) => handleItemChange(index, 'name', e.target.value)} required />
                    </div>
                    <div className="col-span-2">
                      <input type="number" className="input-primary text-sm py-2 px-1 text-center" value={item.quantity} onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 0)} />
                    </div>
                    <div className="col-span-3">
                      <input type="number" className="input-primary text-sm py-2 px-1" value={item.price} onChange={(e) => handleItemChange(index, 'price', parseFloat(e.target.value) || 0)} />
                    </div>
                    <div className="col-span-2 flex items-center justify-between">
                       <span className="text-xs font-bold text-slate-600 dark:text-slate-400">${item.total.toFixed(0)}</span>
                       <button type="button" onClick={() => removeItem(index)} className="text-red-400 hover:text-red-600"><Trash2 size={16} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals Input */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 space-y-4">
                <div className="flex justify-between items-center dark:text-slate-300">
                    <span>Discount (%)</span>
                    <input type="number" className="input-primary w-20 text-right" value={discount} onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)} />
                </div>
                <div className="flex justify-between items-center dark:text-slate-300">
                    <span>Tax (%)</span>
                    <input type="number" className="input-primary w-20 text-right" value={tax} onChange={(e) => setTax(parseFloat(e.target.value) || 0)} />
                </div>
                <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center text-xl font-bold text-primary">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                </div>
            </div>

            <button
                type="submit"
                disabled={submitting}
                className="w-full bg-primary text-white py-4 rounded-xl font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
              >
                {submitting ? 'Generating...' : 'Save Invoice'}
            </button>
          </form>
        </div>

        {/* Right Column - Live Preview */}
        <div className={`flex-1 bg-slate-200/50 dark:bg-slate-900 rounded-2xl overflow-y-auto p-4 lg:p-8 ${showMobilePreview ? 'block fixed inset-0 z-50 bg-slate-100' : 'hidden lg:block'}`}>
            {showMobilePreview && (
                <button onClick={() => setShowMobilePreview(false)} className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-lg">
                    <Trash2 className="rotate-45" size={24} />
                </button>
            )}
            <div className="flex items-center justify-center min-h-full">
                <InvoicePreview 
                    company={company}
                    invoice={{
                        invoiceNo,
                        date: Timestamp.fromDate(new Date(invoiceDate)),
                        customerName: currentCustomerName,
                        paymentSystem
                    }}
                    items={items}
                    subtotal={subtotal}
                    discount={discount}
                    tax={tax}
                    total={total}
                />
            </div>
        </div>
      </div>
    </div>
  );
};

export default CreateInvoice;
