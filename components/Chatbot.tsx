
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, CheckSquare, Square, ChevronRight, Clock, ShieldAlert, RefreshCcw, Code2, Bot } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { BudgetData, ChatMessage, ChatOption, ChatbotProps } from '../types';
import { PROCESS_STEPS } from '../constants';
import { CHAT_FLOW, INITIAL_BUDGET, generateWhatsAppLink } from '../chatbotFlow';
import { useCookieConsent } from '../hooks/useCookieConsent';

// Frases de engajamento para o balão flutuante
const CHAT_TRIGGERS = [
  "Posso ajudar no seu projeto? 👋",
  "Vamos criar algo incrível hoje? 🚀",
  "Dúvidas sobre os pacotes? 🤔",
  "Faça um orçamento sem compromisso! 💰",
  "Transforme sua ideia em site 🌐",
  "Precisa de um Frontend Especialista? 👨‍💻",
  "Bora escalar seu negócio? 📈",
  "Sites rápidos e modernos aqui ⚡",
  "Me chama para conversar! 💬",
  "Qual seu próximo desafio? 🏆"
];

export const Chatbot: React.FC<ChatbotProps> = ({ isOpen, setIsOpen, onNavigate, contextService, extraElevation }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [budgetData, setBudgetData] = useState<BudgetData>(INITIAL_BUDGET);
  
  // Call to Action Bubble State
  const [activeTrigger, setActiveTrigger] = useState<string>('');
  const [showTrigger, setShowTrigger] = useState(false);

  // State Machine
  const [currentStepId, setCurrentStepId] = useState<string>('');
  const [selectedMultiOptions, setSelectedMultiOptions] = useState<string[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { isVisible: isCookieVisible } = useCookieConsent();
  // Elevação se o banner de cookies estiver visível OU se extraElevation for true
  const shouldElevate = isCookieVisible || extraElevation;

  const scrollToBottom = () => {
    setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, isOpen]);

  // Init Logic
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      initializeChat();
    }
  }, [isOpen]);

  // Random Chat Trigger Logic
  useEffect(() => {
    if (isOpen) {
      setShowTrigger(false);
      return;
    }

    let timeoutId: ReturnType<typeof setTimeout>;

    const showRandomMessage = () => {
      // 1. Pick random message
      const randomMsg = CHAT_TRIGGERS[Math.floor(Math.random() * CHAT_TRIGGERS.length)];
      setActiveTrigger(randomMsg);
      setShowTrigger(true);

      // 2. Hide after 5 seconds (reading time)
      timeoutId = setTimeout(() => {
        setShowTrigger(false);
        
        // 3. Wait random time between 8s and 20s before showing next
        const randomDelay = Math.random() * 12000 + 8000;
        timeoutId = setTimeout(showRandomMessage, randomDelay);
      }, 5000);
    };

    // Initial delay of 3s before starting loop
    const initialDelay = setTimeout(showRandomMessage, 3000);

    return () => {
      clearTimeout(timeoutId);
      clearTimeout(initialDelay);
    };
  }, [isOpen]);

  const initializeChat = () => {
    setBudgetData(INITIAL_BUDGET);
    setMessages([]);
    
    // Check context
    if (contextService) {
        setBudgetData(prev => ({ ...prev, projectType: contextService.title }));
        processStep('start_context', { ...INITIAL_BUDGET, projectType: contextService.title });
    } else {
        processStep('start', INITIAL_BUDGET);
    }
  };

  const processStep = async (stepId: string, currentData: BudgetData) => {
    const step = CHAT_FLOW[stepId];
    if (!step) return;

    setCurrentStepId(stepId);

    // If step asks for project type but it's already defined (from context), skip it
    if (stepId === 'check_project_type' && currentData.projectType && currentData.projectType !== '') {
         processStep('design_status', currentData);
         return;
    }
    
    // Bot Typing Effect
    setIsTyping(true);
    await new Promise(resolve => setTimeout(resolve, 600)); // typing delay
    setIsTyping(false);

    // Resolve Message (Function or String)
    const messageText = typeof step.message === 'function' ? step.message(currentData) : step.message;
    
    // Resolve Options (Dynamic or Static)
    let options = step.options;
    if (step.dynamicOptions) {
        options = step.dynamicOptions(currentData);
    }

    // Process Info type: Handle rendering to avoid duplication
    if (step.type === 'process-info') {
         // Add text FIRST
         addBotMessage(messageText, 'text', options);
         
         // Then Add the Card
         setTimeout(() => {
             addProcessInfoCard();
             // Auto advance logic
             setTimeout(() => {
                if(step.nextId) processStep(step.nextId, currentData);
             }, 5000); // Give time to read
         }, 800);
         return;
    }

    addBotMessage(messageText, step.type, options);

    // Focus input if needed and pre-fill if data exists (Review Mode)
    if (step.type === 'input') {
        if (step.key && currentData[step.key as keyof BudgetData]) {
            const val = currentData[step.key as keyof BudgetData];
            if (typeof val === 'string') {
                setInputValue(val);
            }
        } else {
            setInputValue('');
        }
        setTimeout(() => inputRef.current?.focus(), 100);
    } else {
        setInputValue('');
    }
  };

  const addBotMessage = (text: string | React.ReactNode, type: any = 'text', options?: ChatOption[]) => {
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      text,
      isUser: false,
      type,
      options
    }]);
  };

  const addUserMessage = (text: string) => {
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      text,
      isUser: true
    }]);
  };

  const addProcessInfoCard = () => {
      setMessages(prev => [...prev, {
          id: Date.now().toString(),
          text: '',
          isUser: false,
          type: 'process-info'
      }]);
  };

  // Interaction Handlers

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const currentStep = CHAT_FLOW[currentStepId];
    const value = inputValue;
    
    addUserMessage(value);
    setInputValue('');

    // Update Data
    const newData = { ...budgetData };
    if (currentStep.key) {
        // @ts-ignore
        newData[currentStep.key] = value;
        setBudgetData(newData);
    }

    // Move Next
    if (currentStep.nextId) {
        processStep(currentStep.nextId, newData);
    }
  };

  const handleOptionClick = (option: ChatOption) => {
      // Special Actions
      if (option.value === 'restart') {
          initializeChat();
          return;
      }
      
      // Handle Review/Correction Flow
      if (option.value === 'review') {
          // Keep the name, but reset other flow-determining fields to allow re-selection
          const dataToKeep = {
              name: budgetData.name,
              projectType: '', // Reset to allow changing project type
              designStatus: '',
              functionalities: [],
          };
          
          const newData = { ...INITIAL_BUDGET, ...dataToKeep };
          setBudgetData(newData);
          setMessages([]); // Clear chat history
          
          // Re-initiate flow but with kept name using the SPECIAL welcome_back step
          // This avoids the 'input' step of 'start' which caused the bug
          processStep('welcome_back', newData); 
          return;
      }

      if (option.value === 'finish') {
          const link = generateWhatsAppLink(budgetData);
          window.open(link, '_self');
          return;
      }

      addUserMessage(option.label);

      // Update Data
      const currentStep = CHAT_FLOW[currentStepId];
      const newData = { ...budgetData };
      
      // If the step updates a key
      if (currentStep.key) {
           // @ts-ignore
           newData[currentStep.key] = option.value;
      } 
      // Or if the option value itself implies the key (e.g. project types options often set projectType implicitly if logic required)
      else if (currentStepId === 'check_project_type') {
           newData.projectType = option.value;
      }

      setBudgetData(newData);

      // Determine Next Step
      // Option specific nextId takes precedence, then step default nextId
      const nextId = option.nextId || currentStep.nextId;
      
      if (nextId) {
          processStep(nextId, newData);
      }
  };

  const toggleMultiSelect = (value: string) => {
      setSelectedMultiOptions(prev => 
          prev.includes(value) 
            ? prev.filter(item => item !== value)
            : [...prev, value]
      );
  };

  const confirmMultiSelect = () => {
      const selections = selectedMultiOptions.length > 0 ? selectedMultiOptions : ['Básico'];
      const newData = { ...budgetData, functionalities: selections };
      setBudgetData(newData);
      
      addUserMessage(`Selecionados: ${selections.join(', ')}`);
      setSelectedMultiOptions([]);
      
      const currentStep = CHAT_FLOW[currentStepId];
      if (currentStep.nextId) {
          processStep(currentStep.nextId, newData);
      }
  };

  // Helper renderers
  const renderMessageText = (text: string | React.ReactNode) => {
    if (typeof text !== 'string') return text;
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={index} className="font-bold text-gray-900">{part.slice(2, -2)}</strong>;
        }
        return <span key={index}>{part}</span>;
    });
  };

  const currentStep = CHAT_FLOW[currentStepId];

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            // Ajuste para mobile: full height sem bordas arredondadas em baixo
            className="fixed bottom-0 md:bottom-24 right-0 md:right-8 z-[60] w-full md:w-[420px] h-[100dvh] md:h-[700px] bg-white md:rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden font-sans"
          >
            {/* Header */}
            <div className="bg-gray-900 p-4 flex justify-between items-center text-white shadow-md shrink-0 border-b border-gray-800">
              <div className="flex items-center gap-3">
                 <div className="bg-primary-600 text-white p-1.5 rounded-lg shadow-inner">
                    <Code2 size={20} />
                 </div>
                 <div>
                    <span className="font-display font-bold text-lg text-white tracking-tight leading-none">
                        PH<span className="text-primary-400">.bot</span>
                    </span>
                    <p className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5">
                        <ShieldAlert size={10} className="text-green-500"/> Online agora
                    </p>
                 </div>
              </div>
              <div className="flex gap-2">
                  <button onClick={initializeChat} className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full" title="Reiniciar conversa">
                    <RefreshCcw size={18} />
                  </button>
                  <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full">
                    <X size={24} />
                  </button>
              </div>
            </div>

            {/* Messages Area */}
            {/* Adicionado pb-safe para respeitar home indicator no iPhone e espaço extra para o input */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-5 scroll-smooth relative pb-32 md:pb-4">
              {messages.map((msg, index) => {
                  const isLastMessage = index === messages.length - 1;
                  
                  return (
                    <div key={msg.id} className={`flex flex-col ${msg.isUser ? 'items-end' : 'items-start'}`}>
                       <div className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'} max-w-[90%]`}>
                           {!msg.isUser && msg.type !== 'process-info' && (
                               <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-[10px] text-gray-600 font-bold mr-2 mt-auto shrink-0 select-none">AI</div>
                           )}
                          
                          {/* Bubble */}
                          {msg.type !== 'process-info' && (
                            <div className={`px-4 py-3 text-sm shadow-sm leading-relaxed whitespace-pre-wrap ${
                                msg.isUser 
                                ? 'bg-primary-600 text-white rounded-2xl rounded-br-sm' 
                                : 'bg-white text-gray-800 border border-gray-200 rounded-2xl rounded-bl-sm'
                            }`}>
                                {renderMessageText(msg.text)}
                            </div>
                          )}
                       </div>
                       
                       {/* Rich Content Types */}

                       {/* Process Card */}
                       {msg.type === 'process-info' && (
                           <motion.div 
                                initial={{opacity: 0, y: 10}}
                                animate={{opacity: 1, y: 0}}
                                className="ml-0 md:ml-8 mt-2 w-[95%] bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
                            >
                                <div className="bg-primary-50 p-3 border-b border-primary-100 flex justify-between items-center">
                                    <p className="text-xs font-bold text-primary-800 uppercase tracking-wider">Metodologia PH.Dev</p>
                                    <Clock size={12} className="text-primary-600"/>
                                </div>
                                <div className="p-4 space-y-4">
                                    {PROCESS_STEPS.map((step, i) => (
                                        <div key={step.id} className="flex gap-3 relative">
                                            {i !== PROCESS_STEPS.length - 1 && (
                                                <div className="absolute top-6 left-3 w-0.5 h-full bg-gray-100 -z-0"></div>
                                            )}
                                            <div className="bg-white border-2 border-primary-100 text-primary-600 font-bold w-6 h-6 rounded-full flex items-center justify-center text-[10px] shrink-0 z-10">
                                                {step.id}
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-gray-900">{step.title}</p>
                                                <p className="text-[10px] text-gray-500 leading-tight mt-0.5">{step.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                           </motion.div>
                       )}

                       {/* Standard Options */}
                       {!msg.isUser && msg.options && msg.type === 'options' && (
                           <div className="flex flex-wrap gap-2 mt-3 ml-8 max-w-[90%]">
                               {msg.options.map((opt, idx) => (
                                   <button
                                       key={idx}
                                       onClick={() => handleOptionClick(opt)}
                                       // Only clickable if it's the last message to prevent flow breaks (except finish/review)
                                       disabled={!isLastMessage && opt.value !== 'finish' && opt.value !== 'review'} 
                                       className="bg-white hover:bg-primary-50 hover:text-primary-700 hover:border-primary-300 text-gray-700 text-xs font-medium py-2.5 px-4 rounded-xl border border-gray-200 shadow-sm transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-left"
                                   >
                                       {opt.label}
                                   </button>
                               ))}
                           </div>
                       )}

                       {/* Summary Type */}
                       {!msg.isUser && msg.type === 'summary' && msg.options && (
                           <div className="mt-4 ml-8 flex flex-col gap-2 w-[85%]">
                                {msg.options.map((opt, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleOptionClick(opt)}
                                        className={`w-full py-3 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 ${
                                            opt.value === 'finish' 
                                            ? 'bg-green-600 text-white shadow-lg shadow-green-600/20 hover:bg-green-700' 
                                            : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:text-primary-600'
                                        }`}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                           </div>
                       )}

                       {/* Multi-Select Options */}
                       {!msg.isUser && msg.type === 'multi-select' && isLastMessage && msg.options && (
                           <div className="flex flex-col gap-2 mt-3 ml-8 w-[90%]">
                               <div className="bg-white rounded-xl border border-gray-200 p-2 shadow-sm">
                                   {msg.options.map((opt, idx) => {
                                       const isSelected = selectedMultiOptions.includes(opt.value);
                                       return (
                                           <button
                                               key={idx}
                                               onClick={() => toggleMultiSelect(opt.value)}
                                               className={`w-full flex items-center gap-3 p-3 rounded-lg text-sm transition-all border mb-1 last:mb-0 group ${
                                                   isSelected 
                                                    ? 'bg-primary-50 text-primary-900 font-medium border-primary-200' 
                                                    : 'bg-white hover:bg-gray-50 text-gray-700 border-transparent'
                                               }`}
                                           >
                                               {isSelected 
                                                   ? <div className="bg-primary-600 text-white rounded p-0.5"><CheckSquare size={16} /></div>
                                                   : <div className="text-gray-300 group-hover:text-primary-400 transition-colors"><Square size={18} /></div>
                                               }
                                               {opt.label}
                                           </button>
                                       );
                                   })}
                               </div>
                               <button 
                                   onClick={confirmMultiSelect}
                                   className="self-end mt-2 bg-primary-600 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-primary-700 flex items-center gap-2 shadow-lg shadow-primary-600/20 transition-all hover:-translate-y-0.5"
                               >
                                   Confirmar Seleção <ChevronRight size={16} />
                               </button>
                           </div>
                       )}
                    </div>
                  );
              })}

              {/* End of flow CTA - Success */}
              {currentStepId === 'end_success' && (
                  <motion.div initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}} className="p-4">
                      <button 
                        onClick={() => window.open(generateWhatsAppLink(budgetData), '_self')}
                        className="w-full bg-green-500 text-white font-bold py-4 rounded-xl shadow-xl shadow-green-500/30 flex items-center justify-center gap-2 animate-pulse hover:animate-none hover:bg-green-600 transition-colors"
                      >
                          <Send size={20} /> Abrir WhatsApp Agora
                      </button>
                  </motion.div>
              )}
              
              {isTyping && (
                <div className="flex justify-start ml-8">
                   <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm p-3 shadow-sm inline-flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                   </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area - Adjusted for mobile keyboard */}
            {currentStep && currentStep.type === 'input' && (
                <form onSubmit={handleInputSubmit} className="p-3 bg-white border-t border-gray-100 shrink-0 pb-safe">
                    <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-4 py-2 border border-gray-200 focus-within:border-primary-400 focus-within:ring-2 focus-within:ring-primary-100 transition-all">
                        <input
                            ref={inputRef}
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder={currentStep.inputPlaceholder || "Digite sua resposta..."}
                            className="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400 h-10"
                        />
                        <button 
                            type="submit" 
                            disabled={!inputValue.trim()}
                            className="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <Send size={18} />
                        </button>
                    </div>
                </form>
            )}
            
            {/* Footer */}
            <div className="py-2 bg-gray-50 text-center text-[10px] text-gray-400 border-t border-gray-100 shrink-0 flex items-center justify-center gap-2">
                <span className="flex items-center gap-1 font-medium"><Bot size={12} className="text-primary-500" /> Fluxo Automatizado de Atendimento</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button Container with Speech Bubble - HIDDEN ON MOBILE (Replaced by BottomNav) */}
      <div className={`hidden md:flex fixed right-4 md:right-8 z-40 flex-col items-end gap-3 pointer-events-none transition-all duration-500 ease-in-out ${shouldElevate ? 'bottom-36' : 'bottom-6'}`}>
          
          {/* Speech Bubble */}
          <AnimatePresence>
            {!isOpen && showTrigger && (
                <motion.div
                    initial={{ opacity: 0, y: 10, x: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.9 }}
                    className="bg-white px-4 py-3 rounded-2xl rounded-br-none shadow-xl border border-gray-100 mb-1 mr-2 relative max-w-[200px] pointer-events-auto cursor-pointer"
                    onClick={() => setIsOpen(true)}
                >
                    <p className="text-sm font-medium text-gray-800 leading-snug">
                        {activeTrigger}
                    </p>
                    
                    {/* Speech Bubble Tail */}
                    <div className="absolute -bottom-[6px] right-0 w-4 h-4 bg-white border-b border-r border-gray-100 transform rotate-45"></div>
                </motion.div>
            )}
          </AnimatePresence>

          {/* Main Button */}
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(!isOpen)}
            className="bg-gray-900 text-white p-4 rounded-full shadow-xl shadow-gray-900/30 hover:bg-gray-800 transition-colors group border-2 border-white/10 pointer-events-auto relative"
          >
            {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
            {!isOpen && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-primary-500 text-[10px] items-center justify-center font-bold text-white border border-white">1</span>
                </span>
            )}
          </motion.button>
      </div>
    </>
  );
};
