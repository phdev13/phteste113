
import React, { useEffect, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { ArrowLeft, Clock, Calendar, Share2, Layers, Zap, Search, Monitor, Server, TrendingUp, BookOpen, Quote, ChevronRight, Brain, CheckCircle2, Globe, Shield } from 'lucide-react';
import { ViewType } from '../types';
import { SmartText } from './SmartText';
import { Button } from './Button';
import { RealTimePerformanceDemo, AIArchitectureDemo, ResponsiveResizer } from './BlogInteractive';
import { AudioPlayer } from './AudioPlayer';
import { SEO } from './SEO';
import { SITE_CONFIG, CONTACT_CONFIG } from '../config';

interface BlogProps {
  onNavigate: (view: ViewType) => void;
}

// Texto consolidado para o leitor de áudio
const ARTICLE_TEXT = `
O que você não vê, você sente. 
Quando você entra em um carro de luxo, você não vê o motor ou a injeção eletrônica. Você sente o conforto do banco e a suavidade da direção. No digital, o Frontend é essa experiência.

Bastidores versus Palco.
Muitas empresas focam apenas em fazer o site funcionar, o Backend, mas esquecem de como ele parece e responde, o Frontend. O resultado é como um carro com um motor potente, mas com bancos de plástico duro.
O Backend é a cozinha. O Frontend é o salão. É onde o cliente interage. Se for ruim, ele vai embora, não importa quão boa seja a comida.

A Ciência da Velocidade.
Estudos mostram que 53% dos usuários abandonam um site que demora mais de 3 segundos para carregar. Não é apenas impaciência; é perda direta de dinheiro.
Observe no teste visual abaixo como a janela esquerda treme. Isso se chama Layout Shift. Isso frustra o usuário e é penalizado pelo Google.

Inteligência Artificial como Motor.
Eu não escrevo mais código do zero repetitivo. Utilizo IA para gerar a base estrutural com precisão matemática. Isso elimina erros humanos de digitação e acelera o processo em 10 vezes.
Isso libera meu tempo para o que realmente importa: O Refinamento Humano. Design, estratégia de conversão e segurança.
Ao contratar meus serviços, você não paga por horas gastas batendo tecla em código básico. Você investe em arquitetura de alto nível e estratégia.

Domínio e Hospedagem: O Terreno da sua Casa.
Imagine que seu site é uma casa de luxo. De nada adianta a casa ser linda se ela for construída em um pântano instável ou se o endereço for difícil de achar.
Domínio é o endereço. Hospedagem é o terreno. Eu utilizo redes de distribuição global, que são muito mais rápidas e seguras que hospedagens compartilhadas baratas. Todos os projetos já vêm com segurança SSL ativada.

Mobile First: Não é só encolher.
Muitos sites apenas espremem o conteúdo para caber no celular. Isso cria botões pequenos demais para clicar e textos difíceis de ler.
A verdadeira responsividade reorganiza a informação. O que é uma linha de 3 colunas no desktop vira uma lista vertical no celular.

Conclusão: O Código é um Ativo.
Um site mal feito é um passivo: gera custo de manutenção, perde vendas e mancha a marca. Um site bem engenheirado é um ativo: trabalha 24 horas por dia, converte visitantes em leads e posiciona sua marca como líder.
`;

export const Blog: React.FC<BlogProps> = ({ onNavigate }) => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const [activeSection, setActiveSection] = useState('intro');

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Otimização: Debounce no scroll listener para melhorar fluidez mobile
    // Fix: Using any instead of NodeJS.Timeout to avoid namespace error in non-Node environments
    let timeoutId: any;
    
    const handleScroll = () => {
      if (timeoutId) return;
      
      timeoutId = setTimeout(() => {
        const sections = ['intro', 'frontend-backend', 'performance', 'ai-revolution', 'hosting', 'mobile', 'conclusion'];
        const scrollPosition = window.scrollY + 300;

        for (const section of sections) {
          const element = document.getElementById(section);
          if (element && element.offsetTop <= scrollPosition) {
            setActiveSection(section);
          }
        }
        timeoutId = undefined!; // Reset
      }, 100); // 100ms debounce
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
        window.removeEventListener('scroll', handleScroll);
        clearTimeout(timeoutId);
    };
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copiado para a área de transferência.');
  };

  // --- SEO SCHEMA MARKUP (JSON-LD) ---
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${SITE_CONFIG.URL}/blog`
    },
    "headline": "O que você não vê, você sente: A importância da Engenharia de Frontend",
    "description": "Entenda como a engenharia de frontend, performance web e inteligência artificial impactam diretamente o lucro do seu negócio digital.",
    "image": [
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&h=630&auto=format&fit=crop"
    ],
    "author": {
      "@type": "Person",
      "name": "Philippe Boechat",
      "url": SITE_CONFIG.URL,
      "jobTitle": "Senior Frontend Engineer"
    },
    "publisher": {
      "@type": "Organization",
      "name": "PH Development",
      "logo": {
        "@type": "ImageObject",
        "url": `${SITE_CONFIG.URL}/favicon.svg`
      }
    },
    "datePublished": "2023-10-01T08:00:00+00:00",
    "dateModified": new Date().toISOString(),
    "articleSection": "Technology",
    "wordCount": "1200",
    "keywords": ["Frontend", "Performance", "React", "SEO", "Desenvolvimento Web"]
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-white pt-24 pb-20 font-sans text-gray-800"
    >
      <SEO 
        title="O que você não vê, você sente | Blog Técnico"
        description="Um mergulho técnico e estratégico sobre como a performance web e a engenharia de software moderna definem o sucesso ou fracasso de produtos digitais."
        type="article"
        schema={articleSchema}
        keywords={[
            "Engenharia de Software", 
            "Frontend vs Backend", 
            "Performance Web", 
            "Core Web Vitals", 
            "Inteligência Artificial no Código",
            "SEO Técnico",
            "Otimização de Sites"
        ]}
        image="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop"
        breadcrumbs={[{ name: "Home", item: "/" }, { name: "Blog", item: "/blog" }]}
      />

      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1.5 bg-gray-900 origin-left z-[60]"
        style={{ scaleX }}
      />

      <article className="max-w-screen-xl mx-auto px-4 md:px-8" itemScope itemType="https://schema.org/Article">
        
        {/* Navigation */}
        <div className="mb-12">
            <button 
              onClick={() => onNavigate('home')} 
              className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors group px-4 py-2 rounded-full hover:bg-gray-100"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
              Voltar ao Início
            </button>
        </div>

        {/* Hero Section */}
        <header className="max-w-4xl mx-auto text-center mb-12" id="intro">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gray-100 text-gray-800 text-xs font-bold uppercase tracking-wider mb-8"
            >
                <BookOpen size={14} /> Artigo Técnico
            </motion.div>
            <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-gray-900 leading-[1.1] mb-8 tracking-tight"
                itemProp="headline"
            >
                O que você não vê,<br/> <span className="text-gray-500">você sente.</span>
            </motion.h1>
            <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl md:text-2xl text-gray-500 leading-relaxed font-light max-w-2xl mx-auto mb-10"
                itemProp="description"
            >
                Um guia interativo sobre como a engenharia de código e a Inteligência Artificial impactam o lucro do seu negócio.
            </motion.p>
            
            {/* Meta Data */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500 border-t border-b border-gray-100 py-6 max-w-xl mx-auto">
                <div className="flex items-center gap-3" itemProp="author" itemScope itemType="https://schema.org/Person">
                    <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden ring-2 ring-white shadow-md">
                        <img src="https://i.imgur.com/TNMBi27.jpeg" alt="PH" className="w-full h-full object-cover" itemProp="image" />
                    </div>
                    <div className="text-left leading-tight">
                        <span className="block font-bold text-gray-900" itemProp="name">PH Development</span>
                        <span className="text-xs" itemProp="jobTitle">Engenheiro Sênior</span>
                    </div>
                </div>
                <div className="w-px h-8 bg-gray-200 mx-2 hidden sm:block"></div>
                <div className="flex gap-6">
                    <span className="flex items-center gap-2">
                        <Calendar size={14}/> 
                        <time dateTime="2023-10-01" itemProp="datePublished">{new Date().getFullYear()}</time>
                    </span>
                    <span className="flex items-center gap-2"><Clock size={14}/> 10 min de leitura</span>
                </div>
                <button onClick={copyToClipboard} className="ml-auto p-2 text-gray-400 hover:text-gray-900 transition-colors rounded-full hover:bg-gray-100" title="Compartilhar">
                    <Share2 size={18} />
                </button>
            </div>
        </header>

        {/* Feature Image */}
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="max-w-5xl mx-auto mb-16 rounded-3xl overflow-hidden shadow-2xl shadow-gray-200 relative aspect-[21/9] bg-gray-100"
        >
            <img 
                src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2400&auto=format&fit=crop" 
                alt="Digital Technology Visualization" 
                itemProp="image"
                // INSTANT LOADING CONFIG
                loading="eager"
                decoding="sync"
                // @ts-ignore
                fetchPriority="high"
                className="w-full h-full object-cover grayscale opacity-80 hover:grayscale-0 transition-all duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent"></div>
            <div className="absolute bottom-8 left-8 md:bottom-12 md:left-12 text-white">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-lg text-xs font-mono mb-3 border border-white/20">
                    <Zap size={12} className="text-yellow-400 fill-yellow-400" />
                    Alta Performance
                </div>
                <h2 className="text-2xl md:text-3xl font-bold max-w-lg leading-tight">Transformando complexidade técnica em resultados simples e mensuráveis.</h2>
            </div>
        </motion.div>

        {/* AUDIO PLAYER */}
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="max-w-3xl mx-auto px-4"
        >
            <AudioPlayer text={ARTICLE_TEXT} />
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-20 max-w-7xl mx-auto">
            
            {/* Sidebar (Sticky Table of Contents) */}
            <aside className="lg:w-64 shrink-0 hidden lg:block">
                <div className="sticky top-32">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                        <Layers size={14} /> Sumário
                    </h4>
                    <nav className="space-y-1 relative">
                        <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-200"></div>
                        
                        {[
                            { id: 'intro', label: 'Introdução' },
                            { id: 'frontend-backend', label: 'Bastidores vs. Palco' },
                            { id: 'performance', label: 'Velocidade e Lucro' },
                            { id: 'ai-revolution', label: 'Engenharia Aumentada' },
                            { id: 'hosting', label: 'Domínio & Hospedagem' },
                            { id: 'mobile', label: 'Adaptação Mobile' },
                            { id: 'conclusion', label: 'Conclusão' }
                        ].map((item) => (
                            <a 
                                key={item.id}
                                href={`#${item.id}`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className={`block pl-6 py-2 text-sm transition-all border-l-2 -ml-[1px] relative ${
                                    activeSection === item.id 
                                    ? 'border-gray-900 text-gray-900 font-bold' 
                                    : 'border-transparent text-gray-500 hover:text-gray-800'
                                }`}
                            >
                                {item.label}
                            </a>
                        ))}
                    </nav>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="prose prose-lg prose-slate max-w-3xl prose-headings:font-display prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary-600 prose-a:no-underline hover:prose-a:underline prose-img:rounded-3xl prose-strong:text-gray-900" itemProp="articleBody">
                
                <p className="lead text-xl md:text-2xl font-light leading-relaxed text-gray-600 mb-12">
                    Quando você entra em um carro de luxo, você não vê o motor ou a injeção eletrônica. Você sente o conforto do banco e a suavidade da direção. No digital, o Frontend é essa experiência.
                </p>

                {/* SECTION: FRONTEND VS BACKEND */}
                <div id="frontend-backend" className="scroll-mt-32 border-t border-gray-100 pt-12 mt-12">
                    <h2 className="text-3xl mb-6">Bastidores vs. Palco</h2>
                    <p>
                        Muitas empresas focam apenas em fazer o site "funcionar" (Backend), mas esquecem de como ele "parece" e "responde" (Frontend). O resultado é como um carro com um motor potente, mas com bancos de plástico duro.
                    </p>
                    <ul className="list-none pl-0 space-y-4 my-8">
                        <li className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0"><Server size={20}/></div>
                            <div>
                                <strong className="block text-gray-900">Backend (A Cozinha)</strong>
                                <span className="text-gray-600 text-sm">Banco de dados e lógica. Invisível ao cliente.</span>
                            </div>
                        </li>
                        <li className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center shrink-0"><Monitor size={20}/></div>
                            <div>
                                <strong className="block text-gray-900">Frontend (O Salão)</strong>
                                <span className="text-gray-600 text-sm">Onde o cliente interage. Se for ruim, ele vai embora, não importa quão boa seja a comida.</span>
                            </div>
                        </li>
                    </ul>
                </div>

                {/* SECTION: PERFORMANCE */}
                <div id="performance" className="scroll-mt-32 border-t border-gray-100 pt-12 mt-12">
                    <h2 className="text-3xl mb-6">A Ciência da Velocidade</h2>
                    <p>
                        Estudos mostram que 53% dos usuários abandonam um site que demora mais de 3 segundos para carregar. Não é apenas impaciência; é perda direta de dinheiro.
                    </p>
                    
                    <div className="bg-gray-50 border-l-4 border-gray-900 p-6 my-8 italic text-gray-700">
                        <Quote className="inline-block mr-2 text-gray-400 mb-2 transform rotate-180" size={20} />
                        Faça o teste visual abaixo. Simulei a diferença entre um site comum (cheio de plugins e código ruim) e um site otimizado com engenharia moderna.
                    </div>

                    {/* INTERACTIVE COMPONENT 1 - OPTIMIZED FOR MOBILE */}
                    <div className="not-prose">
                        <RealTimePerformanceDemo />
                    </div>
                    
                    <p className="text-sm text-gray-500 mt-4 text-center">
                        Observe como a "Janela Esquerda" treme (Layout Shift). Isso frustra o usuário e é penalizado pelo Google.
                    </p>
                </div>

                {/* SECTION: AI REVOLUTION */}
                <div id="ai-revolution" className="scroll-mt-32 border-t border-gray-100 pt-12 mt-12">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-purple-100 text-purple-700 rounded-lg"><Brain size={24}/></div>
                        <h2 className="text-3xl m-0">Inteligência Artificial como Motor</h2>
                    </div>
                    
                    <p>
                        Eu não escrevo mais código do zero repetitivo. Utilizo IA para gerar a base estrutural (boilerplate) com precisão matemática. Isso elimina erros humanos de digitação e acelera o processo em 10x.
                    </p>
                    <p>
                        Isso libera meu tempo para o que realmente importa: <strong>O Refinamento Humano</strong>. Design, estratégia de conversão e segurança.
                    </p>

                    {/* INTERACTIVE COMPONENT 2 */}
                    <div className="not-prose">
                        <AIArchitectureDemo />
                    </div>

                    <p>
                        Ao contratar meus serviços, você não paga por horas gastas "batendo tecla" em código básico. Você investe em arquitetura de alto nível e estratégia.
                    </p>
                </div>

                {/* SECTION: HOSTING */}
                <div id="hosting" className="scroll-mt-32 border-t border-gray-100 pt-12 mt-12">
                    <h2 className="text-3xl mb-6">Domínio & Hospedagem: O Terreno da sua Casa</h2>
                    <p>
                        Imagine que seu site é uma casa de luxo. De nada adianta a casa ser linda se ela for construída em um pântano instável (hospedagem ruim) ou se o endereço for difícil de achar (domínio confuso).
                    </p>
                    
                    <div className="grid md:grid-cols-2 gap-6 my-8 not-prose">
                        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                            <div className="flex items-center gap-3 mb-3">
                                <Globe className="text-blue-500" size={24} />
                                <h3 className="font-bold text-gray-900 text-lg">Domínio (O Endereço)</h3>
                            </div>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                É o "www.suaempresa.com.br". Ele é sua propriedade digital. Eu configuro tudo para que seja seu, registrado no seu CPF/CNPJ, garantindo sua titularidade.
                            </p>
                        </div>
                        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                            <div className="flex items-center gap-3 mb-3">
                                <Server className="text-purple-500" size={24} />
                                <h3 className="font-bold text-gray-900 text-lg">Hospedagem (O Terreno)</h3>
                            </div>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                Onde os arquivos do site ficam. Eu utilizo redes de distribuição global (Edge Network), que são muito mais rápidas e seguras que hospedagens compartilhadas baratas.
                            </p>
                        </div>
                    </div>

                    <div className="bg-green-50 p-6 rounded-xl border border-green-100 flex items-start gap-4">
                        <Shield className="text-green-600 mt-1 shrink-0" size={20} />
                        <div>
                            <h4 className="font-bold text-green-900 text-sm">Segurança SSL Inclusa</h4>
                            <p className="text-green-800 text-sm mt-1">
                                Todos os projetos que entrego já vêm com o "cadeado" de segurança (HTTPS) ativado, essencial para a confiança do cliente e para o Google.
                            </p>
                        </div>
                    </div>
                </div>

                {/* SECTION: MOBILE */}
                <div id="mobile" className="scroll-mt-32 border-t border-gray-100 pt-12 mt-12">
                    <h2 className="text-3xl mb-6">Mobile First: Não é só encolher</h2>
                    <p>
                        Muitos sites apenas "espremem" o conteúdo para caber no celular. Isso cria botões pequenos demais para clicar e textos difíceis de ler.
                    </p>
                    <p>
                        A verdadeira responsividade reorganiza a informação. O que é uma linha de 3 colunas no desktop vira uma lista vertical no celular.
                    </p>

                    {/* INTERACTIVE COMPONENT 3 */}
                    <div className="not-prose">
                        <ResponsiveResizer />
                    </div>
                </div>

                {/* SECTION: CONCLUSION */}
                <div id="conclusion" className="scroll-mt-32 border-t border-gray-100 pt-12 mt-12">
                    <h2 className="text-3xl mb-6">Conclusão: O Código é um Ativo</h2>
                    <p>
                        Um site mal feito é um passivo: gera custo de manutenção, perde vendas e mancha a marca. Um site bem engenheirado é um ativo: trabalha 24h por dia, converte visitantes em leads e posiciona sua marca como líder.
                    </p>
                </div>

                {/* Call to Action Box */}
                <div className="bg-gray-900 text-white p-8 md:p-14 rounded-[2.5rem] mt-20 not-prose text-center relative overflow-hidden shadow-2xl group">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-gray-800 rounded-full blur-[150px] opacity-50 pointer-events-none"></div>
                    
                    <div className="relative z-10">
                        <div className="inline-flex items-center justify-center p-3 bg-white/10 rounded-2xl mb-6 backdrop-blur-sm border border-white/10">
                            <TrendingUp size={32} className="text-white" />
                        </div>
                        <h3 className="text-3xl md:text-5xl font-display font-bold mb-6 tracking-tight">
                            Vamos construir o futuro?
                        </h3>
                        <p className="text-gray-300 text-lg md:text-xl mb-10 max-w-2xl mx-auto font-light leading-relaxed">
                            Una o melhor da engenharia humana com a potência da IA no seu próximo projeto.
                        </p>
                        <Button 
                            onClick={() => onNavigate('contact')} 
                            className="bg-white text-gray-900 hover:bg-gray-100 font-bold px-10 py-5 text-lg shadow-xl shadow-white/10 border-none rounded-2xl hover:scale-105 transition-transform"
                            rightIcon={<ChevronRight size={20} />}
                        >
                            Solicitar Proposta
                        </Button>
                    </div>
                </div>

            </div>
        </div>
      </article>
    </motion.div>
  );
};
