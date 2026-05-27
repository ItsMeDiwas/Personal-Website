"use client";

import React, { useEffect, useRef, useState } from "react";
import { useScroll, useSpring, useTransform, useMotionValueEvent, useMotionValue } from "framer-motion";

interface ScrollyCanvasProps {
  children?: React.ReactNode;
}

export default function ScrollyCanvas({ children }: ScrollyCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  
  const [loadedCount, setLoadedCount] = useState(0);
  const [isPreloaded, setIsPreloaded] = useState(false);
  const [isSequenceFinished, setIsSequenceFinished] = useState(false);
  
  const totalFrames = 74;

  // Custom motion value for tracking sequence progress (0 to 1) instead of native scroll position
  const sequenceProgress = useMotionValue(0);

  // Apply spring smoothing to scrubbing (Snappy, fast-responding cinematic deceleration)
  const smoothProgress = useSpring(sequenceProgress, {
    stiffness: 140, // Butter smooth spring acceleration
    damping: 26,
    restDelta: 0.0001,
  });

  // Map progress (0 to 1) to frame indices (0 to 73)
  const frameIndex = useTransform(smoothProgress, [0, 1], [0, totalFrames - 1]);

  // Object-fit: cover implementation on Canvas 2D Context
  const drawFrame = (index: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = imagesRef.current[index];
    if (!img || !img.complete) return;

    const canvasWidth = canvas.width / (window.devicePixelRatio || 1);
    const canvasHeight = canvas.height / (window.devicePixelRatio || 1);

    const imgWidth = img.naturalWidth;
    const imgHeight = img.naturalHeight;

    const imgRatio = imgWidth / imgHeight;
    const canvasRatio = canvasWidth / canvasHeight;

    let drawWidth = canvasWidth;
    let drawHeight = canvasHeight;
    let offsetX = 0;
    let offsetY = 0;

    // Aspect ratio comparison for standard object-fit cover logic
    if (imgRatio > canvasRatio) {
      drawWidth = canvasHeight * imgRatio;
      offsetX = (canvasWidth - drawWidth) / 2;
    } else {
      drawHeight = canvasWidth / imgRatio;
      offsetY = (canvasHeight - drawHeight) / 2;
    }

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  };

  // Preloading hook
  useEffect(() => {
    let active = true;
    let loadedCounter = 0;

    const preloadImages = async () => {
      const promises: Promise<HTMLImageElement>[] = [];

      for (let i = 0; i < totalFrames; i++) {
        const frameNum = String(i).padStart(2, "0");
        const path = `/sequence/frame_${frameNum}_delay-0.066s.webp`;

        const promise = new Promise<HTMLImageElement>((resolve, reject) => {
          const img = new Image();
          img.src = path;
          img.onload = () => {
            if (active) {
              loadedCounter++;
              setLoadedCount(loadedCounter);
            }
            resolve(img);
          };
          img.onerror = () => {
            console.error(`Failed to load frame: ${path}`);
            // Resolve anyway to prevent blocking the loader completely
            resolve(img);
          };
        });
        promises.push(promise);
      }

      const loadedImages = await Promise.all(promises);
      if (active) {
        imagesRef.current = loadedImages;
        setIsPreloaded(true);
      }
    };

    preloadImages();

    return () => {
      active = false;
    };
  }, []);

  // Listen to frame index changes and draw directly to canvas (high performance bypass of react renders)
  useMotionValueEvent(frameIndex, "change", (latest) => {
    if (!isPreloaded) return;
    const index = Math.min(totalFrames - 1, Math.max(0, Math.round(latest)));
    drawFrame(index);
  });

  // Handle Resize and Retina DPI scale adjustments
  useEffect(() => {
    if (!isPreloaded) return;

    const resizeCanvas = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.scale(dpr, dpr);
      }

      // Re-draw standard active frame on window scale
      const index = Math.min(totalFrames - 1, Math.max(0, Math.round(frameIndex.get())));
      drawFrame(index);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [isPreloaded]);

  // Handle drawing the first frame immediately once preloading completes
  useEffect(() => {
    if (isPreloaded) {
      drawFrame(0);
    }
  }, [isPreloaded]);

  // ADVANCED DUAL-LAYER SCROLL LOCKING AND EVENT HIJACKING
  const touchStartY = useRef(0);

  useEffect(() => {
    if (!isPreloaded) return;

    // Snapping Scroll Lock
    const handleScrollSnapLock = () => {
      if (!isSequenceFinished && window.scrollY > 0) {
        window.scrollTo(0, 0);
      }
    };

    // Mouse Wheel Interceptor
    const handleWheel = (e: WheelEvent) => {
      const isAtTop = window.scrollY <= 2;
      if (!isAtTop) return;

      if (!isSequenceFinished) {
        e.preventDefault();
        const delta = e.deltaY;
        const speed = 0.0012; // buttery scroll progress velocity
        let nextProgress = sequenceProgress.get() + delta * speed;
        nextProgress = Math.max(0, Math.min(1, nextProgress));
        sequenceProgress.set(nextProgress);

        if (nextProgress === 1 && delta > 0) {
          setIsSequenceFinished(true);
        }
      } else if (isSequenceFinished && e.deltaY < 0) {
        // Re-locking scrolling when reaching top and wheeling up
        e.preventDefault();
        setIsSequenceFinished(false);

        const delta = e.deltaY;
        const speed = 0.0012;
        let nextProgress = sequenceProgress.get() + delta * speed;
        nextProgress = Math.max(0, Math.min(1, nextProgress));
        sequenceProgress.set(nextProgress);
      }
    };

    // Touch Swipe Interceptors (Mobile / Tablet compatibility)
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const isAtTop = window.scrollY <= 2;
      if (!isAtTop) return;

      const currentY = e.touches[0].clientY;
      const deltaY = touchStartY.current - currentY; // positive deltaY = swipe down (drag up)
      touchStartY.current = currentY;

      if (!isSequenceFinished) {
        e.preventDefault();
        const speed = 0.0035;
        let nextProgress = sequenceProgress.get() + deltaY * speed;
        nextProgress = Math.max(0, Math.min(1, nextProgress));
        sequenceProgress.set(nextProgress);

        if (nextProgress === 1 && deltaY > 0) {
          setIsSequenceFinished(true);
        }
      } else if (isSequenceFinished && deltaY < 0) {
        e.preventDefault();
        setIsSequenceFinished(false);

        const speed = 0.0035;
        let nextProgress = sequenceProgress.get() + deltaY * speed;
        nextProgress = Math.max(0, Math.min(1, nextProgress));
        sequenceProgress.set(nextProgress);
      }
    };

    // Keyboard Key Navigation Lock (PageDown, ArrowDown, etc)
    const handleKeyDown = (e: KeyboardEvent) => {
      const isAtTop = window.scrollY <= 2;
      if (!isAtTop) return;

      const keys = ["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Space"];
      if (!keys.includes(e.key)) return;

      if (!isSequenceFinished) {
        e.preventDefault();
        let step = 0;
        if (e.key === "ArrowDown" || e.key === "Space") {
          step = 0.03;
        } else if (e.key === "PageDown") {
          step = 0.15;
        } else if (e.key === "ArrowUp") {
          step = -0.03;
        } else if (e.key === "PageUp") {
          step = -0.15;
        }

        let nextProgress = sequenceProgress.get() + step;
        nextProgress = Math.max(0, Math.min(1, nextProgress));
        sequenceProgress.set(nextProgress);

        if (nextProgress === 1 && step > 0) {
          setIsSequenceFinished(true);
        }
      } else if (isSequenceFinished && (e.key === "ArrowUp" || e.key === "PageUp")) {
        e.preventDefault();
        setIsSequenceFinished(false);

        const step = e.key === "ArrowUp" ? -0.03 : -0.15;
        let nextProgress = sequenceProgress.get() + step;
        nextProgress = Math.max(0, Math.min(1, nextProgress));
        sequenceProgress.set(nextProgress);
      }
    };

    // Attach Listeners
    window.addEventListener("scroll", handleScrollSnapLock);
    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("keydown", handleKeyDown, { passive: false });

    return () => {
      window.removeEventListener("scroll", handleScrollSnapLock);
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isSequenceFinished, isPreloaded]);

  const percentage = Math.round((loadedCount / totalFrames) * 100);

  return (
    <div ref={containerRef} className="relative w-full h-screen bg-[#121212]">
      {/* Visual Loader Overlay */}
      {!isPreloaded && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#121212]">
          <div className="relative flex items-center justify-center mb-6">
            <div className="w-16 h-16 border-2 border-white/5 border-t-blue-500 rounded-full animate-spin"></div>
            <span className="absolute text-xs font-mono text-neutral-400 font-semibold">{percentage}%</span>
          </div>
          <p className="text-sm font-light uppercase tracking-[0.25em] text-neutral-400 font-sans">
            Loading Cinematic Story
          </p>
          <div className="w-48 h-[1px] bg-neutral-900 mt-4 overflow-hidden rounded">
            <div 
              className="h-full bg-blue-500 transition-all duration-150 ease-out" 
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Sticky Canvas & Overlay Viewport (Occupies 100vh and remains sticky or fixed inside parent) */}
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden z-10">
        {/* Canvas Background Layer */}
        <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full object-cover z-0 pointer-events-none" />
        
        {/* Subtle dark vignette overlay to unify sequence background and boost text contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#121212]/35 via-transparent to-[#121212]/85 z-5 pointer-events-none" />

        {/* Text Overlay Layer */}
        {isPreloaded && children && (
          <div className="absolute inset-0 z-10 pointer-events-none">
            {React.Children.map(children, child => {
              if (React.isValidElement(child)) {
                // Pass our custom sequenceProgress motion value as scrollYProgress to maintain transition compatibility
                return React.cloneElement(child, { scrollYProgress: sequenceProgress, frameIndex } as any);
              }
              return child;
            })}
          </div>
        )}
      </div>
    </div>
  );
}
