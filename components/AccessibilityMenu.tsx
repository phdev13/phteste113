
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Accessibility, Eye, Type, Sun, Moon, Link as LinkIcon, RefreshCcw, X, ZoomIn, MoveVertical, Activity } from 'lucide-react';

interface AccessibilityMenuProps {
    onToggleHud: (show: boolean) => void;
    isHudOpen: boolean;
}

export const AccessibilityMenu: React.FC<AccessibilityMenuProps> = ({ onToggleHud, isHudOpen }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [positionY, setPositionY] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const [settings, setSettings] = useState({
    grayscale: false,
    contrast: false,
    largeText: false,
    readableFont: false,
    highlightLinks: false,
  });
  
  const constraintsRef = useRef(null);

  // Load Settings & Position from local storage
  useEffect(() => {
    if (typeof window !== 'undefined') {
        const savedSettings = localStorage.getItem('ph_a11y_settings');
        if (savedSettings) {
            setSettings(JSON.parse(savedSettings));
        }

        const savedPos = localStorage.getItem('ph_a11y_pos_y');
        if (savedPos) {
            setPositionY(parseFloat(savedPos));
        }
        setIsLoaded(true);
    }
  }, []);

  // Apply changes to HTML root
  useEffect(() => {
    const html = document.documentElement;
    settings.grayscale ? html.classList.add('a11y-grayscale') : html.classList.remove('a11y-grayscale');
    settings.contrast ? html.classList.add('a11y-contrast') : html.classList.remove('a11y-contrast');
    settings.largeText ? html.classList.add('a11y-large-text') : html.classList.remove('a11y-large-text');
    settings.readableFont ? html.classList.add('a11y-readable-font') : html.classList.remove('a11y-readable-font');
    settings.highlightLinks ? html.classList.add('a11y-highlight-links') : html.classList.remove('a11y-highlight-links');
    localStorage.setItem('ph_a11y_settings', JSON.stringify(settings));
  }, [settings]);

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const resetSettings = () => {
    setSettings({
      grayscale: false,
      contrast: false,
      largeText: false,
      readableFont: false,
      highlightLinks: false,
    });
    onToggleHud(false);
  };

  const handleDragEnd = (_: any, info: any) => {
      // Salva apenas a posição Y para manter o botão na altura que o usuário deixou
      const newY = positionY + info.offset.y;
      setPositionY(newY);
      localStorage.setItem('ph_a11y_pos_y', newY.toString());
  };

  // Se não carregou o localStorage ainda, não renderiza para evitar pulo visual
  if (!isLoaded) return null;

  return (
    <>
      {/* Constraints container covering the right edge vertically */}
      <div ref={constraintsRef} className="fixed top-24 bottom-24 right-0 w-20 pointer-events-none z-[89]" />

      <motion.div 
        drag="y" // CRÍTICO: Restringe movimento apenas para CIMA/BAIXO
        dragMomentum={false}
        dragConstraints={constraintsRef} 
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
        // Style.right = 0 força ele a ficar grudado na direita
        style={{ y: positionY, right: 0, top: '50%' }}
        className="fixed z-[90] flex items-center font-sans touch-none"
      >
        
        {/* Panel (Always attached to the button) */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, x: 20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.95 }}
              className="absolute right-[110%] top-1/2 -translate-y-1/2 bg-white dark:bg-gray-900 shadow-2xl border border-gray-200 dark:border-gray-700 rounded-2xl p-5 w-72 mr-2 cursor-auto"
              onPointerDown={(e) => e.stopPropagation()} // Impede drag ao clicar no painel
            >
              <div className="flex justify-between items-center mb-4 border-b border-gray-100 dark:border-gray-800 pb-3">
                  <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <Accessibility size={20} className="text-primary-600"/> Acessibilidade
                  </h3>
                  <div className="flex gap-1">
                      <button onClick={resetSettings} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-500" title="Resetar">
                          <RefreshCcw size={16} />
                      </button>
                      <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-500">
                          <X size={18} />
                      </button>
                  </div>
              </div>

              <div className="space-y-2">
                  <button 
                      onClick={() => toggleSetting('grayscale')}
                      className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${settings.grayscale ? 'bg-primary-600 text-white' : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100'}`}
                  >
                      <span className="flex items-center gap-3 text-sm font-medium"><Eye size={18}/> Daltonismo (P&B)</span>
                      <div className={`w-3 h-3 rounded-full ${settings.grayscale ? 'bg-white' : 'bg-gray-300'}`}></div>
                  </button>

                  <button 
                      onClick={() => toggleSetting('contrast')}
                      className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${settings.contrast ? 'bg-primary-600 text-white' : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100'}`}
                  >
                      <span className="flex items-center gap-3 text-sm font-medium"><Sun size={18}/> Alto Contraste</span>
                      <div className={`w-3 h-3 rounded-full ${settings.contrast ? 'bg-white' : 'bg-gray-300'}`}></div>
                  </button>

                  <button 
                      onClick={() => toggleSetting('largeText')}
                      className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${settings.largeText ? 'bg-primary-600 text-white' : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100'}`}
                  >
                      <span className="flex items-center gap-3 text-sm font-medium"><ZoomIn size={18}/> Aumentar Texto</span>
                      <div className={`w-3 h-3 rounded-full ${settings.largeText ? 'bg-white' : 'bg-gray-300'}`}></div>
                  </button>

                  <button 
                      onClick={() => toggleSetting('readableFont')}
                      className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${settings.readableFont ? 'bg-primary-600 text-white' : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100'}`}
                  >
                      <span className="flex items-center gap-3 text-sm font-medium"><Type size={18}/> Fonte Legível</span>
                      <div className={`w-3 h-3 rounded-full ${settings.readableFont ? 'bg-white' : 'bg-gray-300'}`}></div>
                  </button>

                  <button 
                      onClick={() => toggleSetting('highlightLinks')}
                      className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${settings.highlightLinks ? 'bg-primary-600 text-white' : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100'}`}
                  >
                      <span className="flex items-center gap-3 text-sm font-medium"><LinkIcon size={18}/> Destacar Links</span>
                      <div className={`w-3 h-3 rounded-full ${settings.highlightLinks ? 'bg-white' : 'bg-gray-300'}`}></div>
                  </button>

                  {/* Monitor de Performance Toggle */}
                  <div className="pt-2 border-t border-gray-100 dark:border-gray-800 mt-2">
                      <button 
                          onClick={() => onToggleHud(!isHudOpen)}
                          className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${isHudOpen ? 'bg-green-600 text-white' : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100'}`}
                      >
                          <span className="flex items-center gap-3 text-sm font-medium"><Activity size={18}/> Monitor de Performance</span>
                          <div className={`w-3 h-3 rounded-full ${isHudOpen ? 'bg-white' : 'bg-gray-300'}`}></div>
                      </button>
                  </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toggle Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className="bg-primary-600 text-white p-3 rounded-l-xl rounded-r-none shadow-lg hover:bg-primary-700 transition-colors w-12 flex flex-col items-center justify-center gap-1 group border-y border-l border-primary-500 cursor-grab active:cursor-grabbing"
          aria-label="Opções de Acessibilidade"
          title="Arraste verticalmente para ajustar"
        >
          {isOpen ? <X size={24} /> : <Accessibility size={24} />}
          <div className="flex flex-col gap-0.5 mt-1 opacity-50 group-hover:opacity-100 transition-opacity">
             <div className="w-0.5 h-0.5 bg-white rounded-full"></div>
             <div className="w-0.5 h-0.5 bg-white rounded-full"></div>
             <div className="w-0.5 h-0.5 bg-white rounded-full"></div>
          </div>
        </motion.button>
      </motion.div>
    </>
  );
};
