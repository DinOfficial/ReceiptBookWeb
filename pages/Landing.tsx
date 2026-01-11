
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../App';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  Smartphone, 
  Cloud, 
  ShieldCheck, 
  BarChart3, 
  ArrowRight,
  Download,
  Play,
  Apple,
  Menu,
  X,
  Receipt,
  Sun,
  Moon,
  Globe
} from 'lucide-react';
import { Logo } from '../components/Logo';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { Language } from '../utils/translations';

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const { user, company } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t, isRTL } = useLanguage();

  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    initial: {},
    whileInView: { transition: { staggerChildren: 0.1 } }
  };

  const toggleLang = () => {
    const langs: Language[] = ['en', 'bn', 'ar'];
    const nextIdx = (langs.indexOf(language) + 1) % langs.length;
    setLanguage(langs[nextIdx]);
  };

  return (
    <div className={`min-h-screen bg-white dark:bg-slate-900 overflow-x-hidden transition-colors ${isRTL ? 'text-right' : 'text-left'}`}>
      {/* Navigation */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        className="fixed top-0 left-0 right-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg z-50 border-b border-slate-100 dark:border-slate-800"
      >
        <div className={`max-w-7xl mx-auto px-6 h-20 flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="h-10 w-10 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <Logo className="text-white" size={24} />
            </div>
            <span className="text-xl font-extrabold text-slate-800 dark:text-white tracking-tight hidden sm:block">{t('companyName')}</span>
          </div>
          
          <div className={`hidden md:flex items-center gap-8 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <a href="#features" className="text-slate-600 dark:text-slate-300 font-medium hover:text-primary transition-colors">{t('features')}</a>
            <a href="#growth" className="text-slate-600 dark:text-slate-300 font-medium hover:text-primary transition-colors">{t('growth')}</a>
            <a href="#mobile" className="text-slate-600 dark:text-slate-300 font-medium hover:text-primary transition-colors">{t('mobile')}</a>
          </div>

          <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            {/* Lang & Theme */}
            <button onClick={toggleLang} className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full flex items-center gap-1">
                <Globe size={20} />
                <span className="text-xs font-bold uppercase">{language}</span>
            </button>
            <button onClick={toggleTheme} className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full">
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {user ? (
               <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className={`hidden md:flex flex-col ${isRTL ? 'text-left' : 'text-right'}`}>
                    <span className="text-sm font-bold text-slate-800 dark:text-white">{company?.name || user.email}</span>
                    <span className="text-xs text-primary font-medium">{t('proPlan')}</span>
                  </div>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/dashboard')}
                    className={`bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 py-2.5 rounded-full font-bold shadow-lg hover:bg-slate-800 dark:hover:bg-slate-200 transition-all flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
                  >
                    {t('dashboard')}
                    <ArrowRight size={16} className={isRTL ? 'rotate-180' : ''} />
                  </motion.button>
               </div>
            ) : (
              <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <button onClick={() => navigate('/login')} className="hidden md:block text-slate-600 dark:text-slate-300 font-bold hover:text-primary">{t('login')}</button>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/login')}
                  className="bg-primary text-white px-6 py-2.5 rounded-full font-bold shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all"
                >
                  {t('getStarted')}
                </motion.button>
              </div>
            )}
            <button className="md:hidden text-slate-600 dark:text-slate-300" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 px-6 py-4 space-y-4"
          >
            <a href="#features" className="block text-slate-600 dark:text-slate-300 font-medium" onClick={() => setMobileMenuOpen(false)}>{t('features')}</a>
            <a href="#growth" className="block text-slate-600 dark:text-slate-300 font-medium" onClick={() => setMobileMenuOpen(false)}>{t('growth')}</a>
            <a href="#mobile" className="block text-slate-600 dark:text-slate-300 font-medium" onClick={() => setMobileMenuOpen(false)}>{t('mobile')}</a>
            {!user && (
               <button onClick={() => navigate('/login')} className="block w-full text-left text-primary font-bold">{t('login')}</button>
            )}
          </motion.div>
        )}
      </motion.nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        {/* Abstract Background Blobs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/50 dark:bg-blue-900/20 rounded-full blur-3xl -z-10 animate-float" style={{ animationDuration: '10s' }} />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-100/50 dark:bg-purple-900/20 rounded-full blur-3xl -z-10 animate-float" style={{ animationDuration: '15s' }} />

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8 text-center lg:text-left z-10"
          >
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm rounded-full text-sm font-bold text-slate-600 dark:text-slate-300"
            >
              <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
              v2.0 is now live
            </motion.div>
            
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white leading-[1.1] tracking-tight">
               {t('heroTitle')}
            </h1>
            
            <p className="text-xl text-slate-500 dark:text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              {t('heroSubtitle')}
            </p>
            
            <div className={`flex flex-col sm:flex-row gap-4 justify-center lg:justify-start ${isRTL ? 'lg:flex-row-reverse' : ''}`}>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/login')}
                className={`px-8 py-4 bg-primary text-white rounded-2xl font-bold text-lg shadow-xl shadow-primary/30 hover:bg-primary/90 transition-all flex items-center justify-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
              >
                {t('startFree')}
                <ArrowRight size={20} className={isRTL ? 'rotate-180' : ''} />
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-8 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-white rounded-2xl font-bold text-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
              >
                <Play size={20} className="fill-slate-700 dark:fill-white" />
                {t('demoVideo')}
              </motion.button>
            </div>
          </motion.div>
          
          {/* Hero Visual */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, type: 'spring' }}
            className="relative mx-auto w-full max-w-[500px] lg:max-w-none"
          >
            <div className="relative z-10 bg-white dark:bg-slate-800 rounded-3xl shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700 p-2 overflow-hidden">
               <img 
                 src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=1000" 
                 alt="Dashboard Preview" 
                 className="rounded-2xl w-full object-cover"
               />
               
               {/* Floating Badge 1 */}
               <motion.div 
                 animate={{ y: [0, -10, 0] }}
                 transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                 className="absolute -left-6 top-10 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 hidden md:flex items-center gap-3"
               >
                 <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="text-green-600" size={20} />
                 </div>
                 <div>
                    <div className="text-xs text-slate-400 font-bold uppercase">Payment Received</div>
                    <div className="text-lg font-bold text-slate-800 dark:text-white">$1,250.00</div>
                 </div>
               </motion.div>

               {/* Floating Badge 2 */}
               <motion.div 
                 animate={{ y: [0, 10, 0] }}
                 transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                 className="absolute -right-6 bottom-20 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 hidden md:flex items-center gap-3"
               >
                 <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Smartphone className="text-primary" size={20} />
                 </div>
                 <div>
                    <div className="text-xs text-slate-400 font-bold uppercase">Mobile Sync</div>
                    <div className="text-sm font-bold text-slate-800 dark:text-white">Active</div>
                 </div>
               </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Designed for Growth Section */}
      <section id="growth" className="py-24 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
             <motion.div 
               {...fadeInUp}
               className="order-2 lg:order-1 relative"
             >
                <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl shadow-blue-900/10">
                   <img 
                    src="https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=800"
                    alt="Growth"
                    className="w-full object-cover h-[600px]"
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                      <div className="text-white">
                        <p className="font-bold text-lg">"This app transformed how we handle billing."</p>
                        <p className="text-sm opacity-80 mt-2">— Sarah J., Freelance Designer</p>
                      </div>
                   </div>
                </div>
                {/* Decorative Pattern */}
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-slate-100 dark:bg-slate-800 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
             </motion.div>

             <motion.div 
               {...fadeInUp}
               className="order-1 lg:order-2 space-y-8"
             >
                <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white leading-tight">Designed for <span className="text-primary">{t('growth')}</span></h2>
                <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed">
                  Scale your operations without the headache. Whether you're a freelancer or a growing agency, we provide the tools you need to look professional and get paid faster.
                </p>

                <motion.div 
                  variants={staggerContainer}
                  initial="initial"
                  whileInView="whileInView"
                  className="space-y-4"
                >
                  {[
                    "Unlimited Invoices & Customers",
                    "PDF Generation & Printing",
                    "Company Branding & Logo Support",
                    "Inventory & Item Catalog",
                    "Mobile Friendly Interface"
                  ].map((feature, idx) => (
                    <motion.div 
                      key={idx}
                      variants={fadeInUp}
                      className="flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-default group"
                    >
                      <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        <CheckCircle2 size={18} className="text-green-600" />
                      </div>
                      <span className="font-bold text-slate-700 dark:text-slate-200 text-lg">{feature}</span>
                    </motion.div>
                  ))}
                </motion.div>
             </motion.div>
          </div>
        </div>
      </section>

       {/* Footer */}
      <footer className="py-12 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
        <div className={`max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
             <div className="h-8 w-8 bg-slate-900 dark:bg-white rounded-lg flex items-center justify-center">
              <Logo className="text-white dark:text-slate-900" size={18} />
            </div>
            <span className="font-bold text-slate-800 dark:text-white">{t('companyName')}</span>
          </div>
          <p className="text-slate-400 text-sm">© 2024 Receipt Book Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
