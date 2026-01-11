
import React, { useState } from 'react';
import { auth, googleProvider } from '../firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup
} from 'firebase/auth';
import { Mail, Lock, Chrome, AlertCircle } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { Logo } from '../components/Logo';
import { useLanguage } from '../context/LanguageContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  const { error, success } = useToast();
  const { t, isRTL } = useLanguage();

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
        success('Account created successfully!');
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        success(t('welcomeBack'));
      }
    } catch (err: any) {
      error(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      success('Signed in with Google');
    } catch (err: any) {
      error(err.message || 'Google sign in failed');
    }
  };

  return (
    <div className={`min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center p-4 ${isRTL ? 'text-right' : 'text-left'}`}>
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="h-16 w-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 mx-auto mb-6">
            <Logo className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{t('welcomeBack')}</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">{t('manageBusiness')}</p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700">
          <form onSubmit={handleEmailAuth} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">{t('emailLabel')}</label>
              <div className="relative">
                <Mail className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-primary`} size={20} />
                <input
                  type="email"
                  required
                  placeholder={t('enterEmail')}
                  className={`input-primary ${isRTL ? 'pr-12' : 'pl-12'}`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">{t('passwordLabel')}</label>
              <div className="relative">
                <Lock className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-primary`} size={20} />
                <input
                  type="password"
                  required
                  placeholder={t('enterPassword')}
                  className={`input-primary ${isRTL ? 'pr-12' : 'pl-12'}`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-primary text-white py-4 rounded-xl font-bold shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all flex items-center justify-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>{isRegistering ? t('createAccount') : t('signIn')}</>
              )}
            </button>
          </form>

          <div className="mt-8 relative text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
            </div>
            <span className="relative bg-white dark:bg-slate-800 px-4 text-sm text-slate-400 font-medium">OR</span>
          </div>

          <button
            onClick={handleGoogleSignIn}
            className={`w-full mt-8 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-white py-4 rounded-xl font-bold hover:bg-slate-50 dark:hover:bg-slate-600 transition-all flex items-center justify-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <Chrome size={20} className="text-primary" />
            {t('continueGoogle')}
          </button>

          <p className="mt-8 text-center text-slate-600 dark:text-slate-400 font-medium">
            {isRegistering ? t('hasAccount') : t('noAccount')}{' '}
            <button
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-primary font-bold hover:underline"
            >
              {isRegistering ? t('signIn') : t('createAccount')}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
