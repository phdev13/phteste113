
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    RefreshCw,
    Smartphone,
    Tablet,
    Monitor,
    CheckCircle2,
    Cpu,
    Layout,
    FileCode2,
    Lock,
    BarChart3
} from 'lucide-react';
import { useMobile } from '../hooks/useMobile';

// --- CONSTANTS ---

const SCENARIOS = {
    'wordpress': {
        label: 'Site Wordpress (Tema Pronto)',
        url: 'wp-lento.com.br',
        lcp: 4.2,
        cls: 0.25,
        score: 45,
        color: 'text-red-500',
        bg: 'bg-red-50',
        behavior: 'heavy-js'
    },
    'news': {
        label: 'Portal de Notícias (Muitos Ads)',
        url: 'portal-noticias.com',
        lcp: 2.8,
        cls: 0.8,
        score: 52,
        color: 'text-orange-500',
        bg: 'bg-orange-50',
        behavior: 'layout-shift'
    },
    'ecommerce': {
        label: 'E-commerce (Imagens Pesadas)',
        url: 'loja-generica.com',
        lcp: 5.5,
        cls: 0.05,
        score: 38,
        color: 'text-red-600',
        bg: 'bg-red-50',
        behavior: 'heavy-images'
    }
};

// --- COMPONENTS ---

const MetricBadge = ({ label, value, unit, status }: { label: string, value: string | number, unit: string, status: 'good' | 'average' | 'poor' }) => {
    const colors = {
        good: 'text-green-600 bg-green-50 border-green-100',
        average: 'text-orange-600 bg-orange-50 border-orange-100',
        poor: 'text-red-600 bg-red-50 border-red-100'
    };

    return (
        <div className={`flex flex-col items-center justify-center p-2 rounded-lg border ${colors[status]} min-w-[60px] md:min-w-[70px]`}>
            <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-wider opacity-70">{label}</span>
            <span className="text-base md:text-lg font-bold leading-none mt-1">
                {value}<span className="text-[10px] font-medium">{unit}</span>
            </span>
        </div>
    );
};

const BrowserFrame = ({ url, isSecure = true, children, rightControls }: any) => (
    <div className="w-full h-full bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm flex flex-col transform-gpu">
        {/* Address Bar */}
        <div className="bg-gray-50 border-b border-gray-200 p-2 flex items-center gap-2">
            <div className="flex gap-1.5 mr-2">
                <div className="w-2.5 h-2.5 rounded-full bg-gray-300"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-gray-300"></div>
            </div>
            <div className="flex-1 bg-white border border-gray-200 rounded flex items-center px-2 py-1 gap-2 h-7 shadow-sm relative">
                {isSecure && <Lock size={10} className="text-green-600" />}
                {rightControls ? (
                    rightControls
                ) : (
                    <span className="text-xs text-gray-600 font-mono truncate select-none">{url}</span>
                )}
            </div>
        </div>
        {/* Viewport */}
        <div className="flex-1 relative overflow-hidden bg-white">
            {children}
        </div>
    </div>
);

// --- MAIN DEMO COMPONENT ---

