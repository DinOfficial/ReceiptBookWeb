
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sun, 
  Briefcase, 
  Printer, 
  Shield, 
  FileText, 
  Lock, 
  Share2, 
  ChevronRight,
  MoreVertical
} from 'lucide-react';
import { useUser } from '../App';

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { company } = useUser();

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Receipt Book',
          text: 'Check out Receipt Book app for managing invoices!',
          url: window.location.origin,
        });
      } catch (error) {
        console.log('Error sharing', error);
      }
    } else {
      alert('Share not supported on this browser');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20">
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Settings</h1>
      </div>

      <div className="space-y-5">
        {/* App Theme */}
        <div className="bg-white p-4 rounded-2xl border border-primary/30 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer"
             onClick={() => alert("Theme switching coming soon!")}>
          <div className="flex items-center gap-4">
            <Sun size={32} className="text-slate-800" />
            <div>
              <h3 className="text-base font-medium text-slate-800">App Theme</h3>
              <p className="text-sm text-slate-500">Light Mode</p>
            </div>
          </div>
          <MoreVertical size={28} className="text-slate-400" />
        </div>

        {/* Business Info */}
        <div className="bg-white p-4 rounded-2xl border border-primary/30 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer"
             onClick={() => navigate('/setup')}>
          <div className="flex items-center gap-4">
            <Briefcase size={32} className="text-slate-800" />
            <div>
              <h3 className="text-base font-medium text-slate-800">Business Information</h3>
              <p className="text-sm text-slate-500">Update | complete your company information</p>
            </div>
          </div>
          <ChevronRight className="text-slate-400" />
        </div>

        {/* Invoice Settings */}
        <div className="bg-white p-4 rounded-2xl border border-primary/30 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer">
          <div className="flex items-center gap-4">
            <Printer size={32} className="text-slate-800" />
            <div>
              <h3 className="text-base font-medium text-slate-800">Invoice Settings</h3>
              <p className="text-sm text-slate-500">Choose your invoice template</p>
            </div>
          </div>
          <ChevronRight className="text-slate-400" />
        </div>

        {/* App & Security */}
        <div className="bg-white p-4 rounded-2xl border border-primary/30 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer">
          <div className="flex items-center gap-4">
            <Shield size={32} className="text-slate-800" />
            <div>
              <h3 className="text-base font-medium text-slate-800">App & Security</h3>
              <p className="text-sm text-slate-500">Terms, Conditions & Privacy</p>
            </div>
          </div>
          <ChevronRight className="text-slate-400" />
        </div>

        {/* Terms */}
        <div className="bg-white p-4 rounded-2xl border border-primary/30 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer">
          <div className="flex items-center gap-4">
            <FileText size={32} className="text-slate-800" />
            <div>
              <h3 className="text-base font-medium text-slate-800">Terms & Conditions</h3>
              <p className="text-sm text-slate-500">Read our terms</p>
            </div>
          </div>
          <ChevronRight className="text-slate-400" />
        </div>

        {/* Data Privacy */}
        <div className="bg-white p-4 rounded-2xl border border-primary/30 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer">
          <div className="flex items-center gap-4">
            <Lock size={32} className="text-slate-800" />
            <div>
              <h3 className="text-base font-medium text-slate-800">Data Privacy</h3>
              <p className="text-sm text-slate-500">How we use your data</p>
            </div>
          </div>
          <ChevronRight className="text-slate-400" />
        </div>

        {/* Share */}
        <div className="bg-white p-4 rounded-2xl border border-primary/30 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer"
             onClick={handleShare}>
          <div className="flex items-center gap-4">
            <Share2 size={32} className="text-slate-800" />
            <div>
              <h3 className="text-base font-medium text-slate-800">Share this app</h3>
              <p className="text-sm text-slate-500">If you enjoy it share with your friends</p>
            </div>
          </div>
          <ChevronRight className="text-slate-400" />
        </div>

        <div className="pt-8 text-center">
            <p className="text-slate-400 text-sm">App Version: 1.1.1</p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
