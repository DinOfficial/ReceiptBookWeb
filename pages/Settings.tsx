
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sun, 
  Moon,
  Monitor,
  Briefcase, 
  Printer, 
  Shield, 
  FileText, 
  Lock, 
  Share2, 
  ChevronRight,
  CreditCard,
  X,
  Check,
  Plus,
  Trash2,
  DollarSign
} from 'lucide-react';
import { useUser } from '../App';
import { updateCompany } from '../services/database';
import { useToast } from '../context/ToastContext';

type ThemeMode = 'light' | 'dark' | 'system';

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { user, company, refreshCompany } = useUser();
  const { success, error, info } = useToast();
  
  // Theme State
  const [theme, setTheme] = useState<ThemeMode>(() => {
    return (localStorage.getItem('theme') as ThemeMode) || 'system';
  });

  // Modal States
  const [activeModal, setActiveModal] = useState<'none' | 'invoice' | 'terms' | 'privacy' | 'security'>('none');
  
  // Invoice Settings State
  const [selectedTemplate, setSelectedTemplate] = useState<string>(company?.templateId || 'standard');
  const [currency, setCurrency] = useState<string>(company?.currency || '$');
  const [paymentMethods, setPaymentMethods] = useState<string[]>(company?.paymentMethods || ['Cash', 'Card']);
  const [newPaymentMethod, setNewPaymentMethod] = useState('');

  // Apply Theme
  useEffect(() => {
    const root = document.documentElement;
    const apply = (t: ThemeMode) => {
      if (t === 'dark') root.classList.add('dark');
      else if (t === 'light') root.classList.remove('dark');
      else {
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) root.classList.add('dark');
        else root.classList.remove('dark');
      }
    };
    apply(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Sync state with company data when it loads
  useEffect(() => {
    if (company) {
      setSelectedTemplate(company.templateId || 'standard');
      setCurrency(company.currency || '$');
      setPaymentMethods(company.paymentMethods || ['Cash', 'Card']);
    }
  }, [company]);

  const cycleTheme = () => {
    const modes: ThemeMode[] = ['light', 'dark', 'system'];
    const nextIndex = (modes.indexOf(theme) + 1) % modes.length;
    setTheme(modes[nextIndex]);
    success(`Theme changed to ${modes[nextIndex]}`);
  };

  const handleSaveInvoiceSettings = async () => {
    if (!user || !company?.id) return;
    try {
      await updateCompany(user.uid, company.id, { 
        templateId: selectedTemplate as any,
        currency,
        paymentMethods
      });
      await refreshCompany();
      success('Invoice settings updated successfully');
      setActiveModal('none');
    } catch (err) {
      error('Failed to update settings');
    }
  };

  const addPaymentMethod = () => {
    if (newPaymentMethod.trim() && !paymentMethods.includes(newPaymentMethod.trim())) {
      setPaymentMethods([...paymentMethods, newPaymentMethod.trim()]);
      setNewPaymentMethod('');
    }
  };

  const removePaymentMethod = (method: string) => {
    setPaymentMethods(paymentMethods.filter(m => m !== method));
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Receipt Book',
          text: 'Check out Receipt Book app for managing invoices!',
          url: window.location.origin,
        });
      } catch (err) {
        console.log('Error sharing', err);
      }
    } else {
      await navigator.clipboard.writeText(window.location.origin);
      info('Link copied to clipboard!');
    }
  };

  const TemplateOption = ({ id, name, desc }: { id: string, name: string, desc: string }) => (
    <div 
      onClick={() => setSelectedTemplate(id)}
      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
        selectedTemplate === id 
          ? 'border-primary bg-primary/5' 
          : 'border-slate-200 dark:border-slate-700 hover:border-primary/50'
      }`}
    >
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-bold text-slate-800 dark:text-white">{name}</h4>
        {selectedTemplate === id && <Check className="text-primary" size={20} />}
      </div>
      <p className="text-sm text-slate-500 dark:text-slate-400">{desc}</p>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20">
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Settings</h1>
      </div>

      <div className="space-y-5">
        {/* App Theme */}
        <div 
          onClick={cycleTheme}
          className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-primary/30 dark:border-slate-600 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-4">
            {theme === 'light' && <Sun size={32} className="text-slate-800 dark:text-white" />}
            {theme === 'dark' && <Moon size={32} className="text-slate-800 dark:text-white" />}
            {theme === 'system' && <Monitor size={32} className="text-slate-800 dark:text-white" />}
            <div>
              <h3 className="text-base font-medium text-slate-800 dark:text-white">App Theme</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 capitalize">{theme} Mode</p>
            </div>
          </div>
          <div className="bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-full text-xs font-bold text-slate-600 dark:text-slate-300">
            Tap to change
          </div>
        </div>

        {/* Business Info */}
        <div 
          className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-primary/30 dark:border-slate-600 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          onClick={() => navigate('/setup')}
        >
          <div className="flex items-center gap-4">
            <Briefcase size={32} className="text-slate-800 dark:text-white" />
            <div>
              <h3 className="text-base font-medium text-slate-800 dark:text-white">Business Information</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Update company profile & logo</p>
            </div>
          </div>
          <ChevronRight className="text-slate-400" />
        </div>

        {/* Invoice Settings */}
        <div 
          className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-primary/30 dark:border-slate-600 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          onClick={() => setActiveModal('invoice')}
        >
          <div className="flex items-center gap-4">
            <Printer size={32} className="text-slate-800 dark:text-white" />
            <div>
              <h3 className="text-base font-medium text-slate-800 dark:text-white">Invoice Configuration</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Templates, Currency, Payments</p>
            </div>
          </div>
          <ChevronRight className="text-slate-400" />
        </div>

        {/* App & Security */}
        <div 
          className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-primary/30 dark:border-slate-600 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          onClick={() => setActiveModal('security')}
        >
          <div className="flex items-center gap-4">
            <Shield size={32} className="text-slate-800 dark:text-white" />
            <div>
              <h3 className="text-base font-medium text-slate-800 dark:text-white">App & Security</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Security standards & info</p>
            </div>
          </div>
          <ChevronRight className="text-slate-400" />
        </div>

        {/* Terms */}
        <div 
          className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-primary/30 dark:border-slate-600 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          onClick={() => setActiveModal('terms')}
        >
          <div className="flex items-center gap-4">
            <FileText size={32} className="text-slate-800 dark:text-white" />
            <div>
              <h3 className="text-base font-medium text-slate-800 dark:text-white">Terms & Conditions</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Read our terms of service</p>
            </div>
          </div>
          <ChevronRight className="text-slate-400" />
        </div>

        {/* Data Privacy */}
        <div 
          className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-primary/30 dark:border-slate-600 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          onClick={() => setActiveModal('privacy')}
        >
          <div className="flex items-center gap-4">
            <Lock size={32} className="text-slate-800 dark:text-white" />
            <div>
              <h3 className="text-base font-medium text-slate-800 dark:text-white">Data Privacy</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">How we handle your data</p>
            </div>
          </div>
          <ChevronRight className="text-slate-400" />
        </div>

        {/* Share */}
        <div 
          className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-primary/30 dark:border-slate-600 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          onClick={handleShare}
        >
          <div className="flex items-center gap-4">
            <Share2 size={32} className="text-slate-800 dark:text-white" />
            <div>
              <h3 className="text-base font-medium text-slate-800 dark:text-white">Share this app</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Spread the word</p>
            </div>
          </div>
          <ChevronRight className="text-slate-400" />
        </div>
        
        <div className="pt-8 text-center">
            <p className="text-slate-400 text-sm">App Version: 2.2.0 (Build 545)</p>
        </div>
      </div>

      {/* Modals */}
      {activeModal !== 'none' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setActiveModal('none')}>
          <div className="bg-white dark:bg-slate-800 w-full max-w-lg rounded-3xl shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white capitalize">
                {activeModal === 'invoice' ? 'Invoice Configuration' : activeModal}
              </h2>
              <button onClick={() => setActiveModal('none')} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full">
                <X size={20} className="text-slate-500" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              {activeModal === 'invoice' && (
                <div className="space-y-6">
                  {/* Currency */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                       <DollarSign size={16} /> Currency Symbol
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {['$', '€', '£', '¥', '₹', 'Rp', 'R', 'د.إ'].map(curr => (
                        <button
                          key={curr}
                          onClick={() => setCurrency(curr)}
                          className={`py-2 rounded-lg font-bold border ${currency === curr ? 'bg-primary text-white border-primary' : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600'}`}
                        >
                          {curr}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Payment Methods */}
                  <div>
                     <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                        <CreditCard size={16} /> Payment Methods
                     </label>
                     <div className="flex gap-2 mb-3">
                        <input 
                          value={newPaymentMethod}
                          onChange={(e) => setNewPaymentMethod(e.target.value)}
                          placeholder="Add new (e.g. PayPal)"
                          className="input-primary py-2 text-sm"
                        />
                        <button onClick={addPaymentMethod} className="bg-primary text-white p-2 rounded-lg">
                          <Plus size={20} />
                        </button>
                     </div>
                     <div className="flex flex-wrap gap-2">
                        {paymentMethods.map(method => (
                          <div key={method} className="flex items-center gap-2 bg-slate-100 dark:bg-slate-700 px-3 py-1.5 rounded-lg">
                             <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{method}</span>
                             <button onClick={() => removePaymentMethod(method)} className="text-slate-400 hover:text-red-500">
                               <X size={14} />
                             </button>
                          </div>
                        ))}
                     </div>
                  </div>

                  {/* Templates */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                        <Printer size={16} /> Invoice Template
                    </label>
                    <div className="space-y-3">
                      <TemplateOption id="standard" name="Standard" desc="Clean, professional, and balanced." />
                      <TemplateOption id="minimal" name="Minimalist" desc="Simple, ink-saving, black and white." />
                      <TemplateOption id="modern" name="Modern Bold" desc="Colorful headers and modern typography." />
                      <TemplateOption id="classic" name="Classic Grid" desc="Structured grid layout with borders." />
                    </div>
                  </div>

                  <button 
                    onClick={handleSaveInvoiceSettings}
                    className="w-full mt-4 bg-primary text-white py-3 rounded-xl font-bold shadow-lg hover:bg-primary/90"
                  >
                    Save Configuration
                  </button>
                </div>
              )}

              {activeModal === 'terms' && (
                <div className="prose prose-sm dark:prose-invert">
                  <h3 className="text-lg font-bold mb-2">Terms of Service</h3>
                  <p className="text-xs text-slate-500 mb-4">Last Updated: March 2024</p>
                  
                  <p><strong>1. Acceptance of Terms</strong><br/>
                  By accessing and using Receipt Book ("the App"), you accept and agree to be bound by the terms and provision of this agreement.</p>
                  
                  <p><strong>2. Use License</strong><br/>
                  Permission is granted to temporarily download one copy of the materials (information or software) on Receipt Book for personal, non-commercial transitory viewing only.</p>
                  
                  <p><strong>3. Data & Content</strong><br/>
                  You retain all rights to the data you enter into the App. We do not claim ownership over your invoices or customer data.</p>
                  
                  <p><strong>4. Disclaimer</strong><br/>
                  The materials on Receipt Book are provided "as is". We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties.</p>
                  
                  <p><strong>5. Limitations</strong><br/>
                  In no event shall Receipt Book or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit) arising out of the use or inability to use the App.</p>
                </div>
              )}

              {activeModal === 'privacy' && (
                 <div className="prose prose-sm dark:prose-invert">
                  <h3 className="text-lg font-bold mb-2">Privacy Policy</h3>
                  <p className="text-xs text-slate-500 mb-4">Effective Date: March 2024</p>
                  
                  <p><strong>1. Information Collection</strong><br/>
                  We collect information you provide directly to us, such as when you create an account, create a customer, or generate an invoice. This includes names, emails, and transaction details.</p>
                  
                  <p><strong>2. Use of Information</strong><br/>
                  We use the information to operate, maintain, and provide the features of the App. We do not sell your personal data to third parties.</p>
                  
                  <p><strong>3. Data Security</strong><br/>
                  We implement security measures designed to protect your information from unauthorized access. Your data is stored on secure Google Firebase servers.</p>
                  
                  <p><strong>4. Your Rights</strong><br/>
                  You have the right to access, update, or delete your personal information at any time through the App settings.</p>
                </div>
              )}

              {activeModal === 'security' && (
                 <div className="prose prose-sm dark:prose-invert">
                  <h3 className="text-lg font-bold mb-2">Security Standards</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                       <Lock className="text-green-500 mt-1" size={20} />
                       <div>
                          <span className="font-bold block">End-to-End TLS</span>
                          <span className="text-slate-500">All data transmitted between your device and our servers is encrypted using standard Transport Layer Security (TLS).</span>
                       </div>
                    </div>
                    <div className="flex items-start gap-3">
                       <Shield className="text-blue-500 mt-1" size={20} />
                       <div>
                          <span className="font-bold block">Google Cloud Infrastructure</span>
                          <span className="text-slate-500">We rely on Google's world-class security infrastructure for data storage and authentication.</span>
                       </div>
                    </div>
                    <div className="flex items-start gap-3">
                       <CreditCard className="text-purple-500 mt-1" size={20} />
                       <div>
                          <span className="font-bold block">No Payment Data Storage</span>
                          <span className="text-slate-500">We do not store credit card numbers or sensitive payment details on our servers.</span>
                       </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
