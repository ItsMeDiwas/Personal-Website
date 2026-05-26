"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Mail } from "lucide-react";
import Image from "next/image";

interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  tags: string[];
  link: string;
}

const projects: Project[] = [
  {
    id: "aether",
    title: "Project Aether",
    category: "EXPERIMENTAL WEBGL BROWSER",
    description: "A futuristic spatial web browser concept leveraging hardware-accelerated 3D nodes, dynamic spatial bookmarks, and zero-latency layout rendering.",
    image: "/images/project_aether.png",
    tags: ["Next.js 14", "Three.js", "WebGL", "Framer Motion"],
    link: "#",
  },
  {
    id: "halcyon",
    title: "Project Halcyon",
    category: "GENERATIVE SOUNDSCAPES",
    description: "An immersive, atmospheric ambient generator turning real-time system interactions and visual waveforms into harmonic, organic acoustic soundscapes.",
    image: "/images/project_halcyon.png",
    tags: ["React", "Web Audio API", "Tailwind CSS", "Canvas API"],
    link: "#",
  },
  {
    id: "nova",
    title: "Project Nova",
    category: "COLLABORATIVE WORKSPACE",
    description: "An infinite vector design workspace for creative agencies. Multi-user cursor tracking, collaborative path editing, and asset library synchronization.",
    image: "/images/project_nova.png",
    tags: ["Next.js", "WebSockets", "Canvas 2D", "TypeScript"],
    link: "#",
  },
];

export default function Projects() {
  return (
    <section className="relative w-full min-h-screen bg-[#121212] px-6 py-32 md:px-16 lg:px-24 border-t border-white/5 overflow-hidden z-20">
      {/* Dynamic Background Glows */}
      <div className="glow-bg w-[400px] h-[400px] bg-blue-500/10 -top-20 -left-20" />
      <div className="glow-bg w-[400px] h-[400px] bg-purple-500/5 -bottom-20 -right-20" />

      {/* Header Container */}
      <div className="max-w-7xl mx-auto mb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col"
        >
          <span className="text-xs font-mono tracking-[0.4em] uppercase text-blue-500 mb-3">
            04 // SELECTED WORKS
          </span>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white leading-tight">
            Featured Creations
          </h2>
          <div className="w-24 h-[1px] bg-gradient-to-r from-blue-500 to-transparent mt-6" />
        </motion.div>
      </div>

      {/* Projects Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-32">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: index * 0.15, ease: "easeOut" }}
            className="group glass-card rounded-2xl overflow-hidden flex flex-col h-full"
          >
            {/* Visual Preview Container */}
            <div className="relative aspect-square w-full overflow-hidden border-b border-white/5">
              <Image
                src={project.image}
                alt={project.title}
                fill
                priority={index === 0}
                className="object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300" />
            </div>

            {/* Description & Metadata Card */}
            <div className="p-8 flex flex-col flex-grow">
              <span className="text-[10px] font-mono tracking-[0.25em] text-neutral-400 font-medium mb-2 uppercase">
                {project.category}
              </span>
              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors duration-300 flex items-center justify-between">
                {project.title}
                <ArrowUpRight className="w-5 h-5 text-neutral-500 group-hover:text-blue-400 transition-colors group-hover:translate-x-0.5 group-hover:-translate-y-0.5 duration-300" />
              </h3>
              <p className="text-neutral-400 font-light text-sm leading-relaxed mb-6 flex-grow">
                {project.description}
              </p>

              {/* Badges Stack */}
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-mono font-medium px-2.5 py-1 bg-white/5 border border-white/5 text-neutral-300 rounded-md"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Footer / Connect Section */}
      <div className="max-w-5xl mx-auto border-t border-white/5 pt-20 pb-12 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center"
        >
          <span className="text-[10px] font-mono tracking-[0.4em] uppercase text-neutral-500 mb-4">
            GET IN TOUCH
          </span>
          <h3 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight leading-tight max-w-2xl">
            Let&apos;s co-create something <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 font-light italic">extraordinary</span>
          </h3>
          <p className="text-neutral-400 font-light text-sm max-w-md mb-8 leading-relaxed">
            Interested in pushing the boundaries of web interfaces and scroll experiences? My door is always open.
          </p>

          {/* Elegant Glow CTA Button */}
          <a
            href="mailto:contact@diwas.dev"
            className="px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm tracking-wider uppercase rounded-full shadow-[0_0_30px_rgba(59,130,246,0.3)] hover:shadow-[0_0_40px_rgba(59,130,246,0.5)] transition-all duration-300 flex items-center gap-2 group mb-12"
          >
            Initiate Conversation
            <Mail className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-300" />
          </a>

          {/* Social Links stack */}
          <div className="flex items-center gap-6 text-neutral-500">
            <a href="#" className="hover:text-white transition-colors duration-300" aria-label="GitHub">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                <path d="M9 18c-4.51 2-5-2-7-2" />
              </svg>
            </a>
            <a href="#" className="hover:text-white transition-colors duration-300" aria-label="LinkedIn">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect width="4" height="12" x="2" y="9" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </a>
            <a href="mailto:contact@diwas.dev" className="hover:text-white transition-colors duration-300" aria-label="Email">
              <Mail className="w-5 h-5" />
            </a>
          </div>

          <p className="text-[10px] font-mono text-neutral-600 mt-12">
            &copy; {new Date().getFullYear()} Diwas Rathod. Designed and Engineered in Next.js.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
