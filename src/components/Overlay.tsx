"use client";

import { useScroll, useTransform, motion } from "framer-motion";
import { ArrowDown } from "lucide-react";

export default function Overlay() {
  // Listen to global window scroll progress (synchronized with our 500vh parent)
  const { scrollYProgress } = useScroll();

  // Mappings for Section 1: Introduction (Center aligned)
  // Visible: 0 to 0.15, Fades out: 0.15 to 0.25
  const opacity1 = useTransform(scrollYProgress, [0, 0.12, 0.22], [1, 1, 0]);
  const y1 = useTransform(scrollYProgress, [0, 0.22], [0, -120]);
  const scale1 = useTransform(scrollYProgress, [0, 0.22], [1, 0.95]);

  // Mappings for Section 2: Core focus (Left aligned)
  // Fades in: 0.22 to 0.32, Active: 0.32 to 0.45, Fades out: 0.45 to 0.55
  const opacity2 = useTransform(scrollYProgress, [0.18, 0.28, 0.42, 0.52], [0, 1, 1, 0]);
  const y2 = useTransform(scrollYProgress, [0.18, 0.28, 0.42, 0.52], [100, 0, 0, -100]);
  
  // Mappings for Section 3: Vision (Right aligned)
  // Fades in: 0.52 to 0.62, Active: 0.62 to 0.75, Fades out: 0.75 to 0.88
  const opacity3 = useTransform(scrollYProgress, [0.48, 0.58, 0.72, 0.82], [0, 1, 1, 0]);
  const y3 = useTransform(scrollYProgress, [0.48, 0.58, 0.72, 0.82], [100, 0, 0, -100]);

  // Mappings for scroll indicator at the bottom (Fades out quickly)
  const scrollIndicatorOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0]);

  return (
    <div className="absolute inset-0 z-10 w-full pointer-events-none select-none">
      {/* SECTION 1: Introduction (Center Aligned) */}
      <motion.div
        style={{ opacity: opacity1, y: y1, scale: scale1 }}
        className="fixed inset-0 flex flex-col items-center justify-center text-center px-4"
      >
        <span className="text-xs font-mono tracking-[0.4em] uppercase text-blue-500 mb-4 animate-pulse">
          01 // INTRODUCTION
        </span>
        <h1 className="text-5xl md:text-8xl font-bold tracking-tight text-white max-w-4xl leading-tight">
          Diwas Rathod
          <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 font-light text-4xl md:text-6xl">
            Creative Developer
          </span>
        </h1>
        <p className="mt-6 text-sm md:text-base font-light text-neutral-400 max-w-md tracking-wide">
          Crafting premium, high-performance scroll-driven digital canvases and interactive experiences.
        </p>

        {/* Scroll Indicator Prompt */}
        <motion.div 
          style={{ opacity: scrollIndicatorOpacity }}
          className="absolute bottom-12 flex flex-col items-center justify-center"
        >
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-neutral-500 mb-2">
            Scroll to Explore
          </span>
          <div className="relative flex items-center justify-center">
            <motion.div 
              animate={{ y: [0, 6, 0] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
            >
              <ArrowDown className="w-4 h-4 text-neutral-500" />
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      {/* SECTION 2: Core Focus (Left Aligned) */}
      <motion.div
        style={{ opacity: opacity2, y: y2 }}
        className="fixed inset-0 flex flex-col justify-center px-8 md:px-24 lg:px-36 max-w-4xl"
      >
        <span className="text-xs font-mono tracking-[0.4em] uppercase text-blue-400 mb-4">
          02 // EXPERIENCE
        </span>
        <h2 className="text-4xl md:text-7xl font-bold tracking-tight text-white leading-tight">
          I build digital
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
            experiences.
          </span>
        </h2>
        <p className="mt-6 text-neutral-400 font-light text-base md:text-lg max-w-lg leading-relaxed">
          Through pixel-perfect fluid transitions, WebGL implementations, and optimized canvas scrubbing, your ideas come to life with buttery organic response.
        </p>
      </motion.div>

      {/* SECTION 3: Vision (Right Aligned) */}
      <motion.div
        style={{ opacity: opacity3, y: y3 }}
        className="fixed inset-0 flex flex-col justify-center items-end px-8 md:px-24 lg:px-36 text-right ml-auto max-w-4xl"
      >
        <span className="text-xs font-mono tracking-[0.4em] uppercase text-purple-400 mb-4">
          03 // THE PHILOSOPHY
        </span>
        <h2 className="text-4xl md:text-7xl font-bold tracking-tight text-white leading-tight">
          Bridging design
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
            & engineering.
          </span>
        </h2>
        <p className="mt-6 text-neutral-400 font-light text-base md:text-lg max-w-lg leading-relaxed ml-auto">
          True digital masterpieces exist at the intersection of aesthetic design and architectural perfection. I write high-performance frontend interfaces that never compromise on performance.
        </p>
      </motion.div>
    </div>
  );
}
