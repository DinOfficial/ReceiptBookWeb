
import React, { useEffect, useState } from 'react';
import { useUser } from '../App';
import { getCustomers, createCustomer, updateCustomer, deleteCustomer } from '../services/database';
import { Customer } from '../types';
import { 
  Users, 
  Mail, 
  Phone, 
  MapPin, 
  Plus, 
  Search,
  MoreHorizontal,
  PlusCircle,
  Trash2,
  Edit2
} from 'lucide-react';

const CustomerList: React.FC = () => {
  const { user } = useUser();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  const loadCustomers = async () => {
    if (user) {
      const data = await getCustomers(user.uid);
      setCustomers(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadCustomers();
  }, [user]);

  const openAddModal = () => {
    setFormData({ name: '', email: '', phone: '', address: '' });
    setIsEditing(false);
    setShowModal(true);
  };

  const openEditModal = (customer: Customer) => {
    setFormData({
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address
    });
    setCurrentId(customer.id!);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      if (isEditing && currentId) {
        await updateCustomer(user.uid, currentId, formData);
      } else {
        await createCustomer({ ...formData, ownerUid: user.uid });
      }
      setShowModal(false);
      await loadCustomers();
    } catch (err) {
      alert('Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (customerId: string) => {
    if (!user) return;
    if (confirm('Are you sure? This will delete the customer. Invoices must be deleted separately (safety feature).')) {
        await deleteCustomer(user.uid, customerId);
        await loadCustomers();
    }
  };

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && customers.length === 0) return <div>Loading customers...</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Customers</h1>
          <p className="text-slate-500">Manage your business contacts and client relationships.</p>
        </div>
        <button 
          onClick={openAddModal}
          className="bg-primary text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-primary/90 shadow-lg shadow-primary/25 transition-all"
        >
          <PlusCircle size={20} />
          Add Customer
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input
          type="text"
          placeholder="Search by name or email..."
          className="input-primary pl-12"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCustomers.map((customer) => (
          <div key={customer.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-primary/30 transition-all group relative">
            
            {/* Actions */}
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => openEditModal(customer)}
                  className="p-2 bg-slate-100 rounded-full hover:bg-primary hover:text-white transition-colors">
                    <Edit2 size={16} />
                </button>
                <button 
                  onClick={() => handleDelete(customer.id!)}
                  className="p-2 bg-red-50 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-colors">
                    <Trash2 size={16} />
                </button>
            </div>

            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center text-primary text-xl font-bold">
                {customer.name.charAt(0)}
              </div>
            </div>
            
            <h3 className="font-bold text-lg text-slate-800 mb-1">{customer.name}</h3>
            <div className="space-y-2 mt-4">
              <div className="flex items-center gap-3 text-slate-500 text-sm">
                <Mail size={16} className="text-primary" />
                <span className="truncate">{customer.email}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-500 text-sm">
                <Phone size={16} className="text-primary" />
                <span>{customer.phone || 'No phone'}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-500 text-sm">
                <MapPin size={16} className="text-primary" />
                <span className="truncate">{customer.address || 'No address'}</span>
              </div>
            </div>
          </div>
        ))}
        
        {filteredCustomers.length === 0 && (
          <div className="col-span-full py-20 text-center text-slate-400 bg-white rounded-2xl border border-dashed border-slate-200">
            <Users size={48} className="mx-auto mb-4 opacity-20" />
            <p>No customers found.</p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl relative z-10 overflow-hidden">
            <div className="bg-primary p-6 text-white">
              <h2 className="text-xl font-bold">{isEditing ? 'Edit Customer' : 'New Customer'}</h2>
              <p className="text-primary-foreground/70 text-sm">Enter client details below.</p>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <input
                required
                placeholder="Full Name"
                className="input-primary"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
              <input
                required
                type="email"
                placeholder="Email Address"
                className="input-primary"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
              <input
                placeholder="Phone Number"
                className="input-primary"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
              <textarea
                placeholder="Address"
                className="input-primary h-24 resize-none"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
              />
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20"
                >
                  Save Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerList;
