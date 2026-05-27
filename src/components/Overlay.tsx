"use client";

import React from "react";
import { useScroll, useTransform, motion, MotionValue } from "framer-motion";
import { ArrowDown } from "lucide-react";

interface OverlayProps {
  scrollYProgress?: MotionValue<number>;
  frameIndex?: MotionValue<number>;
}

const textContent = [
  {
    title: "Diwas Dinesh Rathod",
    subtitle: "Program Manager",
    badge: "01 // LEADERSHIP"
  },
  {
    title: "10 Years of Experience",
    subtitle: "In Project Management",
    badge: "02 // STRATEGIC DELIVERY"
  },
  {
    title: "5 Years of Experience",
    subtitle: "In AI Automation",
    badge: "03 // COGNITIVE OPERATIONS"
  }
];

export default function Overlay({ 
  scrollYProgress: passedScrollYProgress,
  frameIndex 
}: OverlayProps) {
  // Listen to global window scroll progress as fallback
  const { scrollYProgress: globalScrollYProgress } = useScroll();
  const scrollYProgress = passedScrollYProgress || globalScrollYProgress;

  // SECTION 1 (Diwas Dinesh Rathod): Slides in from the right, right-aligned.
  // Active range: Scroll 0.0 -> 0.30 (Fully disappears at 0.30)
  const s0Opacity = useTransform(scrollYProgress, [0, 0.08, 0.24, 0.30], [0, 1, 1, 0]);
  const s0X = useTransform(scrollYProgress, [0, 0.08, 0.24, 0.30], [120, 0, 0, -80]);

  // SECTION 2 (10 Years of Experience): Slides in from the left, left-aligned.
  // Enters ONLY after Section 1 has fully disappeared (Scroll 0.30 -> 0.60)
  const s1Opacity = useTransform(scrollYProgress, [0, 0.30, 0.38, 0.54, 0.60], [0, 0, 1, 1, 0]);
  const s1X = useTransform(scrollYProgress, [0, 0.30, 0.38, 0.54, 0.60], [-120, -120, 0, 0, 80]);

  // SECTION 3 (5 Years of Experience): Slides up from the bottom, centered.
  // Enters ONLY after Section 2 has fully disappeared (Scroll 0.60 -> 0.95)
  const s2Opacity = useTransform(scrollYProgress, [0, 0.60, 0.68, 0.88, 0.95], [0, 0, 1, 1, 0]);
  const s2Y = useTransform(scrollYProgress, [0, 0.60, 0.68, 0.88, 0.95], [100, 100, 0, 0, -60]);

  // Mappings for scroll indicator at the bottom (Fades out quickly)
  const scrollIndicatorOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0]);

  return (
    <div className="absolute inset-0 z-10 w-full h-screen pointer-events-none select-none relative overflow-hidden">
      {/* SECTION 1: Right-aligned (Frames 0 to 19) */}
      <motion.div
        style={{ 
          opacity: s0Opacity, 
          x: s0X,
          // Hide element completely when inactive to optimize browser rendering
          pointerEvents: "none"
        }}
        className="absolute inset-y-0 right-8 md:right-20 lg:right-32 flex flex-col justify-center items-end text-right max-w-xl ml-auto px-4"
      >
        <span className="text-xs md:text-sm font-mono tracking-[0.4em] uppercase text-white/70 mb-3 animate-pulse">
          {textContent[0].badge}
        </span>
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-white leading-none">
          {textContent[0].title}
        </h1>
        <p className="mt-4 text-sm md:text-base lg:text-lg font-mono tracking-[0.3em] uppercase text-white/80 font-medium">
          {textContent[0].subtitle}
        </p>
      </motion.div>

      {/* SECTION 2: Left-aligned (Frames 20 to 39) */}
      <motion.div
        style={{ 
          opacity: s1Opacity, 
          x: s1X,
          pointerEvents: "none"
        }}
        className="absolute inset-y-0 left-8 md:left-20 lg:left-32 flex flex-col justify-center items-start text-left max-w-xl px-4"
      >
        <span className="text-xs md:text-sm font-mono tracking-[0.4em] uppercase text-white/70 mb-3 animate-pulse">
          {textContent[1].badge}
        </span>
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-white leading-none">
          {textContent[1].title}
        </h1>
        <p className="mt-4 text-sm md:text-base lg:text-lg font-mono tracking-[0.3em] uppercase text-white/80 font-medium">
          {textContent[1].subtitle}
        </p>
      </motion.div>

      {/* SECTION 3: Bottom-center (Frames 40 to 73) */}
      <motion.div
        style={{ 
          opacity: s2Opacity, 
          y: s2Y,
          pointerEvents: "none"
        }}
        className="absolute bottom-36 left-0 right-0 flex flex-col justify-center items-center text-center max-w-3xl mx-auto px-6"
      >
        <span className="text-xs md:text-sm font-mono tracking-[0.4em] uppercase text-white/70 mb-3 animate-pulse">
          {textContent[2].badge}
        </span>
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-white leading-none">
          {textContent[2].title}
        </h1>
        <p className="mt-4 text-sm md:text-base lg:text-lg font-mono tracking-[0.3em] uppercase text-white/80 font-medium">
          {textContent[2].subtitle}
        </p>
      </motion.div>

      {/* Bottom Controls / Elements */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full max-w-xs px-6 flex flex-col items-center gap-6 z-20 pointer-events-none">
        {/* Dynamic progress bar timeline */}
        <div className="w-full flex flex-col items-center">
          <span className="text-[8px] font-mono uppercase tracking-[0.3em] text-white/50 mb-2 font-medium">
            Timeline Progress
          </span>
          <div className="w-full h-[1px] bg-white/5 rounded-full overflow-hidden relative">
            <motion.div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"
              style={{ width: useTransform(scrollYProgress, [0, 1], ["0%", "100%"]) }}
            />
          </div>
        </div>

        {/* Scroll Indicator Prompt */}
        <motion.div 
          style={{ opacity: scrollIndicatorOpacity }}
          className="flex flex-col items-center justify-center"
        >
          <span className="text-[9px] font-mono uppercase tracking-[0.25em] text-white/50 mb-1.5 font-medium">
            Scroll to Explore
          </span>
          <motion.div 
            animate={{ y: [0, 4, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
            className="flex items-center justify-center"
          >
            <ArrowDown className="w-3.5 h-3.5 text-white/50" />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
