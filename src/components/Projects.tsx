"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Mail, Compass, Shield, HelpCircle, Phone } from "lucide-react";
import Image from "next/image";

interface StarNarrative {
  situation: string;
  action: string;
  result: string;
}

interface Project {
  id: string;
  title: string;
  category: string;
  metric: string;
  metricLabel: string;
  star: StarNarrative;
  image: string;
  tags: string[];
  link: string;
}

const projects: Project[] = [
  {
    id: "ai-operations",
    title: "AI Workflow Automation",
    category: "ADVANCED TECH & AI",
    metric: "40% faster tasks",
    metricLabel: "Increased Efficiency",
    star: {
      situation: "Our team faced a bottleneck in data processing and scheduling, causing delays.",
      action: "Replaced manual processes with a multi-agent AI system and streamlined the team workflow.",
      result: "Routine work is now 80% automated, reducing total task time by 40% and cutting project delivery times."
    },
    image: "/images/project_aether.png",
    tags: ["AI Agents", "Workflows", "Automation"],
    link: "#",
  },
  {
    id: "infrastructure-logistics",
    title: "Tech Learning Hub",
    category: "COMMUNITY PROJECT & LOGISTICS",
    metric: "2 Weeks ahead",
    metricLabel: "Project on Track",
    star: {
      situation: "The community needed a modern space for tech education but had no central facility.",
      action: "Managed the construction, including design, planning, and coordination with global partners.",
      result: "Completed construction ahead of schedule, providing a space for over 5,000 members."
    },
    image: "/images/project_halcyon.png",
    tags: ["Construction", "Logistics", "Operations"],
    link: "#",
  },
  {
    id: "socio-economic-programs",
    title: "Digital Upskilling",
    category: "SKILLS TRAINING PROGRAM",
    metric: "80% got jobs",
    metricLabel: "Placement Rate",
    star: {
      situation: "A lack of digital skills training in the local market limited employment opportunities for youth.",
      action: "Developed a comprehensive curriculum for modern tech skills and digital work.",
      result: "Trained over 1,200 specialists with an 80% direct employment placement rate in modern jobs."
    },
    image: "/images/project_nova.png",
    tags: ["Upskilling", "Education", "Vocational"],
    link: "#",
  },
];

