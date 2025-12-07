
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Zap } from 'lucide-react';
import { useMobile } from '../hooks/useMobile';

interface MobileCTAProps {
  onHire: () => void;
  isChatOpen: boolean;
}

export const MobileCTA: React.FC<MobileCTAProps> = ({ onHire, isChatOpen }) => {
  const isMobile = useMobile();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show only after scrolling past hero (approx 500px)
      const scrolled = window.scrollY > 500;
      
      // Hide if near bottom (footer area) to prevent clash
      const nearBottom = (window.innerHeight + window.scrollY) >= document.body.offsetHeight - 400;
      
      setIsVisible(scrolled && !nearBottom);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isMobile) return null;

  return (
    <AnimatePresence>
      {isVisible && !isChatOpen && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          transition={{ type: 'spring', damping: 20 }}
          className="fixed bottom-0 left-0 w-full z-40 p-4 pb-6 bg-gradient-to-t from-white via-white to-transparent dark:from-dark dark:via-dark pointer-events-none"
        >
          <button 
            onClick={onHire}
            className="w-full bg-primary-600 text-white font-bold py-3.5 px-6 rounded-2xl shadow-xl shadow-primary-600/30 flex items-center justify-between pointer-events-auto active:scale-95 transition-transform"
          >
            <span className="flex items-center gap-2">
               <span className="bg-primary-500/50 p-1.5 rounded-lg"><Zap size={18} fill="currentColor"/></span>
               <span>Solicitar Orçamento</span>
            </span>
            <MessageSquare size={20} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
