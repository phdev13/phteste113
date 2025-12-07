
import React from 'react';
import { LucideIcon } from 'lucide-react';

export type ViewType = 'home' | 'about' | 'services' | 'portfolio' | 'process' | 'contact' | 'zenith-demo' | 'aether-demo' | '404' | 'terms' | 'privacy' | 'blog';

export interface NavItem {
  label: string;
  id: ViewType;
}

export interface NavigationProps {
  currentView: ViewType;
  onNavigate: (view: ViewType) => void;
  onLogoClick?: () => void; // Optional trigger for Easter Egg
}

export interface Skill {
  name: string;
  icon: LucideIcon;
  color: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface ServicePackage {
  id: string;
  title: string;
  subtitle: string;
  purpose: string;
  features: string[];
  techStack: string[];
  price: string;
  icon: LucideIcon;
  recommendedFor: string;
  details: string;
  highlight?: boolean;
  // Detailed Page Fields
  fullDescription: string;
  deliverables: string[]; // What IS included
  notIncluded: string[];  // What is NOT included
  timeline: string;
  faqs: FAQ[];
}

export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  tags: string[];
  demoUrl: string;
  liveUrl?: string; 
  featured?: boolean;
  // Case Study Fields
  challenge?: string;
  solution?: string;
  result?: string;
}

export interface ProcessStep {
  id: number;
  title: string;
  description: string;
  checklist: string[];
  icon: LucideIcon;
}

// --- Chatbot Types ---

export interface ChatMessage {
  id: string;
  text: string | React.ReactNode;
  isUser: boolean;
  type?: 'text' | 'summary' | 'multi-select' | 'process-info' | 'options' | 'input';
  options?: ChatOption[];
}

export interface ChatOption {
  label: string;
  value: string;
  nextId?: string; // The ID of the next step in the flow
  action?: (data: any) => void;
}

export interface ChatStep {
  id: string;
  message: string | ((data: BudgetData) => string);
  type?: 'text' | 'input' | 'options' | 'multi-select' | 'process-info' | 'summary';
  options?: ChatOption[]; // Fixed options
  dynamicOptions?: (data: BudgetData) => ChatOption[]; // Dynamic options based on state
  nextId?: string; // Default next step if not option-based
  inputPlaceholder?: string; // For text input steps
  validation?: string | ((value: string) => boolean | { isValid: boolean; message?: string; cleaned?: string }); // Simple validation
  key?: keyof BudgetData; // The key in BudgetData to update
}

export interface BudgetData {
  name: string;
  projectType: string;
  designStatus: string;
  functionalities: string[];
  details: string;
  budgetRange?: string;
  contactMethod?: string;
  backendNeeds?: string;
  timeline?: string;
  referenceLinks?: string;
  targetAudience?: string;
  hasDomain?: string;
  hasHosting?: string;
  designFormat?: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  projectType: string;
  budget: string;
  message: string;
}

export interface ChatbotProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onNavigate: (view: ViewType) => void;
  contextService?: ServicePackage | null;
  extraElevation?: boolean;
}
