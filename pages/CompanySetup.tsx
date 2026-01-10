
import React, { useState } from 'react';
import { useUser } from '../App';
import { createCompany } from '../services/database';
import { uploadToImgBB } from '../services/imgbb';
import { useNavigate } from 'react-router-dom';
import { Building2, Mail, Phone, MapPin, Upload, ChevronRight, PlusCircle } from 'lucide-react';

const CompanySetup: React.FC = () => {
  const { user, refreshCompany } = useUser();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    try {
      let photo = '';
      if (logoFile) {
        photo = await uploadToImgBB(logoFile);
      }

      await createCompany({
        ...formData,
        photo,
        ownerUid: user.uid,
      });

      await refreshCompany();
      navigate('/');
    } catch (err) {
      console.error(err);
      alert('Failed to save company profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row">
        <div className="md:w-1/3 bg-primary p-8 text-white flex flex-col justify-center">
          <Building2 size={48} className="mb-4" />
          <h1 className="text-2xl font-bold mb-2">Company Setup</h1>
          <p className="text-primary-foreground/80 text-sm leading-relaxed">
            Welcome! Just a few details about your business to get started with professional invoices.
          </p>
        </div>

        <div className="md:w-2/3 p-8 lg:p-12">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-center mb-8">
              <label className="relative cursor-pointer group">
                <div className="w-24 h-24 rounded-2xl bg-slate-100 border-2 border-dashed border-primary/30 flex items-center justify-center overflow-hidden transition-all group-hover:border-primary">
                  {logoPreview ? (
                    <img src={logoPreview} alt="Logo Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center text-slate-400">
                      <Upload size={24} className="mx-auto mb-1" />
                      <span className="text-[10px] font-bold uppercase">Logo</span>
                    </div>
                  )}
                </div>
                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                <div className="absolute -bottom-2 -right-2 bg-primary text-white p-1.5 rounded-lg shadow-lg">
                  <PlusCircle size={14} />
                </div>
              </label>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Company Name</label>
                <div className="relative">
                  <Building2 size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" />
                  <input
                    type="text"
                    required
                    placeholder="E.g. Acme Corp"
                    className="input-primary pl-11"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" />
                    <input
                      type="email"
                      required
                      placeholder="billing@acme.com"
                      className="input-primary pl-11 text-sm"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Phone</label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" />
                    <input
                      type="tel"
                      required
                      placeholder="+1 234 567"
                      className="input-primary pl-11 text-sm"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Address</label>
                <div className="relative">
                  <MapPin size={16} className="absolute left-4 top-4 text-primary" />
                  <textarea
                    required
                    placeholder="123 Business St, Suite 100..."
                    className="input-primary pl-11 h-24 resize-none pt-3"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-4 rounded-xl font-bold shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all flex items-center justify-center gap-2 mt-4"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  Complete Setup <ChevronRight size={20} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CompanySetup;
