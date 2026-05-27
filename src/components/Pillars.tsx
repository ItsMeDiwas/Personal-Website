"use client";

import { motion } from "framer-motion";
import { Cpu, Briefcase, Globe } from "lucide-react";

interface PillarCard {
  id: number;
  label: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  glowColor: string;
  borderColor: string;
}

const pillars: PillarCard[] = [
  {
    id: 1,
    label: "01 // COGNITIVE ARCHITECTURE",
    title: "AI & Engineered Intelligence",
    description: "Building smart AI tools and reliable backend software. I create custom AI agents, connect large language models (LLMs), and build fast APIs to automate daily tasks and make workflows much more efficient.",
    icon: Cpu,
    glowColor: "group-hover:bg-blue-500/10",
    borderColor: "group-hover:border-blue-500/30",
  },
  {
    id: 2,
    label: "02 // TECHNICAL LEADERSHIP",
    title: "Technical Program Leadership",
    description: "Leading technical teams to build and ship products on time. I plan project schedules, manage resource budgets, coordinate agile engineering tasks, and keep stakeholders fully aligned throughout the process.",
    icon: Briefcase,
    glowColor: "group-hover:bg-sky-500/10",
    borderColor: "group-hover:border-sky-500/30",
  },
  {
    id: 3,
    label: "03 // ENTERPRISE OPERATIONS",
    title: "Macro Infrastructure & Logistics",
    description: "Coordinating complex facility setups and logistics. I organize supply resources, manage vendor agreements, layout workspace designs, and manage training programs to help local community members grow.",
    icon: Globe,
    glowColor: "group-hover:bg-purple-500/10",
    borderColor: "group-hover:border-purple-500/30",
  },
];

export default function Pillars() {
  return (
    <section className="relative w-full bg-[#121212] px-6 py-32 md:px-16 lg:px-24 border-t border-white/5 overflow-hidden z-20">
      {/* Background Ambience */}
      <div className="glow-bg w-[400px] h-[400px] bg-blue-500/5 -top-20 right-20" />
      <div className="glow-bg w-[300px] h-[300px] bg-purple-500/5 bottom-20 left-10" />

      {/* Header Container */}
      <div className="max-w-7xl mx-auto mb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col animate-once"
        >
          <span className="text-xs font-mono tracking-[0.4em] uppercase text-[#94A3B8] mb-3">
            02 // THE OPERATIONAL EDGE
          </span>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white leading-tight">
            Core Pillars of Execution
          </h2>
          <div className="w-24 h-[1px] bg-gradient-to-r from-blue-500 to-transparent mt-6" />
        </motion.div>
      </div>

      {/* Pillars Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {pillars.map((pillar, index) => {
          const Icon = pillar.icon;
          return (
            <motion.div
              key={pillar.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.15, ease: "easeOut" }}
              className={`group glass-card rounded-2xl p-8 md:p-10 flex flex-col h-full relative overflow-hidden border border-white/5 transition-all duration-500 ${pillar.borderColor}`}
            >
              {/* Card Radial Hover Glow Background Effect */}
              <div className={`absolute -right-16 -top-16 w-36 h-36 rounded-full bg-white/0 filter blur-xl transition-all duration-500 group-hover:scale-150 ${pillar.glowColor}`} />

              {/* CARD 2 ONLY: Default-visible soft blue radial background glow overlay to the top right corner */}
              {pillar.id === 2 && (
                <div className="absolute -right-6 -top-6 w-28 h-28 rounded-full bg-[#38BDF8]/10 filter blur-xl pointer-events-none z-0 transition-transform duration-500 group-hover:scale-125" />
              )}

              <div className="flex items-center justify-between mb-8 z-10">
                <span className="text-[10px] font-mono tracking-[0.25em] text-[#94A3B8] font-semibold uppercase">
                  {pillar.label}
                </span>
                <div className={`p-3 bg-white/5 rounded-xl border border-white/5 transition-all duration-300 ${
                  pillar.id === 2 
                    ? "text-[#38BDF8] bg-[#38BDF8]/5 border-[#38BDF8]/10 group-hover:text-white group-hover:bg-[#38BDF8]/20 group-hover:scale-110" 
                    : "text-neutral-400 group-hover:text-white group-hover:bg-white/10 group-hover:scale-110"
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              {/* CARD 2 ONLY: Styled Title in energetic default Tech Blue accent (#38BDF8) */}
              <h3 className={`text-2xl font-bold mb-4 transition-colors duration-300 z-10 ${
                pillar.id === 2 
                  ? "text-[#38BDF8] group-hover:text-white" 
                  : "text-white group-hover:text-blue-400"
              }`}>
                {pillar.title}
              </h3>
              
              <p className="text-neutral-400 font-light text-sm md:text-base leading-relaxed flex-grow z-10">
                {pillar.description}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
