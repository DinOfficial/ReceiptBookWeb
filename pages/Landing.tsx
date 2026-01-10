
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
  Receipt,
  Download,
  Play,
  Apple,
  Menu,
  X
} from 'lucide-react';

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const { user, company } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

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

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Navigation */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-lg z-50 border-b border-slate-100"
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <Receipt className="text-white" size={24} />
            </div>
            <span className="text-xl font-extrabold text-slate-800 tracking-tight hidden sm:block">Receipt Book</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-slate-600 font-medium hover:text-primary transition-colors">Features</a>
            <a href="#growth" className="text-slate-600 font-medium hover:text-primary transition-colors">Growth</a>
            <a href="#mobile" className="text-slate-600 font-medium hover:text-primary transition-colors">Mobile</a>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
               <div className="flex items-center gap-4">
                  <div className="hidden md:flex text-right flex-col">
                    <span className="text-sm font-bold text-slate-800">{company?.name || user.email}</span>
                    <span className="text-xs text-primary font-medium">Pro Plan</span>
                  </div>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/dashboard')}
                    className="bg-slate-900 text-white px-5 py-2.5 rounded-full font-bold shadow-lg hover:bg-slate-800 transition-all flex items-center gap-2"
                  >
                    Dashboard
                    <ArrowRight size={16} />
                  </motion.button>
               </div>
            ) : (
              <div className="flex items-center gap-3">
                <button onClick={() => navigate('/login')} className="hidden md:block text-slate-600 font-bold hover:text-primary">Log In</button>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/login')}
                  className="bg-primary text-white px-6 py-2.5 rounded-full font-bold shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all"
                >
                  Get Started
                </motion.button>
              </div>
            )}
            <button className="md:hidden text-slate-600" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="md:hidden bg-white border-b border-slate-100 px-6 py-4 space-y-4"
          >
            <a href="#features" className="block text-slate-600 font-medium" onClick={() => setMobileMenuOpen(false)}>Features</a>
            <a href="#growth" className="block text-slate-600 font-medium" onClick={() => setMobileMenuOpen(false)}>Growth</a>
            <a href="#mobile" className="block text-slate-600 font-medium" onClick={() => setMobileMenuOpen(false)}>Mobile</a>
            {!user && (
               <button onClick={() => navigate('/login')} className="block w-full text-left text-primary font-bold">Log In</button>
            )}
          </motion.div>
        )}
      </motion.nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        {/* Abstract Background Blobs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-3xl -z-10 animate-float" style={{ animationDuration: '10s' }} />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-100/50 rounded-full blur-3xl -z-10 animate-float" style={{ animationDuration: '15s' }} />

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8 text-center lg:text-left z-10"
          >
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-100 shadow-sm rounded-full text-sm font-bold text-slate-600"
            >
              <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
              v2.0 is now live
            </motion.div>
            
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-[1.1] tracking-tight">
              Invoicing <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">Reimagined.</span>
            </h1>
            
            <p className="text-xl text-slate-500 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Create professional invoices in seconds, track payments effortlessly, and manage your business on the go.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/login')}
                className="px-8 py-4 bg-primary text-white rounded-2xl font-bold text-lg shadow-xl shadow-primary/30 hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
              >
                Start for Free
                <ArrowRight size={20} />
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white border border-slate-200 text-slate-700 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
              >
                <Play size={20} className="fill-slate-700" />
                Demo Video
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
            <div className="relative z-10 bg-white rounded-3xl shadow-2xl shadow-slate-200/50 border border-slate-100 p-2 overflow-hidden">
               <img 
                 src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=1000" 
                 alt="Dashboard Preview" 
                 className="rounded-2xl w-full object-cover"
               />
               
               {/* Floating Badge 1 */}
               <motion.div 
                 animate={{ y: [0, -10, 0] }}
                 transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                 className="absolute -left-6 top-10 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 hidden md:flex items-center gap-3"
               >
                 <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="text-green-600" size={20} />
                 </div>
                 <div>
                    <div className="text-xs text-slate-400 font-bold uppercase">Payment Received</div>
                    <div className="text-lg font-bold text-slate-800">$1,250.00</div>
                 </div>
               </motion.div>

               {/* Floating Badge 2 */}
               <motion.div 
                 animate={{ y: [0, 10, 0] }}
                 transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                 className="absolute -right-6 bottom-20 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 hidden md:flex items-center gap-3"
               >
                 <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Smartphone className="text-primary" size={20} />
                 </div>
                 <div>
                    <div className="text-xs text-slate-400 font-bold uppercase">Mobile Sync</div>
                    <div className="text-sm font-bold text-slate-800">Active</div>
                 </div>
               </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Designed for Growth Section */}
      <section id="growth" className="py-24 bg-white">
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
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-slate-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
             </motion.div>

             <motion.div 
               {...fadeInUp}
               className="order-1 lg:order-2 space-y-8"
             >
                <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 leading-tight">Designed for <span className="text-primary">Growth</span></h2>
                <p className="text-lg text-slate-500 leading-relaxed">
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
                      className="flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors cursor-default group"
                    >
                      <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        <CheckCircle2 size={18} className="text-green-600" />
                      </div>
                      <span className="font-bold text-slate-700 text-lg">{feature}</span>
                    </motion.div>
                  ))}
                </motion.div>
             </motion.div>
          </div>
        </div>
      </section>

      {/* Mobile App Section */}
      <section id="mobile" className="py-24 bg-[#0B1120] text-white relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>

        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center relative z-10">
          <motion.div 
             {...fadeInUp}
             className="space-y-8"
          >
            <div className="inline-block px-4 py-1 rounded-full border border-blue-400/30 bg-blue-400/10 text-blue-300 font-bold text-sm">
              Available on iOS & Android
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight">
              Carry your business <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400">in your pocket.</span>
            </h2>
            <p className="text-lg text-slate-400 max-w-xl leading-relaxed">
              Stay connected to your business wherever you go. Our mobile app gives you the power to generate invoices, track payments, and manage clients right from your smartphone.
            </p>
            
            <div className="flex flex-wrap gap-4 pt-4">
              <button className="flex items-center gap-3 bg-white text-slate-900 px-6 py-3 rounded-xl font-bold hover:bg-slate-200 transition-colors">
                 <Apple size={24} />
                 <div className="text-left">
                    <div className="text-[10px] uppercase tracking-wider font-bold opacity-60">Download on the</div>
                    <div className="text-sm leading-none">App Store</div>
                 </div>
              </button>
              <button className="flex items-center gap-3 bg-transparent border border-white/20 text-white px-6 py-3 rounded-xl font-bold hover:bg-white/10 transition-colors">
                 <Play size={24} className="fill-white" />
                 <div className="text-left">
                    <div className="text-[10px] uppercase tracking-wider font-bold opacity-60">Get it on</div>
                    <div className="text-sm leading-none">Google Play</div>
                 </div>
              </button>
            </div>
          </motion.div>

          {/* CSS Mobile Mockup */}
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', damping: 20 }}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative w-[300px] h-[600px] bg-slate-900 rounded-[3rem] border-8 border-slate-800 shadow-2xl overflow-hidden">
               {/* Notch */}
               <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-800 rounded-b-xl z-20"></div>
               
               {/* Screen Content */}
               <div className="w-full h-full bg-slate-50 pt-10 px-4 pb-4 flex flex-col font-sans">
                  {/* App Header */}
                  <div className="flex justify-between items-center mb-6">
                     <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Menu size={16} className="text-primary" />
                     </div>
                     <div className="h-8 w-8 bg-slate-200 rounded-full overflow-hidden">
                        <img src={`https://ui-avatars.com/api/?name=${user?.email || 'User'}&background=random`} alt="User" />
                     </div>
                  </div>

                  {/* App Stats */}
                  <div className="space-y-4 mb-6">
                     <div className="bg-primary p-4 rounded-2xl text-white shadow-lg shadow-primary/30">
                        <div className="text-xs opacity-80 mb-1">Total Balance</div>
                        <div className="text-2xl font-bold">$12,450.00</div>
                        <div className="mt-4 flex gap-2">
                           <div className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
                              <div className="h-full w-3/4 bg-white rounded-full"></div>
                           </div>
                        </div>
                     </div>
                     <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                           <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center mb-2">
                              <ArrowRight size={14} className="text-green-600 -rotate-45" />
                           </div>
                           <div className="text-xs text-slate-400 font-bold">Income</div>
                           <div className="font-bold text-slate-800">$8,200</div>
                        </div>
                        <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                           <div className="h-8 w-8 bg-orange-100 rounded-lg flex items-center justify-center mb-2">
                              <Receipt size={14} className="text-orange-600" />
                           </div>
                           <div className="text-xs text-slate-400 font-bold">Pending</div>
                           <div className="font-bold text-slate-800">5</div>
                        </div>
                     </div>
                  </div>

                  {/* Recent List */}
                  <div className="flex-1 bg-white rounded-t-3xl shadow-inner p-4 space-y-4">
                     <div className="text-sm font-bold text-slate-800 mb-2">Recent Invoices</div>
                     {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="flex items-center justify-between">
                           <div className="flex items-center gap-3">
                              <div className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center">
                                 <span className="font-bold text-slate-500 text-xs">#{1000 + i}</span>
                              </div>
                              <div>
                                 <div className="text-xs font-bold text-slate-800">Client Name</div>
                                 <div className="text-[10px] text-slate-400">Today, 12:00 PM</div>
                              </div>
                           </div>
                           <div className="text-xs font-bold text-slate-800">$450.00</div>
                        </div>
                     ))}
                  </div>
                  
                  {/* Floating Action Button */}
                  <div className="absolute bottom-6 right-6 h-12 w-12 bg-primary rounded-full shadow-lg shadow-primary/40 flex items-center justify-center text-white">
                     <Download size={20} />
                  </div>
               </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16 space-y-4"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Why businesses love us</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">Everything you need to manage your business financials in one place.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Smartphone className="text-primary" />}
              title="Flutter Compatible"
              description="Seamlessly sync your data between our web app and existing Flutter mobile application."
            />
            <FeatureCard 
              icon={<Cloud className="text-primary" />}
              title="Cloud Sync"
              description="Your receipts and customer data are always backed up and available on any device."
            />
            <FeatureCard 
              icon={<BarChart3 className="text-primary" />}
              title="Smart Analytics"
              description="Visualize your revenue growth and pending payments with real-time dashboard stats."
            />
            <FeatureCard 
              icon={<CheckCircle2 className="text-primary" />}
              title="PDF Generation"
              description="Create professional, branded PDFs ready to be shared with your clients instantly."
            />
            <FeatureCard 
              icon={<Smartphone className="text-primary" />}
              title="Mobile Ready"
              description="A fully responsive web interface that works perfectly on phones and tablets."
            />
            <FeatureCard 
              icon={<ShieldCheck className="text-primary" />}
              title="Secure Auth"
              description="Enterprise-grade security powered by Firebase Authentication and Google Sign-in."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
             <div className="h-8 w-8 bg-slate-900 rounded-lg flex items-center justify-center">
              <Receipt className="text-white" size={18} />
            </div>
            <span className="font-bold text-slate-800">Receipt Book</span>
          </div>
          <p className="text-slate-400 text-sm">© 2024 Receipt Book Inc. All rights reserved.</p>
          <div className="flex gap-6 text-sm font-medium text-slate-600">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: any, title: string, description: string }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    whileHover={{ y: -5 }}
    className="bg-white p-8 rounded-3xl border border-slate-100 hover:shadow-xl hover:shadow-primary/5 transition-all group"
  >
    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary/10 transition-all duration-300">
      {React.cloneElement(icon, { size: 28 })}
    </div>
    <h3 className="text-xl font-bold text-slate-800 mb-3">{title}</h3>
    <p className="text-slate-500 leading-relaxed text-sm">{description}</p>
  </motion.div>
);

export default Landing;
