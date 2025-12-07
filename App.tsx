
import React, { useState, Suspense, useCallback, memo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { HelmetProvider } from 'react-helmet-async';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Services } from './components/Services';
import { Portfolio } from './components/Portfolio';
import { Process } from './components/Process';
import { Contact } from './components/Contact';
import { ServiceDetail } from './components/ServiceDetail';
import { EasterEgg } from './components/EasterEgg';
import { CookieBanner } from './components/CookieBanner';
import { AnalyticsLoader } from './components/AnalyticsLoader';
import { NotFound } from './components/NotFound';
import { TermsOfUse } from './components/TermsOfUse';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { Blog } from './components/Blog';
import { BlogPromo } from './components/BlogPromo';
import { AccessibilityMenu } from './components/AccessibilityMenu';
import { BottomNav } from './components/BottomNav';
import { ServicePackage, ViewType } from './types';
import { ABOUT_CONFIG, ANALYTICS_CONFIG } from './config';
import { NAV_ITEMS } from './constants';
import { ChevronRight, ExternalLink, X, ArrowUpRight } from 'lucide-react';

const Chatbot = React.lazy(() => import('./components/Chatbot').then(module => ({ default: module.Chatbot })));
const ZenithOnePage = React.lazy(() => import('./components/ZenithOnePage').then(module => ({ default: module.ZenithOnePage })));
const AetherOnePage = React.lazy(() => import('./components/AetherOnePage').then(module => ({ default: module.AetherOnePage })));
const Footer = React.lazy(() => import('./components/Footer').then(module => ({ default: module.Footer })));
const PerformanceHud = React.lazy(() => import('./components/PerformanceHud').then(module => ({ default: module.PerformanceHud })));