export const RealTimePerformanceDemo = () => {
  const [selectedScenario, setSelectedScenario] = useState<keyof typeof SCENARIOS>('wordpress');
  const [restartKey, setRestartKey] = useState(0);
  const isMobile = useMobile();
  
  // States simplified for cleaner mobile rendering
  const [phComplete, setPhComplete] = useState(false);
  const [compComplete, setCompComplete] = useState(false);

  // Restart simulation logic optimized
  useEffect(() => {
    setPhComplete(false);
    setCompComplete(false);

    // PH: Instant load feel
    const t1 = setTimeout(() => setPhComplete(true), 800);

    // Competitor: Slow load based on LCP data
    const delay = SCENARIOS[selectedScenario].lcp * 1000;
    const t2 = setTimeout(() => setCompComplete(true), delay);

    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [restartKey, selectedScenario]);

  const currentScenarioData = SCENARIOS[selectedScenario];

  return (
    <div className="my-16 bg-white border border-gray-100 rounded-3xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] font-sans overflow-hidden transform-gpu">
        
        {/* Header */}
        <div className="p-6 md:p-8 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-50/50">
            <div>
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <BarChart3 size={20} className="text-primary-600" />
                    Comparativo de Performance
                </h3>
                <p className="text-xs text-gray-500 mt-1">Dados simulados baseados na média do PageSpeed Insights.</p>
            </div>
            <button 
                onClick={() => setRestartKey(prev => prev + 1)}
                className="text-xs font-bold bg-white border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 hover:text-primary-600 transition-colors flex items-center gap-2 shadow-sm"
            >
                <RefreshCw size={14} className={!phComplete ? "animate-spin" : ""} />
                Reiniciar Teste
            </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-gray-100">
            
            {/* LADO ESQUERDO: PH (HERO) */}
            <div className="p-6 md:p-8 bg-white relative">
                
                {/* Metrics Header */}
                <div className="flex justify-between items-end mb-6 h-14">
                    <div>
                        <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded mb-1 inline-block">Engenharia PH</span>
                        <h4 className="font-bold text-gray-900 text-xl">Score 100/100</h4>
                    </div>
                    {phComplete && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-2">
                            <MetricBadge label="LCP" value="0.8" unit="s" status="good" />
                            <MetricBadge label="CLS" value="0" unit="" status="good" />
                        </motion.div>
                    )}
                </div>

                {/* Browser Visual */}
                <div className="h-64 relative">
                    <BrowserFrame url="phstatic.com.br">
                        {!phComplete ? (
                            <div className="p-6 space-y-4 animate-pulse">
                                <div className="h-8 bg-gray-100 rounded w-1/3"></div>
                                <div className="h-32 bg-gray-100 rounded w-full"></div>
                                <div className="flex gap-2">
                                    <div className="h-10 bg-gray-100 rounded w-24"></div>
                                    <div className="h-10 bg-gray-100 rounded w-24"></div>
                                </div>
                            </div>
                        ) : (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 flex flex-col h-full bg-white">
                                <div className="text-2xl font-bold text-gray-900 mb-2">Sites de Elite</div>
                                <div className="text-sm text-gray-500 mb-6">Carregamento instantâneo para máxima conversão.</div>
                                <div className="flex gap-3 mb-6">
                                    <div className="bg-gray-900 text-white px-4 py-2 rounded-lg text-xs font-bold">Começar</div>
                                    <div className="border border-gray-200 px-4 py-2 rounded-lg text-xs font-bold">Saiba mais</div>
                                </div>
                                <div className="flex-1 bg-gray-50 rounded-lg border border-gray-100 p-2 grid grid-cols-3 gap-2">
                                    <div className="bg-white rounded h-full shadow-sm"></div>
                                    <div className="bg-white rounded h-full shadow-sm"></div>
                                    <div className="bg-white rounded h-full shadow-sm"></div>
                                </div>
                            </motion.div>
                        )}
                    </BrowserFrame>
                    {/* CSS Transition Bar for Performance */}
                    <div className="absolute top-0 left-0 w-full h-0.5 bg-gray-100 z-50">
                        <div 
                            className="h-full bg-green-500 shadow-[0_0_10px_#22c55e] transition-all ease-out duration-[800ms]"
                            style={{ width: phComplete ? '100%' : '0%', opacity: phComplete ? 0 : 1 }}
                        />
                    </div>
                </div>
            </div>

            {/* LADO DIREITO: CONCORRENTE */}
            <div className="p-6 md:p-8 bg-gray-50/30 relative">
                <div className="flex justify-between items-end mb-6 h-14">
                    <div>
                        <span className={`text-xs font-bold px-2 py-1 rounded mb-1 inline-block ${currentScenarioData.bg} ${currentScenarioData.color}`}>Site Comum</span>
                        <h4 className="font-bold text-gray-400 text-xl">Score {currentScenarioData.score}/100</h4>
                    </div>
                    {compComplete ? (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-2">
                            <MetricBadge label="LCP" value={currentScenarioData.lcp} unit="s" status="poor" />
                            <MetricBadge label="CLS" value={currentScenarioData.cls} unit="" status="poor" />
                        </motion.div>
                    ) : (
                        <div className="flex gap-2 opacity-30 blur-sm">
                             <MetricBadge label="LCP" value="-" unit="" status="average" />
                             <MetricBadge label="CLS" value="-" unit="" status="average" />
                        </div>
                    )}
                </div>

                <div className="h-64 relative">
                    <BrowserFrame 
                        isSecure={false}
                        rightControls={
                            <select 
                                value={selectedScenario}
                                onChange={(e) => setSelectedScenario(e.target.value as any)}
                                className="w-full bg-transparent text-xs font-mono text-gray-700 outline-none cursor-pointer appearance-none pr-4"
                                style={{ backgroundImage: 'none' }}
                            >
                                {Object.entries(SCENARIOS).map(([key, data]) => (
                                    <option key={key} value={key}>{data.url}</option>
                                ))}
                            </select>
                        }
                    >
                        {!compComplete && (
                            <div className="absolute inset-0 flex items-center justify-center bg-white z-20">
                                <div className="flex flex-col items-center">
                                    <RefreshCw className="animate-spin text-gray-300 mb-2" />
                                    <span className="text-xs text-gray-400 font-mono">Loading assets...</span>
                                </div>
                            </div>
                        )}

                        <div className={`p-4 h-full relative ${!compComplete ? 'opacity-0' : 'opacity-100 transition-opacity duration-300'}`}>
                            {currentScenarioData.behavior === 'layout-shift' && (
                                <>
                                    <motion.div 
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 60, opacity: 1 }}
                                        transition={{ delay: 0.5, duration: 0.3 }}
                                        className="w-full bg-yellow-100 border border-yellow-300 mb-4 flex items-center justify-center text-[10px] text-yellow-700"
                                    >
                                        [AD] BANNER CARREGOU TARDE
                                    </motion.div>
                                    <div className="h-4 bg-gray-200 w-3/4 mb-2"></div>
                                    <div className="h-4 bg-gray-200 w-full mb-2"></div>
                                    <div className="h-4 bg-gray-200 w-1/2 mb-4"></div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="h-20 bg-gray-100"></div>
                                        <div className="h-20 bg-gray-100"></div>
                                    </div>
                                </>
                            )}

                            {currentScenarioData.behavior === 'heavy-images' && (
                                <div className="grid grid-cols-2 gap-2">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div key={i} className="aspect-square bg-gray-100 relative overflow-hidden border border-gray-200">
                                            {/* Reduced complexity: Simple CSS transition instead of framer motion for mobile */}
                                            <div className="absolute inset-0 flex items-center justify-center text-[10px] text-gray-400 bg-gray-200">
                                                IMG_4MB.jpg
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {currentScenarioData.behavior === 'heavy-js' && (
                                <div className="space-y-4 opacity-50">
                                    <div className="h-8 bg-blue-100 w-full rounded"></div>
                                    <div className="h-4 bg-gray-100 w-full"></div>
                                    <div className="h-4 bg-gray-100 w-full"></div>
                                    <div className="h-4 bg-gray-100 w-3/4"></div>
                                    <div className="absolute inset-0 z-10 cursor-wait"></div>
                                </div>
                            )}
                        </div>
                    </BrowserFrame>
                    
                    {/* CSS Transition Bar */}
                    <div className="absolute top-0 left-0 w-full h-0.5 bg-gray-100 z-50">
                        <div 
                            className="h-full bg-red-500 transition-all ease-linear"
                            style={{ 
                                width: compComplete ? '100%' : '0%', 
                                transitionDuration: compComplete ? '0s' : `${currentScenarioData.lcp}s` 
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

// --- 2. CODE TO UI PIPELINE (CLEAN FLOW) ---
export const AIArchitectureDemo = () => {
    const [activeStage, setActiveStage] = useState(0);
    const isMobile = useMobile();

    // Slower interval on mobile to reduce main thread work
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveStage((prev) => (prev + 1) % 3);
        }, isMobile ? 4000 : 3500);
        return () => clearInterval(interval);
    }, [isMobile]);

    const stages = [
        { label: 'Input de Dados', sub: 'Briefing & Requisitos', icon: FileCode2, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Refinamento IA', sub: 'Otimização Estrutural', icon: Cpu, color: 'text-purple-600', bg: 'bg-purple-50' },
        { label: 'Interface Final', sub: 'Produto Pronto', icon: Layout, color: 'text-green-600', bg: 'bg-green-50' },
    ];

    return (
        <div className="my-16 bg-white rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-8 md:p-12 overflow-hidden relative transform-gpu">
            
            {/* Steps Header */}
            <div className="grid grid-cols-3 gap-4 mb-12 relative">
                <div className="absolute top-5 left-0 w-full h-[2px] bg-gray-100 -z-10">
                    <motion.div 
                        className="h-full bg-primary-200" 
                        animate={{ width: `${(activeStage / 2) * 100}%` }}
                        transition={{ duration: 0.5 }}
                    />
                </div>

                {stages.map((stage, i) => (
                    <div key={i} className={`flex flex-col items-center text-center transition-opacity duration-500 ${activeStage >= i ? 'opacity-100' : 'opacity-40'}`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 transition-all duration-500 border-4 border-white ${activeStage >= i ? 'bg-gray-900 text-white shadow-lg scale-110' : 'bg-gray-200 text-gray-400'}`}>
                            <stage.icon size={16} />
                        </div>
                        <span className="text-xs font-bold text-gray-900 block">{stage.label}</span>
                        <span className="text-[10px] text-gray-500 hidden md:block">{stage.sub}</span>
                    </div>
                ))}
            </div>

            {/* Stage Visualization */}
            <div className="h-[320px] w-full max-w-2xl mx-auto relative bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden shadow-inner">
                <AnimatePresence mode="wait">
                    
                    {activeStage === 0 && (
                        <motion.div 
                            key="code"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 p-8 flex flex-col justify-center"
                        >
                            <div className="font-mono text-xs space-y-3 text-gray-400">
                                <div className="flex items-center gap-2 mb-4 border-b border-gray-200 pb-2">
                                    <FileCode2 size={14} className="text-blue-500"/>
                                    <span className="text-gray-500 font-bold">briefing.json</span>
                                </div>
                                <div className="h-2.5 bg-blue-100 rounded w-3/4" />
                                <div className="h-2.5 bg-gray-200 rounded w-1/2" />
                                <div className="h-2.5 bg-gray-200 rounded w-full" />
                            </div>
                        </motion.div>
                    )}

                    {activeStage === 1 && (
                        <motion.div 
                            key="processing"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-white to-purple-50/50"
                        >
                            <div className="relative">
                                {!isMobile && <div className="absolute inset-0 bg-purple-200/30 rounded-full animate-ping"></div>}
                                <div className="w-24 h-24 bg-white rounded-2xl shadow-xl flex items-center justify-center relative z-10 border border-purple-100">
                                    <Cpu size={32} className="text-purple-600" />
                                </div>
                            </div>
                            <div className="absolute bottom-8 text-xs font-bold text-purple-600 bg-purple-50 px-3 py-1 rounded-full border border-purple-100">
                                Otimizando...
                            </div>
                        </motion.div>
                    )}

                    {activeStage === 2 && (
                        <motion.div 
                            key="ui"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-white flex flex-col"
                        >
                            <div className="h-10 border-b border-gray-100 flex items-center px-4 gap-2 bg-gray-50/50">
                                <div className="flex gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-gray-300"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-gray-300"></div>
                                </div>
                                <div className="flex-1 bg-white h-6 rounded border border-gray-200 mx-2"></div>
                            </div>
                            
                            <div className="flex-1 p-8 flex items-center gap-8 bg-white">
                                <div className="flex-1 space-y-4">
                                    <div className="h-8 bg-gray-900 rounded-lg" />
                                    <div className="h-3 bg-gray-200 rounded" />
                                    <div className="h-3 bg-gray-200 rounded" />
                                </div>
                                <div className="w-1/3 aspect-square bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-center">
                                    <CheckCircle2 size={40} className="text-green-500" />
                                </div>
                            </div>
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>
        </div>
    );
};

// --- 3. RESPONSIVE RESIZER DEMO (CLEAN BROWSER) ---
export const ResponsiveResizer = () => {
    const [widthPercent, setWidthPercent] = useState(100);
    const [activeDevice, setActiveDevice] = useState('desktop');

    const handleDevice = (device: string) => {
        setActiveDevice(device);
        if (device === 'mobile') setWidthPercent(35);
        if (device === 'tablet') setWidthPercent(60);
        if (device === 'desktop') setWidthPercent(100);
    };

    return (
        <div className="my-16 flex flex-col items-center">
            
            {/* Device Toggle */}
            <div className="bg-white border border-gray-200 p-1.5 rounded-2xl flex gap-1 mb-10 shadow-sm">
                <button onClick={() => handleDevice('mobile')} className={`p-2.5 rounded-xl transition-all flex items-center gap-2 text-sm font-medium ${activeDevice === 'mobile' ? 'bg-gray-900 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}>
                    <Smartphone size={18} /> <span className="hidden sm:inline">Mobile</span>
                </button>
                <button onClick={() => handleDevice('tablet')} className={`p-2.5 rounded-xl transition-all flex items-center gap-2 text-sm font-medium ${activeDevice === 'tablet' ? 'bg-gray-900 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}>
                    <Tablet size={18} /> <span className="hidden sm:inline">Tablet</span>
                </button>
                <button onClick={() => handleDevice('desktop')} className={`p-2.5 rounded-xl transition-all flex items-center gap-2 text-sm font-medium ${activeDevice === 'desktop' ? 'bg-gray-900 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}>
                    <Monitor size={18} /> <span className="hidden sm:inline">Desktop</span>
                </button>
            </div>

            {/* Browser Mockup Container */}
            <div className="w-full h-[500px] bg-gray-100 rounded-3xl border border-gray-200 flex justify-center items-start overflow-hidden relative pt-12 shadow-inner transform-gpu">
                
                <div className="absolute inset-0 flex justify-center pointer-events-none opacity-20">
                    <div className="w-[35%] h-full border-x border-gray-400 border-dashed"></div>
                    <div className="w-[60%] h-full border-x border-gray-400 border-dashed absolute"></div>
                </div>

                <motion.div 
                    layout
                    animate={{ width: `${widthPercent}%` }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                    className="h-full bg-white shadow-2xl overflow-hidden flex flex-col relative rounded-t-xl"
                    style={{ maxWidth: '100%' }}
                >
                    <div className="bg-white border-b border-gray-100 h-12 flex items-center px-4 gap-4 shrink-0">
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-400/80"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-400/80"></div>
                            <div className="w-3 h-3 rounded-full bg-green-400/80"></div>
                        </div>
                        <div className="flex-1 bg-gray-50 h-8 rounded-lg flex items-center px-3 text-xs text-gray-400 font-medium">
                            ph.static.app
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 scrollbar-hide bg-white">
                        <div className={`grid gap-4 transition-all duration-500 ${activeDevice === 'mobile' ? 'grid-cols-1' : activeDevice === 'tablet' ? 'grid-cols-2' : 'grid-cols-3'}`}>
                            
                            <div className={`bg-gray-900 rounded-2xl p-6 text-white flex flex-col justify-end min-h-[200px] ${activeDevice === 'mobile' ? 'col-span-1' : 'col-span-full'}`}>
                                <div className="w-10 h-10 bg-white/20 rounded-xl mb-4 backdrop-blur-sm"></div>
                                <div className="w-3/4 h-4 bg-white/40 rounded mb-2"></div>
                                <div className="w-1/2 h-4 bg-white/20 rounded"></div>
                            </div>

                            {Array.from({length: 6}).map((_, i) => (
                                <div 
                                    key={i}
                                    className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm min-h-[140px] flex flex-col justify-between"
                                >
                                    <div className="w-10 h-10 bg-gray-50 rounded-full mb-4"></div>
                                    <div className="space-y-2">
                                        <div className="w-full h-2.5 bg-gray-100 rounded"></div>
                                        <div className="w-2/3 h-2.5 bg-gray-100 rounded"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-primary-100 cursor-ew-resize opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="w-1 h-8 bg-primary-400 rounded-full"></div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};
