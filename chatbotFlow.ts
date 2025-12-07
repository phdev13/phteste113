
import { BudgetData, ChatStep } from './types';
import { WHATSAPP_NUMBER } from './constants';

// ═══════════════════════════════════════════════════════════════════════
// ESTADO INICIAL DO ORÇAMENTO
// ═══════════════════════════════════════════════════════════════════════

export const INITIAL_BUDGET: BudgetData = {
  name: '',
  projectType: '',
  designStatus: '',
  functionalities: [],
  details: '',
  budgetRange: '',
  contactMethod: '',
  backendNeeds: '',
  timeline: '',
  referenceLinks: '',
  targetAudience: '',
  hasDomain: '',
  hasHosting: ''
};

// ═══════════════════════════════════════════════════════════════════════
// FUNÇÕES DE VALIDAÇÃO E LIMPEZA
// ═══════════════════════════════════════════════════════════════════════

export const cleanName = (name: string): string => {
  return name
    .replace(/[^a-zA-ZÀ-ÿ\s\-']/g, '')
    .trim()
    .replace(/\s+/g, ' ');
};

export const validateName = (name: string): { isValid: boolean; cleaned: string; message?: string } => {
  const cleaned = cleanName(name);
  
  if (cleaned.length < 2) {
    return { isValid: false, cleaned, message: "Por favor, digite um nome com pelo menos 2 caracteres." };
  }
  
  if (cleaned.length > 50) {
    return { isValid: false, cleaned, message: "Nome muito longo. Por favor, use uma versão mais curta." };
  }
  
  if (cleaned !== name.trim()) {
    return { 
      isValid: true, 
      cleaned, 
      message: `Corrigi para: "${cleaned}". Está correto?` 
    };
  }
  
  return { isValid: true, cleaned };
};

export const validateUrls = (input: string): { isValid: boolean; cleaned: string; message?: string } => {
  const urlPattern = /(https?:\/\/[^\s]+)/g;
  const urls = input.match(urlPattern);
  
  if (!urls || urls.length === 0) {
    return { 
      isValid: false, 
      cleaned: input,
      message: "Não encontrei links válidos. Certifique-se de incluir http:// ou https://" 
    };
  }
  
  return { isValid: true, cleaned: urls.join('\n') };
};

// ═══════════════════════════════════════════════════════════════════════
// GERADOR DE MENSAGEM PARA WHATSAPP (TEMPLATE PROFISSIONAL)
// ═══════════════════════════════════════════════════════════════════════

export const generateWhatsAppLink = (data: BudgetData) => {
  const line = '━━━━━━━━━━━━━━━━━━━━━━━━━━';
  const sectionSpace = '\n\n';
  
  // Header
  let message = `🎯 *NOVO LEAD - BRIEFING COMPLETO*\n${line}\n`;
  
  // Seção 1: Identificação do Cliente
  message += `\n📋 *DADOS DO CLIENTE*\n`;
  message += `┃ 👤 Nome: *${data.name}*\n`;
  message += `┃ 🎯 Público-Alvo: ${data.targetAudience || 'Não especificado'}\n`;
  message += `┃ 📞 Via: Portfolio Chat\n`;
  
  // Seção 2: Detalhes do Projeto
  message += `${sectionSpace}${line}\n`;
  message += `\n💼 *ESCOPO DO PROJETO*\n`;
  message += `┃ 📦 Pacote: *${data.projectType}*\n`;
  message += `┃ 🎨 Design: ${data.designStatus}\n`;
  message += `┃ ⏰ Prazo Desejado: ${data.timeline}\n`;
  message += `┃ 💰 Budget: *${data.budgetRange}*\n`;
  
  // Seção 3: Funcionalidades Solicitadas
  message += `${sectionSpace}${line}\n`;
  message += `\n⚙️ *FUNCIONALIDADES REQUISITADAS*\n`;
  
  if (data.functionalities.length > 0) {
    data.functionalities.forEach(func => {
      message += `┃ ✅ ${func}\n`;
    });
  } else {
    message += `┃ 📌 Funcionalidades padrão do pacote\n`;
  }
  
  // Seção 4: Infraestrutura & Recursos
  message += `${sectionSpace}${line}\n`;
  message += `\n🌐 *INFRAESTRUTURA*\n`;
  message += `┃ 🔗 Domínio: ${data.hasDomain === 'Yes' ? '✅ Cliente possui' : '❌ Precisa adquirir'}\n`;
  message += `┃ 🖥️ Hospedagem: ${data.hasHosting === 'Yes' ? '✅ Cliente possui' : '❌ Precisa contratar'}\n`;
  
  if (data.referenceLinks) {
    message += `${sectionSpace}${line}\n`;
    message += `\n🔗 *REFERÊNCIAS VISUAIS*\n`;
    const links = data.referenceLinks.split('\n').filter(l => l.trim());
    links.forEach(link => {
      message += `┃ 🌐 ${link}\n`;
    });
  }
  
  // Seção 5: Observações Adicionais
  if (data.details && data.details.trim() !== '') {
    message += `${sectionSpace}${line}\n`;
    message += `\n📝 *OBSERVAÇÕES DO CLIENTE*\n`;
    message += `┃ ${data.details}\n`;
  }
  
  // Footer
  message += `${sectionSpace}${line}\n`;
  message += `\n✅ *Cliente ciente:*\n`;
  message += `┃ • Sinal de 50% para início\n`;
  message += `┃ • Foco em Frontend/UI\n`;
  message += `┃ • Restante na entrega\n`;
  message += `\n📅 Lead capturado: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}\n`;
  
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
};

// ═══════════════════════════════════════════════════════════════════════
// FLUXO DE CONVERSA PROFISSIONAL
// ═══════════════════════════════════════════════════════════════════════

export const CHAT_FLOW: Record<string, ChatStep> = {
  
  start: {
    id: 'start',
    message: (data) => data.name 
      ? `Olá novamente, ${data.name}! 👋\n\nVamos reiniciar o processo para ajustar o que você precisa.\n\nComo posso te ajudar desta vez?`
      : "👋 Olá! Seja bem-vindo(a)!\n\nSou o assistente virtual do PH Development.\n\nVou te guiar por um briefing rápido e inteligente para entender exatamente o que você precisa.\n\nComo posso te chamar?",
    type: 'input',
    inputPlaceholder: "Digite seu nome completo",
    key: 'name',
    nextId: 'select_package',
    validation: 'name'
  },
  
  start_context: {
    id: 'start_context',
    message: (data) => `👋 Olá! Que bom ver você por aqui!\n\nVi que você demonstrou interesse no pacote ${data.projectType}.\n\nÓtima escolha! Vamos personalizar tudo para você.\n\nPrimeiro, qual é o seu nome?`,
    type: 'input',
    inputPlaceholder: "Digite seu nome completo",
    key: 'name',
    nextId: 'select_package',
    validation: 'name'
  },
  
  welcome_back: {
    id: 'welcome_back',
    message: (data) => `Olá novamente, ${data.name}! 👋\n\nVamos reiniciar para ajustar o que você precisa.\n\nQual solução se encaixa melhor agora?`,
    type: 'options',
    options: [
      { label: '🚀 Landing Page Express', value: 'Landing Page Express', nextId: 'methodology_intro' },
      { label: '💼 Site Profissional', value: 'Site Profissional', nextId: 'methodology_intro' },
      { label: '🛠️ Projeto Sob Medida', value: 'Projeto Sob Medida', nextId: 'methodology_intro' }
    ],
    key: 'projectType'
  },

  select_package: {
    id: 'select_package',
    message: (data) => {
      if (data.projectType && data.projectType !== '' && !data.name) {
        return `Prazer, ${data.name}! 🤝\n\n📦 CONFIRMAÇÃO DE PACOTE\n\nVocê está interessado(a) no pacote ${data.projectType}, correto?\n\nSe quiser mudar, basta selecionar outra opção abaixo.`;
      }
      return `Prazer, ${data.name}! 🤝\n\n📦 ESCOLHA O PACOTE IDEAL\n\nQual solução se encaixa melhor no seu projeto?\n\n🔸 Landing Page Express — Páginas de conversão rápidas (7-10 dias)\n🔸 Site Profissional — Sites institucionais completos (15-20 dias)\n🔸 Projeto Sob Medida — Soluções customizadas (Frontend)`;
    },
    type: 'options',
    options: [
      { label: '🚀 Landing Page Express', value: 'Landing Page Express', nextId: 'methodology_intro' },
      { label: '💼 Site Profissional', value: 'Site Profissional', nextId: 'methodology_intro' },
      { label: '🛠️ Projeto Sob Medida', value: 'Projeto Sob Medida', nextId: 'methodology_intro' }
    ],
    key: 'projectType'
  },
  
  methodology_intro: {
    id: 'methodology_intro',
    message: "Ótima escolha! 🚀\n\nAntes de continuarmos com os detalhes, é importante que você conheça como eu trabalho.\n\nPrezo muito pela transparência e organização.",
    type: 'process-info',
    nextId: 'define_audience'
  },

  define_audience: {
    id: 'define_audience',
    message: "🎯 PÚBLICO-ALVO\n\nPara quem estamos criando esse projeto?\n\nIsso me ajuda a entender o tom, estilo e funcionalidades ideais.",
    type: 'input',
    inputPlaceholder: "Ex: Clientes finais, Empresas B2B, Pacientes de clínica...",
    key: 'targetAudience',
    nextId: 'design_approach'
  },

  design_approach: {
    id: 'design_approach',
    message: "🎨 VISUAL & IDENTIDADE\n\nComo estamos em relação ao design do projeto?",
    type: 'options',
    key: 'designStatus',
    options: [
      { 
        label: '🔗 Tenho sites de referência', 
        value: 'Possui Referências', 
        nextId: 'collect_references' 
      },
      { 
        label: '✨ Preciso de criação completa', 
        value: 'Criação do Zero', 
        nextId: 'select_features' 
      },
      { 
        label: '📋 Ainda não defini', 
        value: 'Indefinido', 
        nextId: 'select_features' 
      }
    ]
  },

  collect_references: {
    id: 'collect_references',
    message: "🔗 REFERÊNCIAS VISUAIS\n\nPerfeito! Cole aqui os links dos sites que você gostou.\n\nPode ser pelo design, cores, layout ou funcionalidades.",
    type: 'input',
    inputPlaceholder: "https://exemplo1.com, https://exemplo2.com",
    key: 'referenceLinks',
    nextId: 'select_features',
    validation: 'urls'
  },

  select_features: {
    id: 'select_features',
    message: "⚙️ FUNCIONALIDADES ESSENCIAIS\n\nSelecione tudo que é fundamental para o sucesso do projeto:\n\nEscolha quantas quiser. As opções variam de acordo com o pacote selecionado.",
    type: 'multi-select',
    key: 'functionalities',
    nextId: 'define_timeline',
    dynamicOptions: (data) => {
      const baseFeatures = [
        { label: '📱 Design Responsivo (Mobile/Tablet/Desktop)', value: 'Design Responsivo' },
        { label: '⚡ Performance Otimizada', value: 'Performance Otimizada' },
        { label: '🔍 SEO Básico', value: 'SEO Básico' },
        { label: '💬 Botão WhatsApp', value: 'Botão WhatsApp' }
      ];
      
      if (data.projectType === 'Landing Page Express') {
        return [
          ...baseFeatures,
          { label: '📝 Formulário de Captura', value: 'Formulário de Captura' },
          { label: '🖼️ Galeria de Imagens', value: 'Galeria de Imagens' },
          { label: '📍 Google Maps', value: 'Google Maps' },
          { label: '🌙 Modo Escuro', value: 'Modo Escuro' },
          { label: '🎬 Vídeos Integrados', value: 'Vídeos Integrados' }
        ];
      }

      if (data.projectType === 'Site Profissional') {
        return [
          ...baseFeatures,
          { label: '📄 Múltiplas Páginas', value: 'Múltiplas Páginas' },
          { label: '📮 Formulário de Contato', value: 'Formulário de Contato' },
          { label: '📰 Seção Blog/Notícias', value: 'Seção Blog' },
          { label: '🖼️ Portfólio/Galeria', value: 'Portfólio' },
          { label: '🔗 Links Redes Sociais', value: 'Links Sociais' },
          { label: '🌙 Modo Escuro', value: 'Modo Escuro' }
        ];
      }
      
      // Projeto Sob Medida (Cleaned up advanced backend features)
      return [
        ...baseFeatures,
        { label: '📄 Componentes React Custom', value: 'Componentes Custom' },
        { label: '🎯 Filtros de Conteúdo', value: 'Filtros' },
        { label: '💬 Modais & Popups', value: 'Modais Personalizados' },
        { label: '🌙 Modo Escuro', value: 'Modo Escuro' },
        { label: '💾 Entrega de Código Fonte', value: 'Código Fonte' }
      ];
    }
  },

  define_timeline: {
    id: 'define_timeline',
    message: "⏰ PRAZO DE ENTREGA\n\nQuando você precisa do projeto finalizado?",
    type: 'options',
    key: 'timeline',
    options: [
      { 
        label: '🔥 Urgente (7 dias)', 
        value: 'Urgente (7 dias)', 
        nextId: 'check_domain' 
      },
      { 
        label: '📅 Normal (15-20 dias)', 
        value: 'Normal (15-20 dias)', 
        nextId: 'check_domain' 
      },
      { 
        label: '⏳ Flexível (sem pressa)', 
        value: 'Flexível', 
        nextId: 'check_domain' 
      }
    ]
  },

  check_domain: {
    id: 'check_domain',
    message: "🌐 DOMÍNIO\n\nVocê já possui um domínio registrado?\n\n(Ex: seusite.com.br)",
    type: 'options',
    key: 'hasDomain',
    options: [
      { label: '✅ Sim, já tenho', value: 'Yes', nextId: 'check_hosting' },
      { label: '❌ Não, vou precisar de um', value: 'No', nextId: 'check_hosting' }
    ]
  },

  check_hosting: {
    id: 'check_hosting',
    message: "🖥️ HOSPEDAGEM\n\nE quanto à hospedagem (servidor)?\n\nObs: Entrego os arquivos para você subir, mas posso orientar.",
    type: 'options',
    key: 'hasHosting',
    options: [
      { label: '✅ Já tenho', value: 'Yes', nextId: 'define_budget' },
      { label: '❌ Vou precisar contratar', value: 'No', nextId: 'define_budget' }
    ]
  },

  define_budget: {
    id: 'define_budget',
    message: "💰 INVESTIMENTO\n\nQual sua expectativa de investimento para este projeto?\n\nIsso me ajuda a criar uma proposta adequada ao seu orçamento.",
    type: 'options',
    key: 'budgetRange',
    options: [
      { label: 'Até R$ 1.500', value: 'Até R$ 1.500', nextId: 'additional_details' },
      { label: 'R$ 1.500 - R$ 3.000', value: 'R$ 1.500 - R$ 3.000', nextId: 'additional_details' },
      { label: 'R$ 3.000 - R$ 6.000', value: 'R$ 3.000 - R$ 6.000', nextId: 'additional_details' },
      { label: 'Acima de R$ 6.000', value: 'Acima de R$ 6.000', nextId: 'additional_details' },
      { label: 'Prefiro discutir', value: 'A definir', nextId: 'additional_details' }
    ]
  },

  additional_details: {
    id: 'additional_details',
    message: "📝 INFORMAÇÕES EXTRAS (Opcional)\n\nTem algum detalhe importante que não perguntei?\n\nExemplos: Cores da marca, concorrentes, etc.\n\nDeixe em branco se não houver nada a acrescentar.",
    type: 'input',
    inputPlaceholder: "Ex: Gosto do estilo minimalista...",
    key: 'details',
    nextId: 'show_summary'
  },

  show_summary: {
    id: 'show_summary',
    message: (data) => {
      const divider = '━━━━━━━━━━━━━━━━';
      
      let summary = `📋 RESUMO DO SEU PROJETO\n${divider}\n\n`;
      
      // Dados do Cliente
      summary += `👤 CLIENTE\n`;
      summary += `• Nome: ${data.name}\n`;
      summary += `• Público: ${data.targetAudience || 'Não especificado'}\n\n`;
      
      // Detalhes do Projeto
      summary += `💼 PROJETO\n`;
      summary += `• Pacote: ${data.projectType}\n`;
      summary += `• Design: ${data.designStatus}\n`;
      summary += `• Prazo: ${data.timeline}\n`;
      summary += `• Budget: ${data.budgetRange}\n\n`;
      
      // Funcionalidades
      summary += `⚙️ FUNCIONALIDADES\n`;
      if (data.functionalities.length > 0) {
        data.functionalities.forEach(func => {
          summary += `• ${func}\n`;
        });
      } else {
        summary += `• Padrão do pacote\n`;
      }
      summary += `\n`;
      
      // Infraestrutura
      summary += `🌐 INFRAESTRUTURA\n`;
      summary += `• Domínio: ${data.hasDomain === 'Yes' ? '✅ Possui' : '❌ Precisa adquirir'}\n`;
      summary += `• Hospedagem: ${data.hasHosting === 'Yes' ? '✅ Possui' : '❌ Precisa contratar'}\n`;
      
      // Observações
      if (data.details && data.details.trim()) {
        summary += `\n📝 OBSERVAÇÕES\n`;
        summary += `${data.details}\n`;
      }
      
      summary += `\n${divider}\n`;
      summary += `\n⚠️ Importante: Para garantir a reserva da data e início do desenvolvimento, trabalhamos com um **sinal de 50%**. O restante é pago apenas na entrega.\n\n`;
      summary += `Está tudo correto?`;
      
      return summary;
    },
    type: 'summary',
    options: [
      { label: '✅ Sim, enviar para WhatsApp', value: 'finish', nextId: 'finalize' },
      { label: '🔄 Revisar / Corrigir algo', value: 'review', nextId: 'start' }
    ]
  },

  finalize: {
    id: 'finalize',
    message: "🎉 Perfeito!\n\nVocê será redirecionado para o WhatsApp em instantes.\n\nLá eu envio:\n• Proposta comercial detalhada\n• Formas de pagamento do sinal\n• Próximos passos do projeto\n\nAté já, e obrigado pela confiança! 🚀",
    type: 'text',
    nextId: ''
  }
};
