
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sun, 
  Moon,
  Briefcase, 
  Printer, 
  Shield, 
  FileText, 
  Lock, 
  Share2, 
  ChevronRight,
  MoreVertical,
  X,
  Check
} from 'lucide-react';
import { useUser } from '../App';
import { updateCompany } from '../services/database';
import { useToast } from '../context/ToastContext';
import { Company } from '../types';

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { user, company, refreshCompany } = useUser();
  const { success, error, info } = useToast();
  
  // Theme State
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
  });

  // Modal States
  const [activeModal, setActiveModal] = useState<'none' | 'template' | 'terms' | 'privacy' | 'security'>('none');
  const [selectedTemplate, setSelectedTemplate] = useState<string>(company?.templateId || 'standard');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    success(`Theme changed to ${newTheme} mode`);
  };

  const handleSaveTemplate = async () => {
    if (!user || !company?.id) return;
    try {
      await updateCompany(user.uid, company.id, { templateId: selectedTemplate as any });
      await refreshCompany();
      success('Invoice template updated successfully');
      setActiveModal('none');
    } catch (err) {
      error('Failed to update template');
    }
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
          : 'border-slate-200 hover:border-primary/50'
      }`}
    >
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-bold text-slate-800">{name}</h4>
        {selectedTemplate === id && <Check className="text-primary" size={20} />}
      </div>
      <p className="text-sm text-slate-500">{desc}</p>
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
          onClick={toggleTheme}
          className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-primary/30 dark:border-slate-600 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-4">
            {theme === 'light' ? <Sun size={32} className="text-slate-800 dark:text-white" /> : <Moon size={32} className="text-slate-800 dark:text-white" />}
            <div>
              <h3 className="text-base font-medium text-slate-800 dark:text-white">App Theme</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">{theme === 'light' ? 'Light Mode' : 'Dark Mode'}</p>
            </div>
          </div>
          <div className={`w-12 h-6 rounded-full p-1 transition-colors ${theme === 'dark' ? 'bg-primary' : 'bg-slate-300'}`}>
            <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${theme === 'dark' ? 'translate-x-6' : 'translate-x-0'}`} />
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
          onClick={() => setActiveModal('template')}
        >
          <div className="flex items-center gap-4">
            <Printer size={32} className="text-slate-800 dark:text-white" />
            <div>
              <h3 className="text-base font-medium text-slate-800 dark:text-white">Invoice Settings</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Change invoice template design</p>
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
            <p className="text-slate-400 text-sm">App Version: 2.1.0 (Build 542)</p>
        </div>
      </div>

      {/* Modals */}
      {activeModal !== 'none' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setActiveModal('none')}>
          <div className="bg-white dark:bg-slate-800 w-full max-w-lg rounded-3xl shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white capitalize">
                {activeModal === 'template' ? 'Select Template' : activeModal}
              </h2>
              <button onClick={() => setActiveModal('none')} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full">
                <X size={20} className="text-slate-500" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              {activeModal === 'template' && (
                <div className="space-y-4">
                  <TemplateOption id="standard" name="Standard" desc="Clean, professional, and balanced." />
                  <TemplateOption id="minimal" name="Minimalist" desc="Simple, ink-saving, black and white." />
                  <TemplateOption id="modern" name="Modern Bold" desc="Colorful headers and modern typography." />
                  <button 
                    onClick={handleSaveTemplate}
                    className="w-full mt-4 bg-primary text-white py-3 rounded-xl font-bold shadow-lg hover:bg-primary/90"
                  >
                    Save Changes
                  </button>
                </div>
              )}

              {activeModal === 'terms' && (
                <div className="prose prose-sm dark:prose-invert">
                  <p><strong>Terms of Service</strong></p>
                  <p>By using Receipt Book, you agree to these terms. This app is provided "as is" without warranties of any kind.</p>
                  <p>1. Usage: You agree to use this app for lawful invoicing purposes.</p>
                  <p>2. Data: Your data is stored securely on Google Firebase.</p>
                  <p>3. Liability: We are not liable for any financial losses incurred.</p>
                </div>
              )}

              {activeModal === 'privacy' && (
                 <div className="prose prose-sm dark:prose-invert">
                  <p><strong>Privacy Policy</strong></p>
                  <p>We respect your privacy. Here is how we handle your data:</p>
                  <p>- We collect your email and business details to generate invoices.</p>
                  <p>- We do not sell your data to third parties.</p>
                  <p>- You can request data deletion at any time.</p>
                </div>
              )}

              {activeModal === 'security' && (
                 <div className="prose prose-sm dark:prose-invert">
                  <p><strong>Security Information</strong></p>
                  <p>Your connection is secured with SSL encryption.</p>
                  <p>Authentication is handled by Google Firebase Auth, an industry standard.</p>
                  <p>Database rules ensure only you can access your company's data.</p>
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
