"use client";

import { useEffect, useRef, useState } from "react";
import { useScroll, useSpring, useTransform, useMotionValueEvent } from "framer-motion";

interface ScrollyCanvasProps {
  children?: React.ReactNode;
}

export default function ScrollyCanvas({ children }: ScrollyCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  
  const [loadedCount, setLoadedCount] = useState(0);
  const [isPreloaded, setIsPreloaded] = useState(false);
  const totalFrames = 120;

  // Track scroll progress of parent 500vh container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Apply spring smoothing to scrubbing (Awwwards-level cinematic decelerating scroll)
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 70,
    damping: 24,
    restDelta: 0.0001,
  });

  // Map progress (0 to 1) to frame indices (0 to 119)
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
        const frameNum = String(i).padStart(3, "0");
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

  // Handle drawing the first frame immediately once preloaded completes
  useEffect(() => {
    if (isPreloaded) {
      drawFrame(0);
    }
  }, [isPreloaded]);

  const percentage = Math.round((loadedCount / totalFrames) * 100);

  return (
    <div ref={containerRef} className="relative w-full h-[500vh] bg-[#121212]">
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

      {/* Sticky Canvas Viewport */}
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden pointer-events-none">
        <canvas ref={canvasRef} className="block w-full h-full object-cover" />
      </div>

      {/* Text Parallax Overlay Content */}
      {isPreloaded && children}
    </div>
  );
}
