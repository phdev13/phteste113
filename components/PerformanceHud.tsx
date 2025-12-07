
import React, { useState, useEffect, useRef } from 'react';
import { Activity, Zap, Smartphone, Monitor, Info, GripVertical, X } from 'lucide-react';
import { useMobile } from '../hooks/useMobile';
import { motion, AnimatePresence } from 'framer-motion';

interface PerformanceHudProps {
  onClose: () => void;
}

export const PerformanceHud: React.FC<PerformanceHudProps> = ({ onClose }) => {
  const [metrics, setMetrics] = useState({
    fps: 60,
    loadTime: 0,
    lcp: 0,
  });
  
  const isMobile = useMobile();
  const requestRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(performance.now());
  const frameCountRef = useRef(0);

  useEffect(() => {
    // 1. Calculate Load Time
    const getLoadTime = () => {
      const navEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navEntry) {
        setMetrics(prev => ({ ...prev, loadTime: Math.round(navEntry.loadEventEnd) }));
      }
    };

    // 2. Observer for LCP
    const observeLCP = () => {
      try {
        new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          const lastEntry = entries[entries.length - 1];
          setMetrics(prev => ({ ...prev, lcp: Math.round(lastEntry.startTime) }));
        }).observe({ type: 'largest-contentful-paint', buffered: true });
      } catch (e) {
        // Fallback
      }
    };

    if (document.readyState === 'complete') {
      getLoadTime();
    } else {
      window.addEventListener('load', getLoadTime);
    }
    
    observeLCP();

    return () => window.removeEventListener('load', getLoadTime);
  }, []);

  // 3. FPS Counter Loop
  const animate = (time: number) => {
    frameCountRef.current++;
    if (time - lastTimeRef.current >= 1000) {
      setMetrics(prev => ({ ...prev, fps: Math.round(frameCountRef.current) }));
      frameCountRef.current = 0;
      lastTimeRef.current = time;
    }
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  // Helpers de status amigáveis
  const getFpsStatus = (fps: number) => {
      if (fps >= 55) return { label: 'Perfeita', color: 'text-green-500', bg: 'bg-green-500' };
      if (fps >= 30) return { label: 'Boa', color: 'text-yellow-500', bg: 'bg-yellow-500' };
      return { label: 'Lenta', color: 'text-red-500', bg: 'bg-red-500' };
  };

  const fpsStatus = getFpsStatus(metrics.fps);

  return (
    <motion.div 
      drag
      dragMomentum={false}
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      // FIX MOBILE: Touch-action none permite arrastar sem scrollar a tela. Z-Index 9999 garante que fique acima da BottomNav.
      style={{ touchAction: 'none' }}
      className={`fixed z-[9999] bg-white/95 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl overflow-hidden font-sans text-gray-800 w-[280px] select-none
        ${isMobile ? 'top-24 left-4' : 'bottom-8 right-24'}
      `}
    >
      {/* Header Draggable */}
      <div className="bg-gray-100/80 border-b border-gray-200 p-3 flex items-center justify-between cursor-grab active:cursor-grabbing touch-none">
         <div className="flex items-center gap-2">
            <Activity size={16} className="text-primary-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-gray-600">Qualidade do Site</span>
         </div>
         <div className="flex items-center gap-1">
            <GripVertical size={14} className="text-gray-400" />
            <button onPointerDown={(e) => { e.stopPropagation(); onClose(); }} className="hover:bg-gray-200 rounded p-1 transition-colors">
                <X size={14} className="text-gray-500" />
            </button>
         </div>
      </div>

      <div className="p-4 space-y-4">
          
          {/* FPS Meter Friendly */}
          <div>
              <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-medium text-gray-500 flex items-center gap-1">
                      <Zap size={12} /> Fluidez Visual
                  </span>
                  <span className={`text-xs font-bold ${fpsStatus.color}`}>{fpsStatus.label} ({metrics.fps} FPS)</span>
              </div>
              <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div 
                    className={`h-full ${fpsStatus.bg}`} 
                    animate={{ width: `${(metrics.fps / 60) * 100}%` }}
                    transition={{ type: 'spring', stiffness: 100 }}
                  />
              </div>
          </div>

          {/* Load Time Friendly */}
          <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${metrics.loadTime < 1500 ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'}`}>
                  <Monitor size={18} />
              </div>
              <div>
                  <p className="text-xs text-gray-500 font-medium">Velocidade de Abertura</p>
                  <p className="text-sm font-bold text-gray-900">
                      {metrics.loadTime ? `${(metrics.loadTime / 1000).toFixed(2)}s` : 'Calculando...'}
                  </p>
              </div>
          </div>

          {/* Info Note */}
          <div className="bg-primary-50 p-2 rounded-lg flex gap-2 items-start">
              <Info size={14} className="text-primary-600 mt-0.5 shrink-0" />
              <p className="text-[10px] text-primary-700 leading-tight">
                  Este painel mostra em tempo real como meu código otimizado garante uma navegação instantânea.
              </p>
          </div>

          <div className="text-[9px] text-center text-gray-400 font-mono uppercase tracking-widest">
              {isMobile ? 'Mobile Device' : 'Desktop Mode'} Active
          </div>
      </div>
    </motion.div>
  );
};
