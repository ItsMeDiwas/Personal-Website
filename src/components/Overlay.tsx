"use client";

import React, { useState } from "react";
import { useScroll, useTransform, motion, MotionValue, useMotionValueEvent, AnimatePresence } from "framer-motion";
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

  // Map frame index from scrollYProgress (assuming 74 frames, 0 to 73)
  const resolvedFrameIndex = frameIndex || useTransform(scrollYProgress, [0, 1], [0, 73]);

  const [activeSection, setActiveSection] = useState(0);

  // Synchronize text content precisely to the background sequence frame index
  useMotionValueEvent(resolvedFrameIndex, "change", (latest) => {
    const index = Math.min(73, Math.max(0, Math.round(latest)));
    let nextSection = 0;
    
    // Frame-interval logic:
    // Frames 0 to 19 (1 to 20): Section 0
    // Frames 20 to 39 (21 to 40): Section 1
    // Frames 40+ (41 to 60+): Section 2
    if (index >= 20 && index < 40) {
      nextSection = 1;
    } else if (index >= 40) {
      nextSection = 2;
    }

    if (nextSection !== activeSection) {
      setActiveSection(nextSection);
    }
  });

  // Mappings for scroll indicator at the bottom (Fades out quickly)
  const scrollIndicatorOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0]);

  return (
    <div className="absolute inset-0 z-10 w-full h-screen pointer-events-none select-none relative overflow-hidden">
      <AnimatePresence>
        {/* SECTION 1: Left-aligned (Frames 0 to 19) - All White Font */}
        {activeSection === 0 && (
          <motion.div
            key="section-0"
            initial={{ opacity: 0, x: -40, filter: "blur(6px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, x: -40, filter: "blur(6px)" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="absolute inset-y-0 left-8 md:left-20 lg:left-32 flex flex-col justify-center items-start text-left max-w-xl px-4"
          >
            <span className="text-[10px] md:text-xs font-mono tracking-[0.4em] uppercase text-white/70 mb-3 animate-pulse">
              {textContent[0].badge}
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight text-white leading-none">
              {textContent[0].title}
            </h1>
            <p className="mt-4 text-xs md:text-sm font-mono tracking-[0.3em] uppercase text-white/80 font-medium">
              {textContent[0].subtitle}
            </p>
          </motion.div>
        )}

        {/* SECTION 2: Right-aligned (Frames 20 to 39) - All White Font */}
        {activeSection === 1 && (
          <motion.div
            key="section-1"
            initial={{ opacity: 0, x: 40, filter: "blur(6px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, x: 40, filter: "blur(6px)" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="absolute inset-y-0 right-8 md:right-20 lg:right-32 flex flex-col justify-center items-end text-right max-w-xl ml-auto px-4"
          >
            <span className="text-[10px] md:text-xs font-mono tracking-[0.4em] uppercase text-white/70 mb-3 animate-pulse">
              {textContent[1].badge}
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight text-white leading-none">
              {textContent[1].title}
            </h1>
            <p className="mt-4 text-xs md:text-sm font-mono tracking-[0.3em] uppercase text-white/80 font-medium">
              {textContent[1].subtitle}
            </p>
          </motion.div>
        )}

        {/* SECTION 3: Bottom-center (Frames 40 to 73) - All White Font */}
        {activeSection === 2 && (
          <motion.div
            key="section-2"
            initial={{ opacity: 0, y: 40, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 40, filter: "blur(6px)" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="absolute bottom-36 left-0 right-0 flex flex-col justify-center items-center text-center max-w-3xl mx-auto px-6 animate-once"
          >
            <span className="text-[10px] md:text-xs font-mono tracking-[0.4em] uppercase text-white/70 mb-3 animate-pulse">
              {textContent[2].badge}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white leading-none">
              {textContent[2].title}
            </h1>
            <p className="mt-4 text-xs md:text-sm font-mono tracking-[0.3em] uppercase text-white/80 font-medium">
              {textContent[2].subtitle}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

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
