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
    <div className="absolute inset-0 z-10 w-full h-screen pointer-events-none select-none flex flex-col justify-between items-center py-16 md:py-24">
      {/* Strict Top-pinned Header Layout to keep background image completely unobstructed */}
      <div className="w-full max-w-5xl px-6 flex flex-col items-center justify-start mt-6 md:mt-10">
        <div className="relative w-full h-24 md:h-36 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="absolute inset-x-0 flex flex-col items-center justify-start text-center px-4"
            >
              {/* Slate Gray tracked-out small uppercase index tag */}
              <span className="text-[10px] md:text-xs font-mono tracking-[0.4em] uppercase text-[#94A3B8] mb-3 animate-pulse">
                {textContent[activeSection].badge}
              </span>
              
              {/* High-contrast Pure White Title */}
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight text-white leading-none">
                {textContent[activeSection].title}
              </h1>
              
              {/* Slate Gray tracked-out small uppercase subtitle */}
              <p className="mt-3 text-xs md:text-sm font-mono tracking-[0.3em] uppercase text-[#94A3B8] font-medium">
                {textContent[activeSection].subtitle}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom Controls / Elements */}
      <div className="relative w-full max-w-xs px-6 flex flex-col items-center gap-6 mt-auto">
        {/* Dynamic progress bar timeline */}
        <div className="w-full flex flex-col items-center">
          <span className="text-[8px] font-mono uppercase tracking-[0.3em] text-[#94A3B8] mb-2 font-medium">
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
          <span className="text-[9px] font-mono uppercase tracking-[0.25em] text-[#94A3B8] mb-1.5 font-medium">
            Scroll to Explore
          </span>
          <motion.div 
            animate={{ y: [0, 4, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
            className="flex items-center justify-center"
          >
            <ArrowDown className="w-3.5 h-3.5 text-[#94A3B8]" />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
