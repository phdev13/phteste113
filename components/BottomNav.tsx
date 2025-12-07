
import React from 'react';
import { Home, Layers, MessageSquare, Briefcase, Menu } from 'lucide-react';
import { ViewType } from '../types';
import { motion } from 'framer-motion';

interface BottomNavProps {
  currentView: ViewType;
  onNavigate: (view: ViewType) => void;
  onOpenChat: () => void;
  onToggleMenu: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentView, onNavigate, onOpenChat, onToggleMenu }) => {
  
  const triggerHaptic = () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(15); // Feedback curto e nítido
    }
  };

  const NavItem = ({ view, icon: Icon, label }: { view: ViewType, icon: any, label: string }) => {
    const isActive = currentView === view;
    return (
      <button 
        onClick={() => {
            triggerHaptic();
            onNavigate(view);
        }}
        aria-label={label}
        className="relative flex flex-col items-center justify-center w-14 h-full active:scale-90 transition-transform duration-200 group"
      >
        <div className={`relative p-3 rounded-2xl transition-all duration-300 ${isActive ? 'text-primary-600 bg-primary-50/80' : 'text-gray-400 group-hover:text-gray-600'}`}>
            <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
            {isActive && (
                <motion.div 
                    layoutId="nav-pill"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary-600 rounded-full shadow-[0_0_8px_rgba(124,58,237,0.6)]"
                />
            )}
        </div>
      </button>
    );
  };

  return (
    <>
        {/* Spacer to prevent content from being hidden behind the dock */}
        <div className="h-32 md:hidden" />

        {/* Floating Dock Container */}
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[90] md:hidden w-[90%] max-w-[380px]">
            
            {/* Premium Glassmorphism Background */}
            <div className="absolute inset-0 bg-white/80 backdrop-blur-2xl rounded-[2rem] shadow-[0_8px_32px_-4px_rgba(0,0,0,0.15),0_0_0_1px_rgba(255,255,255,0.4)] border border-white/20"></div>
            
            <div className="relative flex justify-between items-center h-[80px] px-6">
                
                <NavItem view="home" icon={Home} label="Início" />
                <NavItem view="services" icon={Layers} label="Serviços" />
                
                {/* Floating Action Button (FAB) */}
                <div className="relative -top-8">
                    <motion.button 
                        whileTap={{ scale: 0.9 }}
                        onClick={() => {
                            triggerHaptic();
                            onOpenChat();
                        }}
                        aria-label="Abrir Chat"
                        className="w-16 h-16 bg-gray-900 rounded-[1.2rem] flex items-center justify-center text-white shadow-[0_15px_30px_-8px_rgba(17,24,39,0.5)] border-[3px] border-white relative group overflow-hidden"
                    >
                        {/* Internal Glow */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-primary-600/80 to-purple-600/80 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        
                        <div className="relative z-10">
                            <MessageSquare size={28} fill="currentColor" className="text-white" />
                            <div className="absolute top-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900 animate-pulse"></div>
                        </div>
                    </motion.button>
                </div>

                <NavItem view="portfolio" icon={Briefcase} label="Projetos" />
                
                <button 
                    onClick={() => {
                        triggerHaptic();
                        onToggleMenu();
                    }}
                    aria-label="Abrir Menu"
                    className="relative flex flex-col items-center justify-center w-14 h-full active:scale-90 transition-transform duration-200 text-gray-400 hover:text-gray-600"
                >
                    <div className="p-3 rounded-2xl">
                        <Menu size={24} />
                    </div>
                </button>
            </div>
        </div>
    </>
  );
};