const HeroMemo = memo(Hero);
const AboutMemo = memo(About);
const ServicesMemo = memo(Services);
const PortfolioMemo = memo(Portfolio);
const ProcessMemo = memo(Process);
const ContactMemo = memo(Contact);

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<ServicePackage | null>(null);
  const [triggerEasterEgg, setTriggerEasterEgg] = useState(false);
  const [isBlogPromoVisible, setIsBlogPromoVisible] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHudOpen, setIsHudOpen] = useState(false);

  const handleNavigate = useCallback((view: ViewType) => {
    setSelectedService(null);
    setCurrentView(view);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleOpenChat = useCallback(() => {
    setIsChatOpen(true);
  }, []);

  const handleSelectService = useCallback((service: ServicePackage) => {
    setSelectedService(service);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleBackFromService = useCallback(() => {
    setSelectedService(null);
  }, []);

  const handleLogoTrigger = useCallback(() => {
    setTriggerEasterEgg(true);
    setTimeout(() => setTriggerEasterEgg(false), 500);
  }, []);

  const toggleMobileMenu = useCallback(() => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(10);
    setIsMobileMenuOpen(prev => !prev);
  }, []);

  // Menu Animation Variants
  const menuContainerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    },
    exit: { opacity: 0 }
  };

  const menuItemVariants = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
  };

  if (currentView === 'zenith-demo') {
      return (
        <HelmetProvider>
            <Suspense fallback={<div className="h-screen w-full flex items-center justify-center bg-black text-white">Carregando Zenith...</div>}>
                <ZenithOnePage onBack={() => handleNavigate('portfolio')} />
            </Suspense>
        </HelmetProvider>
      );
  }

  if (currentView === 'aether-demo') {
      return (
        <HelmetProvider>
            <Suspense fallback={<div className="h-screen w-full flex items-center justify-center bg-slate-950 text-orange-500 font-mono">INICIALIZANDO SISTEMAS...</div>}>
                <AetherOnePage onBack={() => handleNavigate('portfolio')} />
            </Suspense>
        </HelmetProvider>
      );
  }

  if (currentView === '404') {
      return (
        <HelmetProvider>
            <NotFound onHome={() => handleNavigate('home')} />
        </HelmetProvider>
      );
  }

  if (currentView === 'terms') {
      return (
        <HelmetProvider>
            <div className="min-h-screen bg-white transition-colors duration-300">
            <Header currentView={currentView} onNavigate={handleNavigate} onLogoClick={handleLogoTrigger} />
            <TermsOfUse onNavigate={handleNavigate} />
            <Suspense fallback={null}><Footer onNavigate={handleNavigate} /></Suspense>
            <AccessibilityMenu onToggleHud={setIsHudOpen} isHudOpen={isHudOpen} />
            </div>
        </HelmetProvider>
      );
  }

  if (currentView === 'privacy') {
      return (
        <HelmetProvider>
            <div className="min-h-screen bg-white transition-colors duration-300">
            <Header currentView={currentView} onNavigate={handleNavigate} onLogoClick={handleLogoTrigger} />
            <PrivacyPolicy onNavigate={handleNavigate} />
            <Suspense fallback={null}><Footer onNavigate={handleNavigate} /></Suspense>
            <AccessibilityMenu onToggleHud={setIsHudOpen} isHudOpen={isHudOpen} />
            </div>
        </HelmetProvider>
      );
  }

  if (currentView === 'blog') {
      return (
        <HelmetProvider>
            <div className="min-h-screen bg-white transition-colors duration-300">
            <Header currentView={currentView} onNavigate={handleNavigate} onLogoClick={handleLogoTrigger} />
            <Blog onNavigate={handleNavigate} />
            <Suspense fallback={null}><Footer onNavigate={handleNavigate} /></Suspense>
            <AccessibilityMenu onToggleHud={setIsHudOpen} isHudOpen={isHudOpen} />
            <BottomNav currentView="blog" onNavigate={handleNavigate} onOpenChat={handleOpenChat} onToggleMenu={toggleMobileMenu} />
            <Suspense fallback={null}>
                <Chatbot 
                isOpen={isChatOpen} 
                setIsOpen={setIsChatOpen} 
                onNavigate={handleNavigate} 
                />
            </Suspense>
            </div>
        </HelmetProvider>
      );
  }

  return (
    <HelmetProvider>
        <div className="min-h-screen relative font-sans bg-white flex flex-col text-gray-900 pb-20 md:pb-0">
        <AnalyticsLoader measurementId={ANALYTICS_CONFIG.GA_MEASUREMENT_ID} />

        <img 
            src={ABOUT_CONFIG.IMAGE_URL} 
            alt="" 
            className="hidden absolute w-0 h-0 overflow-hidden" 
            aria-hidden="true" 
            loading="eager"
            decoding="sync"
            // @ts-ignore
            fetchPriority="high"
        />

        <EasterEgg 
            externalTrigger={triggerEasterEgg} 
            onClose={() => setTriggerEasterEgg(false)} 
        />

        <CookieBanner />
        <BlogPromo currentView={currentView} onNavigate={handleNavigate} onVisibilityChange={setIsBlogPromoVisible} />
        <AccessibilityMenu onToggleHud={setIsHudOpen} isHudOpen={isHudOpen} />

        <Header 
            currentView={currentView} 
            onNavigate={handleNavigate} 
            onLogoClick={handleLogoTrigger}
        />
        
        {/* MOBILE MENU - PREMIUM BOTTOM SHEET */}
        <AnimatePresence>
            {isMobileMenuOpen && (
                <>
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="fixed inset-0 bg-gray-900/40 z-[60] backdrop-blur-md md:hidden"
                        style={{ touchAction: 'none' }}
                    />
                    
                    <motion.div 
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", damping: 30, stiffness: 350, mass: 0.8 }}
                        className="fixed bottom-0 left-0 w-full bg-white z-[61] rounded-t-[2.5rem] shadow-[0_-20px_60px_rgba(0,0,0,0.15)] overflow-hidden md:hidden max-h-[85vh] flex flex-col"
                    >
                        {/* Drag Handle */}
                        <div 
                            className="w-full flex justify-center pt-5 pb-2 cursor-grab active:cursor-grabbing touch-none" 
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <div className="w-10 h-1 bg-gray-300 rounded-full"></div>
                        </div>

                        <div className="p-6 pt-2 pb-10 flex flex-col h-full overflow-y-auto">
                            <div className="flex justify-between items-center mb-6 px-1">
                                <h3 className="text-xl font-display font-bold text-gray-900 tracking-tight">Navegação</h3>
                                <button 
                                    onClick={() => setIsMobileMenuOpen(false)} 
                                    className="p-2 bg-gray-100/80 hover:bg-gray-200 rounded-full text-gray-500 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <motion.div 
                                variants={menuContainerVariants}
                                initial="hidden"
                                animate="show"
                                className="space-y-3"
                            >
                                {NAV_ITEMS.map((item) => (
                                    <motion.button
                                        key={item.id}
                                        variants={menuItemVariants}
                                        onClick={() => {
                                            if (navigator.vibrate) navigator.vibrate(5);
                                            handleNavigate(item.id);
                                        }}
                                        className={`w-full p-4 rounded-2xl flex items-center justify-between transition-all duration-200 active:scale-[0.98] border ${
                                            currentView === item.id 
                                            ? 'bg-gray-50 border-gray-200 text-primary-600 shadow-sm' 
                                            : 'bg-white border-transparent text-gray-600 hover:bg-gray-50'
                                        }`}
                                    >
                                        <span className={`text-base tracking-tight ${currentView === item.id ? 'font-bold' : 'font-medium'}`}>
                                            {item.label}
                                        </span>
                                        {currentView === item.id ? (
                                            <div className="flex items-center gap-2 text-primary-600 text-xs font-bold uppercase tracking-wider">
                                                <span>Ativo</span>
                                                <div className="w-2 h-2 rounded-full bg-primary-600"></div>
                                            </div>
                                        ) : (
                                            <ChevronRight size={18} className="text-gray-300" />
                                        )}
                                    </motion.button>
                                ))}
                            </motion.div>
                            
                            <div className="mt-8 pt-6 border-t border-gray-100">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 px-1">Legal</p>
                                <div className="grid grid-cols-2 gap-4">
                                    <button onClick={() => handleNavigate('terms')} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl text-xs font-medium text-gray-600 active:bg-gray-100 transition-all">
                                        Termos de Uso <ArrowUpRight size={14} className="text-gray-400" />
                                    </button>
                                    <button onClick={() => handleNavigate('privacy')} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl text-xs font-medium text-gray-600 active:bg-gray-100 transition-all">
                                        Privacidade <ArrowUpRight size={14} className="text-gray-400" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>

        <main className="flex-grow">
            <AnimatePresence mode="wait">
            
            {selectedService ? (
                <ServiceDetail 
                    key="service-detail"
                    service={selectedService} 
                    onBack={handleBackFromService}
                    onHire={handleOpenChat}
                />
            ) : (
                <>
                {currentView === 'home' && (
                    <motion.div
                    key="home"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    >
                    <HeroMemo onNavigate={handleNavigate} onOpenChat={handleOpenChat} />
                    </motion.div>
                )}

                {currentView === 'about' && (
                    <motion.div
                    key="about"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="pt-24 min-h-screen"
                    >
                    <AboutMemo onNavigate={handleNavigate} />
                    </motion.div>
                )}

                {currentView === 'services' && (
                    <motion.div
                    key="services"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="pt-24 min-h-screen"
                    >
                    <ServicesMemo onSelectService={handleSelectService} />
                    </motion.div>
                )}

                {currentView === 'portfolio' && (
                    <motion.div
                    key="portfolio"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="pt-24 min-h-screen"
                    >
                    <PortfolioMemo onOpenChat={handleOpenChat} onNavigate={handleNavigate} />
                    </motion.div>
                )}

                {currentView === 'process' && (
                    <motion.div
                    key="process"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="pt-24 min-h-screen"
                    >
                    <ProcessMemo onOpenChat={handleOpenChat} />
                    </motion.div>
                )}

                {currentView === 'contact' && (
                    <motion.div
                    key="contact"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="pt-24 min-h-screen"
                    >
                    <ContactMemo />
                    </motion.div>
                )}
                </>
            )}
            </AnimatePresence>
        </main>

        <Suspense fallback={null}>
            <Footer onNavigate={handleNavigate} />
        </Suspense>
        
        <BottomNav 
            currentView={currentView} 
            onNavigate={handleNavigate} 
            onOpenChat={handleOpenChat}
            onToggleMenu={toggleMobileMenu}
        />

        <Suspense fallback={null}>
            <Chatbot 
            isOpen={isChatOpen} 
            setIsOpen={setIsChatOpen} 
            onNavigate={handleNavigate} 
            contextService={selectedService}
            extraElevation={isBlogPromoVisible}
            />
        </Suspense>

        <AnimatePresence>
            {isHudOpen && (
                <Suspense fallback={null}>
                    <PerformanceHud onClose={() => setIsHudOpen(false)} />
                </Suspense>
            )}
        </AnimatePresence>
        </div>
    </HelmetProvider>
  );
}

export default App;
