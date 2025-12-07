
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Lightbulb } from 'lucide-react';
import { ViewType } from '../types';
import { useCookieConsent } from '../hooks/useCookieConsent';

interface BlogPromoProps {
  currentView: ViewType;
  onNavigate: (view: ViewType) => void;
  onVisibilityChange?: (visible: boolean) => void;
}

export const BlogPromo: React.FC<BlogPromoProps> = ({ currentView, onNavigate, onVisibilityChange }) => {
  const [isVisible, setIsVisible] = useState(false);
  const { isVisible: isCookieVisible, consent } = useCookieConsent();

  useEffect(() => {
    if (onVisibilityChange) {
      onVisibilityChange(isVisible);
    }
  }, [isVisible, onVisibilityChange]);

  useEffect(() => {
    // 1. Não mostrar se já estiver no blog
    if (currentView === 'blog') {
      setIsVisible(false);
      return;
    }

    // 2. Não mostrar se não aceitou cookies ainda (consent deve ser true)
    if (consent !== true) {
        setIsVisible(false);
        return;
    }

    // 3. Verificar se já foi fechado nesta sessão
    const hasClosed = sessionStorage.getItem('ph_blog_promo_closed');
    if (hasClosed) return;

    // 4. Mostrar após 8 segundos de navegação APÓS aceitar cookies
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 8000);

    return () => clearTimeout(timer);
  }, [currentView, consent]);

  const handleClose = () => {
    setIsVisible(false);
    sessionStorage.setItem('ph_blog_promo_closed', 'true');
  };

  const handleNavigate = () => {
    setIsVisible(false);
    onNavigate('blog');
  };

  // Define a posição vertical baseada na visibilidade do banner de cookies (embora com a logica acima, o banner já deve ter sumido, mas mantemos por segurança)
  // Mudado para 'left-6' e 'right-auto' para fixar na esquerda.
  const positionClass = isCookieVisible ? 'bottom-36' : 'bottom-6';

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: -50, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -50, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className={`fixed z-[45] max-w-[320px] w-[90%] 
                     left-4 md:left-6 transition-all duration-500 ease-in-out ${positionClass}`}
        >
          <div className="bg-white border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.12)] rounded-2xl p-5 relative overflow-hidden group hover:shadow-2xl transition-all duration-300">
            
            <button 
              onClick={handleClose}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-1 transition-colors z-20"
            >
              <X size={16} />
            </button>

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600">
                  <Lightbulb size={20} className="fill-primary-100" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-primary-600 uppercase tracking-wider">Dica do Especialista</p>
                  <h4 className="font-bold text-gray-900 text-sm leading-tight">Antes de contratar...</h4>
                </div>
              </div>

              <p className="text-gray-600 text-xs leading-relaxed mb-4">
                Entenda como a <strong>Engenharia de Frontend</strong> economiza seu dinheiro a longo prazo. Leia o artigo técnico.
              </p>

              <button 
                onClick={handleNavigate}
                className="w-full flex items-center justify-between bg-gray-900 hover:bg-gray-800 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg group/btn"
              >
                <span>Ler Artigo Completo</span>
                <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