export default function Projects() {
  return (
    <section className="relative w-full min-h-screen bg-[#121212] px-6 py-32 md:px-16 lg:px-24 border-t border-white/5 overflow-hidden z-20">
      {/* Dynamic Background Glows */}
      <div className="glow-bg w-[400px] h-[400px] bg-blue-500/5 -top-20 -left-20" />
      <div className="glow-bg w-[400px] h-[400px] bg-purple-500/5 -bottom-20 -right-20" />

      {/* Header Container */}
      <div className="max-w-7xl mx-auto mb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col text-left"
        >
          <span className="text-xs font-mono tracking-[0.4em] uppercase text-[#94A3B8] mb-3">
            03 // METRICS & METALS
          </span>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white leading-tight">
            Featured Impact
          </h2>
          <div className="w-24 h-[1px] bg-gradient-to-r from-blue-500 to-transparent mt-6" />
        </motion.div>
      </div>

      {/* Projects Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 mb-32">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: index * 0.15, ease: "easeOut" }}
            className="group rounded-2xl overflow-hidden flex flex-col h-full bg-[#0D0D11]/90 border border-white/5 backdrop-blur-xl transition-all duration-500 hover:border-white/10 hover:bg-[#0D0D11]/95"
          >
            {/* Visual Preview Container */}
            <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-white/5">
              <Image
                src={project.image}
                alt={project.title}
                fill
                priority={index === 0}
                className="object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out brightness-[0.7] group-hover:brightness-[0.8] transition-all"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-50" />
            </div>

            {/* Description & Metadata Card */}
            <div className="p-8 flex flex-col flex-grow">
              <span className="text-[9px] font-mono tracking-[0.25em] text-[#94A3B8] font-semibold mb-2 uppercase block text-left">
                {project.category}
              </span>
              <h3 className="text-2xl font-bold text-white mb-6 group-hover:text-blue-400 transition-colors duration-300 flex items-center justify-between text-left">
                {project.title}
                <ArrowUpRight className="w-5 h-5 text-neutral-500 group-hover:text-blue-400 transition-colors group-hover:translate-x-0.5 group-hover:-translate-y-0.5 duration-300 animate-none" />
              </h3>

              {/* Metric Spotlight Banner */}
              <div className="mb-6 px-4 py-3.5 bg-white/[0.02] border border-white/5 rounded-xl flex items-center gap-4 text-left">
                <span className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 font-sans tracking-tight">
                  {project.metric}
                </span>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#94A3B8] font-medium">
                  {project.metricLabel}
                </span>
              </div>

              {/* STAR Timeline */}
              <div className="flex flex-col gap-6 relative pl-4 border-l border-white/10 flex-grow mb-8 text-left">
                {/* S - Situation */}
                <div className="relative">
                  <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-blue-500 border-2 border-[#121212]" />
                  <span className="text-[9px] font-mono tracking-wider text-blue-400 uppercase block mb-1 font-semibold">
                    S // Situation
                  </span>
                  <p className="text-[#94A3B8] font-light text-[13px] leading-relaxed">
                    {project.star.situation}
                  </p>
                </div>
                
                {/* A - Action */}
                <div className="relative">
                  <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-indigo-400 border-2 border-[#121212]" />
                  <span className="text-[9px] font-mono tracking-wider text-indigo-400 uppercase block mb-1 font-semibold">
                    A // Action
                  </span>
                  <p className="text-[#94A3B8] font-light text-[13px] leading-relaxed">
                    {project.star.action}
                  </p>
                </div>
                
                {/* R - Result */}
                <div className="relative">
                  <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-purple-400 border-2 border-[#121212]" />
                  <span className="text-[9px] font-mono tracking-wider text-purple-400 uppercase block mb-1 font-semibold">
                    R // Result
                  </span>
                  <p className="text-[#94A3B8] font-medium text-[13px] leading-relaxed">
                    {project.star.result}
                  </p>
                </div>
              </div>

              {/* Badges Stack */}
              <div className="flex flex-wrap gap-2 mt-auto">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[9px] font-mono font-medium px-2.5 py-1 bg-white/5 border border-white/5 text-[#94A3B8] rounded-md"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* SECTION 4: THE CLOSING (Call to Action / Footer) */}
      <div className="max-w-6xl mx-auto border-t border-white/5 pt-24 pb-12 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center w-full"
        >
          <span className="text-[10px] font-mono tracking-[0.4em] uppercase text-[#94A3B8] mb-4">
            04 // THE CLOSING
          </span>
          <h3 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight leading-tight max-w-3xl">
            Bridging deep cognitive AI engineering with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 font-light italic">certified IT program management at scale.</span>
          </h3>
          <p className="text-[#94A3B8] font-light text-sm max-w-lg mb-10 leading-relaxed">
            Let’s move the needle from technical theory to high-performance operational reality. Let&apos;s build the next operational standard.
          </p>

          {/* Elegant Glow CTA Button - bound directly to diwasrathour@gmail.com */}
          <a
            href="mailto:diwasrathour@gmail.com"
            className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs tracking-wider uppercase rounded-full shadow-[0_0_30px_rgba(59,130,246,0.25)] hover:shadow-[0_0_40px_rgba(59,130,246,0.45)] transition-all duration-300 flex items-center gap-2.5 group mb-24 cursor-pointer"
          >
            Initiate Conversation
            <Mail className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-300" />
          </a>

          {/* Clean Contact Metadata Grid (Web Strategist Blueprint) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full border-t border-white/5 pt-12 text-left max-w-5xl">
            
            {/* System Status */}
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#94A3B8] font-semibold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                System Status
              </span>
              <p className="text-xs font-light text-[#94A3B8] leading-relaxed">
                Active / Available for select strategic programs
              </p>
            </div>

            {/* Secure Endpoints */}
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#94A3B8] font-semibold">
                Secure Endpoints
              </span>
              <div className="flex flex-col gap-1.5">
                <a href="mailto:diwasrathour@gmail.com" className="text-xs font-light text-neutral-400 hover:text-white transition-colors duration-200 flex items-center gap-1.5 w-fit">
                  Email: diwasrathour@gmail.com
                </a>
                <a href="tel:+9779823619287" className="text-xs font-light text-neutral-400 hover:text-white transition-colors duration-200 flex items-center gap-1.5 w-fit">
                  Phone: +977 9823619287
                </a>
                <a href="https://github.com/ItsMeDiwas" target="_blank" rel="noopener noreferrer" className="text-xs font-light text-neutral-400 hover:text-white transition-colors duration-200 flex items-center gap-1.5 w-fit">
                  GitHub: github.com/ItsMeDiwas
                </a>
                <a href="https://linkedin.com/in/diwasdineshrathod" target="_blank" rel="noopener noreferrer" className="text-xs font-light text-neutral-400 hover:text-white transition-colors duration-200 flex items-center gap-1.5 w-fit">
                  LinkedIn: linkedin.com/in/diwasdineshrathod
                </a>
              </div>
            </div>

            {/* Geolocation */}
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#94A3B8] font-semibold">
                Geolocation
              </span>
              <p className="text-xs font-light text-[#94A3B8] leading-relaxed">
                Kathmandu, Nepal / GMT+5:45
              </p>
            </div>
            
          </div>

          <p className="text-[10px] font-mono text-neutral-600 mt-16">
            &copy; {new Date().getFullYear()} Diwas Rathod. Designed and Engineered in Next.js.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
