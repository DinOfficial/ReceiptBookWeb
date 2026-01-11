
import React, { useState, useEffect } from 'react';
import { useUser } from '../App';
import { createCompany, updateCompany } from '../services/database';
import { uploadToImgBB } from '../services/imgbb';
import { useNavigate } from 'react-router-dom';
import { Building2, Mail, Phone, MapPin, Upload, ChevronRight, PlusCircle, ArrowLeft } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { Logo } from '../components/Logo';
import { useLanguage } from '../context/LanguageContext';

const CompanySetup: React.FC = () => {
  const { user, company, refreshCompany } = useUser();
  const navigate = useNavigate();
  const { success, error } = useToast();
  const { t, isRTL } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  // Pre-fill data if company exists (Edit Mode)
  useEffect(() => {
    if (company) {
      setFormData({
        name: company.name,
        email: company.email,
        phone: company.phone,
        address: company.address,
      });
      if (company.photo) {
        setLogoPreview(company.photo);
      }
    }
  }, [company]);

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
      let photo = company?.photo || '';
      if (logoFile) {
        photo = await uploadToImgBB(logoFile);
      }

      if (company?.id) {
        // Update existing
        await updateCompany(user.uid, company.id, {
          ...formData,
          photo,
        });
        success('Company profile updated!');
        navigate('/settings');
      } else {
        // Create new
        await createCompany({
          ...formData,
          photo,
          ownerUid: user.uid,
          currency: '$',
          paymentMethods: ['Cash', 'Card', 'Bank Transfer'],
          templateId: 'standard'
        });
        success('Welcome! Company profile setup complete.');
        navigate('/dashboard');
      }

      await refreshCompany();
    } catch (err) {
      console.error(err);
      error('Failed to save company profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-6 ${isRTL ? 'text-right' : 'text-left'}`}>
      <div className={`max-w-2xl w-full bg-white dark:bg-slate-800 rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row relative ${isRTL ? 'md:flex-row-reverse' : ''}`}>
        {company && (
          <button 
            onClick={() => navigate('/settings')}
            className={`absolute top-4 ${isRTL ? 'right-4' : 'left-4'} z-10 p-2 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full text-white transition-colors`}
          >
            <ArrowLeft size={20} className={isRTL ? 'rotate-180' : ''} />
          </button>
        )}
        
        <div className="md:w-1/3 bg-primary p-8 text-white flex flex-col justify-center">
          <Logo className="text-white mb-4" size={48} />
          <h1 className="text-2xl font-bold mb-2">{company ? t('editProfile') : t('companySetup')}</h1>
          <p className="text-primary-foreground/80 text-sm leading-relaxed">
            {company ? t('setupDescEdit') : t('setupDescNew')}
          </p>
        </div>

        <div className="md:w-2/3 p-8 lg:p-12">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-center mb-8">
              <label className="relative cursor-pointer group">
                <div className="w-24 h-24 rounded-2xl bg-slate-100 dark:bg-slate-700 border-2 border-dashed border-primary/30 flex items-center justify-center overflow-hidden transition-all group-hover:border-primary">
                  {logoPreview ? (
                    <img src={logoPreview} alt="Logo Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center text-slate-400">
                      <Upload size={24} className="mx-auto mb-1" />
                      <span className="text-[10px] font-bold uppercase">{t('logo')}</span>
                    </div>
                  )}
                </div>
                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                <div className={`absolute -bottom-2 ${isRTL ? '-left-2' : '-right-2'} bg-primary text-white p-1.5 rounded-lg shadow-lg`}>
                  <PlusCircle size={14} />
                </div>
              </label>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('companyName')}</label>
                <div className="relative">
                  <Building2 size={16} className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-primary`} />
                  <input
                    type="text"
                    required
                    placeholder="E.g. Acme Corp"
                    className={`input-primary ${isRTL ? 'pr-11' : 'pl-11'}`}
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('emailLabel')}</label>
                  <div className="relative">
                    <Mail size={16} className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-primary`} />
                    <input
                      type="email"
                      required
                      placeholder="billing@acme.com"
                      className={`input-primary ${isRTL ? 'pr-11' : 'pl-11'} text-sm`}
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('phone')}</label>
                  <div className="relative">
                    <Phone size={16} className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-primary`} />
                    <input
                      type="tel"
                      required
                      placeholder="+1 234 567"
                      className={`input-primary ${isRTL ? 'pr-11' : 'pl-11'} text-sm`}
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('address')}</label>
                <div className="relative">
                  <MapPin size={16} className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-4 text-primary`} />
                  <textarea
                    required
                    placeholder="123 Business St, Suite 100..."
                    className={`input-primary ${isRTL ? 'pr-11' : 'pl-11'} h-24 resize-none pt-3`}
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-primary text-white py-4 rounded-xl font-bold shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all flex items-center justify-center gap-2 mt-4 ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  {company ? t('updateProfile') : t('completeSetup')} <ChevronRight size={20} className={isRTL ? 'rotate-180' : ''} />
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
