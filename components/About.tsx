
import React from 'react';
import { SKILLS, ABOUT_CONFIG, CONTACT_CONFIG } from '../config';
import { SectionTitle } from './SectionTitle';
import { motion } from 'framer-motion';
import { Button } from './Button';
import { ArrowRight, Download, Award, Code, Zap } from 'lucide-react';
import { ViewType } from '../types';
import { SmartText } from './SmartText';
import { SEO } from './SEO';

interface AboutProps {
  onNavigate: (view: ViewType) => void;
}

export const About: React.FC<AboutProps> = ({ onNavigate }) => {
  return (
    <section id="about" className="py-24 bg-gray-50 overflow-hidden">
      <SEO 
        title="Sobre PH | Engenheiro Frontend Sênior"
        description="Desenvolvedor com mais de 5 anos de experiência, especializado em React, TypeScript e Next.js. Foco em performance e arquitetura de software."
        breadcrumbs={[{ name: "Home", item: "/" }, { name: "Sobre", item: "/#about" }]}
      />

      <div className="container mx-auto px-4 md:px-8">
        
        <div className="flex flex-col xl:flex-row items-center gap-12 xl:gap-20">
          
          {/* Image Column (Left on Desktop) */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-full xl:w-[40%] flex justify-center"
          >
            <div className="relative group max-w-md w-full">
              {/* Decorative Frame Elements */}
              <div className="absolute -top-4 -left-4 w-full h-full border-2 border-primary-200 rounded-3xl z-0 transition-transform duration-500 group-hover:-translate-x-2 group-hover:-translate-y-2"></div>
              <div className="absolute -bottom-4 -right-4 w-full h-full bg-primary-100 rounded-3xl z-0 transition-transform duration-500 group-hover:translate-x-2 group-hover:translate-y-2"></div>
              
              {/* Main Image Container */}
              <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl shadow-primary-900/20 aspect-[3/4] bg-gray-200">
                <img 
                  src={ABOUT_CONFIG.IMAGE_URL} 
                  alt="PH - Frontend Developer" 
                  // INSTANT LOADING STRATEGY
                  loading="eager"
                  decoding="sync"
                  // @ts-ignore
                  fetchPriority="high"
                  width={400}
                  height={533}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* Floating Badge */}
                <div className="absolute bottom-6 right-6 bg-white/95 backdrop-blur-md px-4 py-3 rounded-xl shadow-lg border border-white/40 flex items-center gap-3">
                   <div className="bg-green-100 p-2 rounded-full text-green-600">
                      <Code size={20} />
                   </div>
                   <div>
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Experience</p>
                      <p className="text-sm font-bold text-gray-900">{ABOUT_CONFIG.EXPERIENCE_YEARS}</p>
                   </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Text Content (Right on Desktop) */}
          <div className="w-full xl:w-[60%]">
            <SectionTitle 
              title={ABOUT_CONFIG.TITLE} 
              subtitle={ABOUT_CONFIG.SUBTITLE}
              alignment="left"
            />
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="space-y-6 text-gray-600 text-lg leading-relaxed mb-10"
            >
              {ABOUT_CONFIG.PARAGRAPHS.map((paragraph, idx) => (
                <p key={idx}>
                  <SmartText>{paragraph}</SmartText>
                </p>
              ))}
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                 {ABOUT_CONFIG.HIGHLIGHTS.map((item, idx) => (
                   <div key={idx} className="flex items-start gap-4 p-4 bg-white border border-gray-100 rounded-xl hover:border-primary-200 transition-colors shadow-sm">
                      <div className="bg-primary-50 p-2.5 rounded-lg text-primary-600 shrink-0">
                        {idx === 0 ? <Award size={20} /> : <Zap size={20} />}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm">{item.title}</h4>
                        <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                      </div>
                   </div>
                 ))}
              </div>
            </motion.div>

            {/* Skills Section Integrated */}
            <div>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                Tech Stack Principal
                <div className="h-px bg-gray-200 flex-grow"></div>
              </h3>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                {SKILLS.map((skill, index) => (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 + 0.3 }}
                    whileHover={{ y: -3 }}
                    className="bg-white p-3 rounded-xl border border-gray-200 hover:border-primary-300 hover:shadow-md transition-all flex flex-col items-center justify-center gap-2 text-center h-24"
                  >
                    <skill.icon size={24} className={skill.color} strokeWidth={1.5} />
                    <span className="text-xs font-semibold text-gray-700">{skill.name}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="pt-10 flex gap-4">
                <Button 
                    onClick={() => onNavigate('services')}
                    rightIcon={<ArrowRight size={18} />}
                    className="shadow-xl shadow-primary-600/20"
                >
                    Ver Meus Serviços
                </Button>
                {/* Optional Resume Button */}
                <Button 
                    variant="ghost"
                    leftIcon={<Download size={18} />}
                    className="text-gray-500 hover:text-primary-600"
                    onClick={() => window.open(CONTACT_CONFIG.LINKEDIN_URL, '_blank')}
                >
                    LinkedIn
                </Button>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
