"use client";

import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useSpring, useMotionValue, useTransform } from "framer-motion";
import { Play, Pause, Volume2, VolumeX, ChevronDown } from "lucide-react";
import { Monitor, Palette, Scissors } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import VideoGalleryShowcase from "./VideoGalleryShowcase";
import { useNavigate } from 'react-router-dom';

interface GlitchTextProps {
  text: string;
  className?: string;
  colors?: {
    red: string;
    green: string;
    blue: string;
  };
}

const GlitchText = React.forwardRef<HTMLDivElement, GlitchTextProps>(
  ({ text, className, colors = { red: "#ff0000", green: "#00ff00", blue: "#0000ff" } }, ref) => {
    return (
      <div ref={ref} className={cn("relative inline-block", className)}>
        <motion.div
          className="absolute text-foreground font-inherit mix-blend-multiply dark:mix-blend-screen"
          animate={{
            x: [-2, 2, -2],
            y: [0, -1, 1],
            skew: [0, -2, 2],
            opacity: [1, 0.8, 0.9],
            color: [colors.red, colors.red, colors.red]
          }}
          transition={{
            duration: 0.12,
            repeat: Infinity,
            repeatType: "mirror",
            ease: [0.4, 0, 0.2, 1]
          }}
        >
          {text}
        </motion.div>
        <motion.div
          className="absolute text-foreground font-inherit mix-blend-multiply dark:mix-blend-screen"
          animate={{
            x: [2, -2, 2],
            y: [1, -1, 0],
            skew: [-2, 2, 0],
            opacity: [0.9, 1, 0.8],
            color: [colors.green, colors.green, colors.green]
          }}
          transition={{
            duration: 0.11,
            repeat: Infinity,
            repeatType: "mirror",
            ease: [0.4, 0, 0.2, 1]
          }}
        >
          {text}
        </motion.div>
        <motion.div
          className="text-foreground font-inherit mix-blend-multiply dark:mix-blend-screen"
          animate={{
            x: [-1, 1, -1],
            y: [-1, 1, 0],
            skew: [2, -2, 0],
            opacity: [0.8, 0.9, 1],
            color: [colors.blue, colors.blue, colors.blue]
          }}
          transition={{
            duration: 0.1,
            repeat: Infinity,
            repeatType: "mirror",
            ease: [0.4, 0, 0.2, 1]
          }}
        >
          {text}
        </motion.div>
      </div>
    );
  }
);
GlitchText.displayName = "GlitchText";

interface TypewriterProps {
  text: string | string[];
  speed?: number;
  cursor?: string;
  loop?: boolean;
  deleteSpeed?: number;
  delay?: number;
  className?: string;
}

const Typewriter: React.FC<TypewriterProps> = ({
  text,
  speed = 80,
  cursor = "|",
  loop = false,
  deleteSpeed = 40,
  delay = 2000,
  className,
}) => {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [textArrayIndex, setTextArrayIndex] = useState(0);

  const textArray = Array.isArray(text) ? text : [text];
  const currentText = textArray[textArrayIndex] || "";

  useEffect(() => {
    if (!currentText) return;

    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          if (currentIndex < currentText.length) {
            setDisplayText((prev) => prev + currentText[currentIndex]);
            setCurrentIndex((prev) => prev + 1);
          } else if (loop) {
            setTimeout(() => setIsDeleting(true), delay);
          }
        } else {
          if (displayText.length > 0) {
            setDisplayText((prev) => prev.slice(0, -1));
          } else {
            setIsDeleting(false);
            setCurrentIndex(0);
            setTextArrayIndex((prev) => (prev + 1) % textArray.length);
          }
        }
      },
      isDeleting ? deleteSpeed : speed,
    );

    return () => clearTimeout(timeout);
  }, [currentIndex, isDeleting, currentText, loop, speed, deleteSpeed, delay, displayText, textArray]);

  return (
    <span className={className}>
      {displayText}
      <motion.span 
        className="inline-block"
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 0.8, repeat: Infinity, ease: [0.4, 0, 0.6, 1] }}
      >
        {cursor}
      </motion.span>
    </span>
  );
};

interface AnimatedTextCycleProps {
  words: string[];
  interval?: number;
  className?: string;
}

const AnimatedTextCycle: React.FC<AnimatedTextCycleProps> = ({
  words,
  interval = 4000,
  className = "",
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [width, setWidth] = useState("auto");
  const measureRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (measureRef.current) {
      const elements = measureRef.current.children;
      if (elements.length > currentIndex) {
        const newWidth = elements[currentIndex].getBoundingClientRect().width;
        setWidth(`${newWidth}px`);
      }
    }
  }, [currentIndex]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, interval);

    return () => clearInterval(timer);
  }, [interval, words.length]);

  const containerVariants = {
    hidden: { 
      y: -20,
      opacity: 0,
      filter: "blur(8px)",
      scale: 0.98
    },
    visible: {
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1]
      }
    },
    exit: { 
      y: 20,
      opacity: 0,
      filter: "blur(8px)",
      scale: 0.98,
      transition: { 
        duration: 0.3, 
        ease: [0.4, 0, 1, 1]
      }
    },
  };

  return (
    <>
      <div 
        ref={measureRef} 
        aria-hidden="true"
        className="absolute opacity-0 pointer-events-none"
        style={{ visibility: "hidden" }}
      >
        {words.map((word, i) => (
          <span key={i} className={`font-bold ${className}`}>
            {word}
          </span>
        ))}
      </div>

      <motion.span 
        className="relative inline-block"
        animate={{ 
          width,
          transition: { 
            type: "spring",
            stiffness: 300,
            damping: 30,
            mass: 1,
          }
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={currentIndex}
            className={`inline-block font-bold ${className}`}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{ whiteSpace: "nowrap" }}
          >
            {words[currentIndex]}
          </motion.span>
        </AnimatePresence>
      </motion.span>
    </>
  );
};

interface ScrollAnimationProps {
  children: React.ReactNode;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
}

const ScrollAnimation: React.FC<ScrollAnimationProps> = ({
  children,
  className,
  direction = 'down',
  delay = 0,
}) => {
  const generateVariants = (dir: string) => {
    const axis = dir === 'left' || dir === 'right' ? 'x' : 'y';
    const value = dir === 'right' || dir === 'down' ? 60 : -60;

    return {
      hidden: { filter: 'blur(10px)', opacity: 0, [axis]: value, scale: 0.98 },
      visible: {
        filter: 'blur(0px)',
        opacity: 1,
        [axis]: 0,
        scale: 1,
        transition: {
          duration: 0.6,
          ease: [0.4, 0, 0.2, 1],
          delay,
        },
      },
    };
  };

  const variants = generateVariants(direction);

  return (
    <motion.div
      whileInView="visible"
      initial="hidden"
      variants={variants}
      viewport={{ amount: 0.2, margin: '0px 0px -100px 0px' }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
};

const WaveformAnimation: React.FC<{ isPlaying: boolean; className?: string }> = ({ 
  isPlaying, 
  className 
}) => {
  const bars = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className={cn("flex items-center gap-0.5 h-10", className)}>
      {bars.map((bar) => (
        <motion.div
          key={bar}
          className="bg-gradient-to-t from-red-600 to-red-400 w-0.5 rounded-full"
          animate={isPlaying ? {
            height: [6, Math.random() * 32 + 8, 6],
            opacity: [0.4, 1, 0.4],
          } : {
            height: 6,
            opacity: 0.4,
          }}
          transition={{
            duration: 0.5 + Math.random() * 0.6,
            repeat: isPlaying ? Infinity : 0,
            repeatType: "reverse",
            ease: [0.4, 0, 0.6, 1],
            delay: bar * 0.05,
          }}
        />
      ))}
    </div>
  );
};

const PremiumTimeline: React.FC<{ className?: string }> = ({ className }) => {
  const [playheadPosition, setPlayheadPosition] = useState(0);
  const [isRendering, setIsRendering] = useState(false);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setPlayheadPosition(prev => (prev + 0.5) % 100);
    }, 80);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const renderInterval = setInterval(() => {
      setIsRendering(prev => !prev);
    }, 4000);
    
    return () => clearInterval(renderInterval);
  }, []);

  const videoClips = [
    { id: 1, start: 0, duration: 22, color: "from-blue-500 to-blue-700", type: "Video", layer: 0 },
    { id: 2, start: 5, duration: 18, color: "from-emerald-500 to-emerald-700", type: "Audio", layer: 1 },
    { id: 3, start: 25, duration: 25, color: "from-purple-500 to-purple-700", type: "Video", layer: 2 },
    { id: 4, start: 52, duration: 20, color: "from-amber-500 to-amber-700", type: "Effects", layer: 3 },
    { id: 5, start: 75, duration: 15, color: "from-rose-500 to-rose-700", type: "Transition", layer: 1 },
  ];

  return (
    <motion.div 
      className={cn("relative bg-gradient-to-br from-gray-900/95 to-black/95 border border-red-500/20 rounded-xl overflow-hidden p-6 backdrop-blur-xl", className)}
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Timeline Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <motion.div
            className="relative w-3 h-3"
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: [0.4, 0, 0.6, 1]
            }}
          >
            <div className="absolute inset-0 bg-red-500 rounded-full" />
            <motion.div
              className="absolute inset-0 bg-red-400 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [1, 0, 1]
              }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                ease: [0.4, 0, 0.6, 1]
              }}
            />
          </motion.div>
          <span className="text-red-400 text-sm font-mono tracking-wider">TIMELINE_ACTIVE</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-400 font-mono">
            {isRendering ? (
              <motion.span
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="text-amber-400"
              >
                RENDERING...
              </motion.span>
            ) : (
              <span className="text-emerald-400">READY</span>
            )}
          </div>
          <div className="text-xs text-gray-500 font-mono">
            {Math.floor(playheadPosition * 10 / 100)}:{String(Math.floor((playheadPosition * 60) % 60)).padStart(2, '0')}
          </div>
        </div>
      </div>

      {/* Timeline Tracks */}
      <div className="relative h-32 bg-gradient-to-r from-black/60 to-gray-900/60 rounded-lg border border-gray-700/50 overflow-hidden">
        {/* Time markers */}
        <div className="absolute top-0 left-0 right-0 h-8 border-b border-gray-600/50">
          {Array.from({ length: 11 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute top-0 w-px h-8 bg-gray-500/70"
              style={{ left: `${i * 10}%` }}
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{ opacity: 1, scaleY: 1 }}
              transition={{ delay: i * 0.08, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            >
              <span className="absolute -top-6 -left-3 text-xs text-gray-400 font-mono">
                {i * 10}s
              </span>
            </motion.div>
          ))}
        </div>

        {/* Video clips */}
        <div className="absolute top-8 left-0 right-0 bottom-0">
          {videoClips.map((clip, index) => (
            <motion.div
              key={clip.id}
              className={`absolute h-5 bg-gradient-to-r ${clip.color} rounded-md border border-white/10 flex items-center justify-center shadow-lg`}
              style={{
                left: `${clip.start}%`,
                width: `${clip.duration}%`,
                top: `${clip.layer * 24}px`,
              }}
              initial={{ opacity: 0, scale: 0.8, x: -20 }}
              animate={{ 
                opacity: 1, 
                scale: 1, 
                x: 0,
                boxShadow: [
                  "0 2px 8px rgba(0,0,0,0.3)",
                  "0 4px 16px rgba(239,68,68,0.2)",
                  "0 2px 8px rgba(0,0,0,0.3)"
                ]
              }}
              transition={{
                delay: index * 0.15,
                duration: 0.6,
                ease: [0.4, 0, 0.2, 1],
                boxShadow: {
                  duration: 2.5,
                  repeat: Infinity,
                  delay: clip.id * 0.5
                }
              }}
              whileHover={{
                scale: 1.05,
                y: -2,
                transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] }
              }}
            >
              <span className="text-white text-xs font-semibold opacity-90 tracking-wide">
                {clip.type}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Playhead */}
        <motion.div
          className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-20"
          style={{ left: `${playheadPosition}%` }}
          animate={{
            boxShadow: [
              "0 0 8px rgba(239, 68, 68, 0.6)",
              "0 0 20px rgba(239, 68, 68, 0.9)",
              "0 0 8px rgba(239, 68, 68, 0.6)"
            ]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: [0.25, 0.46, 0.45, 0.94]
          }}
        >
          <motion.div 
            className="absolute -top-3 -left-1.5 w-3 h-3 bg-red-500 rotate-45 shadow-lg"
            animate={{
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 1.3,
              repeat: Infinity,
              ease: [0.4, 0, 0.6, 1]
            }}
          />
        </motion.div>
      </div>

      {/* Export Progress */}
      <AnimatePresence>
        {isRendering && (
          <motion.div
            className="mt-4 space-y-2"
            initial={{ opacity: 0, y: 15, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="flex justify-between text-xs text-gray-400 font-mono">
              <span>Exporting: 4K ProRes 422</span>
              <span>ETA: 2:34</span>
            </div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-red-500 via-amber-500 to-emerald-500 rounded-full"
                animate={{
                  width: ["0%", "100%"]
                }}
                transition={{
                  duration: 4,
                  ease: [0.4, 0, 0.2, 1]
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const PremiumName: React.FC<{ className?: string }> = ({ className }) => {
  const name = "Vishnu Adari";
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.3
      }
    }
  };

  const letterVariants = {
    hidden: { 
      opacity: 0, 
      y: 40,
      scale: 0.3,
      rotateX: -90,
      filter: "blur(8px)"
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      rotateX: 0,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
        duration: 0.6
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={cn("text-3xl font-light tracking-[0.2em]", className)}
    >
      {name.split("").map((letter, index) => (
        <motion.span
          key={index}
          variants={letterVariants}
          className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:from-red-300 hover:to-red-500 transition-all duration-700 cursor-default"
          whileHover={{ 
            scale: 1.1, 
            y: -3,
            rotateY: 8,
            transition: { type: "spring", stiffness: 500, damping: 15 }
          }}
        >
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </motion.div>
  );
};

const CinematicPortfolio: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [hoveredName, setHoveredName] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const navigate = useNavigate();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 400,
    damping: 40,
    bounce: 0,
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  const handleMouseMove = (event: React.MouseEvent) => {
    const { clientX, clientY } = event;
    const { left, top, width, height } = event.currentTarget.getBoundingClientRect();
    const x = (clientX - left) / width;
    const y = (clientY - top) / height;
    mouseX.set(x);
    mouseY.set(y);
  };

  const kineticPhrases = [
    "craft visual poetry",
    "sculpt digital dreams", 
    "weave cinematic magic"
  ];

  return (
    <div 
      ref={containerRef} 
      className="min-h-screen bg-black text-white overflow-hidden relative"
      onMouseMove={handleMouseMove}
    >
      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-red-600 via-red-500 to-red-400 z-50 origin-left"
        style={{ scaleX }}
      />

      {/* Dynamic Background */}
      <motion.div 
        className="absolute inset-0 opacity-30"
        style={{ y: backgroundY }}
      >
        <div className="w-full h-full bg-gradient-to-br from-red-950/20 via-black to-red-900/20">
          <motion.div
            className="w-full h-full"
            animate={{
              background: [
                "radial-gradient(circle at 20% 50%, rgba(139,0,0,0.15) 0%, transparent 50%)",
                "radial-gradient(circle at 80% 20%, rgba(178,34,34,0.15) 0%, transparent 50%)",
                "radial-gradient(circle at 40% 80%, rgba(220,20,60,0.15) 0%, transparent 50%)",
                "radial-gradient(circle at 60% 30%, rgba(139,0,0,0.15) 0%, transparent 50%)",
              ]
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
          />
        </div>
      </motion.div>

      {/* Floating Orbs */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-32 h-32 rounded-full bg-gradient-to-r from-red-500/10 to-red-600/5 blur-xl"
            style={{
              left: `${20 + i * 15}%`,
              top: `${10 + i * 20}%`,
            }}
            animate={{
              x: [0, 100, -50, 0],
              y: [0, -80, 60, 0],
              scale: [1, 1.2, 0.8, 1],
              opacity: [0.3, 0.6, 0.2, 0.3],
            }}
            transition={{
              duration: 15 + i * 2,
              repeat: Infinity,
              ease: [0.4, 0, 0.6, 1],
              delay: i * 2,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="p-8 flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          >
            <PremiumName />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="flex items-center gap-6"
          >
            <WaveformAnimation isPlaying={isPlaying} />
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsPlaying(!isPlaying)}
                className="text-white hover:bg-red-900/20 hover:text-white border border-red-500/20 backdrop-blur-sm transition-all duration-500"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMuted(!isMuted)}
                className="text-white hover:bg-red-900/20 hover:text-white border border-red-500/20 backdrop-blur-sm transition-all duration-500"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </Button>
            </motion.div>
          </motion.div>
        </header>

        {/* Hero Section */}
        <main className="flex-1 flex flex-col justify-center items-center px-8 text-center min-h-screen relative">
          <div className="w-full max-w-6xl mx-auto">
            <ScrollAnimation direction="down" className="mb-12">
              <motion.div
                className="text-7xl md:text-9xl font-thin mb-8 tracking-tight"
                onHoverStart={() => setHoveredName(true)}
                onHoverEnd={() => setHoveredName(false)}
              >
                <span className="block text-gray-400 text-2xl md:text-3xl font-light mb-4 tracking-[0.3em]">
                  MY NAME IS
                </span>
                {hoveredName ? (
                  <GlitchText 
                    text="VISHNU ADARI" 
                    className="text-7xl md:text-9xl font-thin"
                    colors={{
                      red: "#ff3333",
                      green: "#cc0000", 
                      blue: "#990000"
                    }}
                  />
                ) : (
                  <motion.span
                    className="inline-block"
                    initial="hidden"
                    animate="visible"
                    variants={{
                      hidden: { opacity: 0 },
                      visible: {
                        opacity: 1,
                        transition: {
                          staggerChildren: 0.08,
                          delayChildren: 0.8
                        }
                      }
                    }}
                  >
                    {"VISHNU ADARI".split("").map((letter, index) => (
                      <motion.span
                        key={index}
                        className="inline-block bg-gradient-to-b from-white via-gray-100 to-gray-300 bg-clip-text text-transparent"
                        variants={{
                          hidden: { 
                            opacity: 0,
                            y: 40,
                            filter: "blur(10px)",
                            scale: 0.8
                          },
                          visible: { 
                            opacity: 1,
                            y: 0,
                            filter: "blur(0px)",
                            scale: 1,
                            transition: {
                              duration: 0.6,
                              ease: [0.4, 0, 0.2, 1]
                            }
                          }
                        }}
                        whileHover={{
                          scale: 1.1,
                          y: -6,
                          transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] }
                        }}
                      >
                        {letter === " " ? "\u00A0" : letter}
                      </motion.span>
                    ))}
                  </motion.span>
                )}
              </motion.div>
            </ScrollAnimation>

            <ScrollAnimation direction="up" delay={0.4} className="mb-16">
              <div className="text-2xl md:text-3xl text-gray-300 max-w-5xl mx-auto leading-relaxed font-light">
                <span className="text-gray-500">— I </span>
                <AnimatedTextCycle 
                  words={kineticPhrases}
                  interval={3000}
                  className="text-red-400 font-normal"
                />
                <span className="text-gray-500">, transforming raw moments into </span>
                <span className="text-red-400 font-normal">timeless narratives</span>
                <span className="text-gray-500">.</span>
              </div>
            </ScrollAnimation>

            <ScrollAnimation direction="down" delay={0.6} className="mb-20">
              <div className="text-xl md:text-2xl text-gray-400 max-w-4xl mx-auto font-light leading-relaxed">
                <Typewriter
                  text={[
                    "This portfolio breathes with every interaction.",
                    "Each frame responds to your presence.",
                    "Welcome to the future of visual storytelling."
                  ]}
                  speed={60}
                  loop={true}
                  delay={4000}
                  className="text-gray-400"
                />
              </div>
            </ScrollAnimation>

            <ScrollAnimation direction="up" delay={0.8}>
              <motion.div
                className="flex flex-col sm:flex-row gap-6 items-center justify-center"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                >
                  <button
                    onClick={() => navigate('/gallery')}
                    className="relative z-50 bg-gradient-to-r from-red-600 via-red-700 to-red-800 hover:from-red-700 hover:via-red-800 hover:to-red-900 text-white font-semibold text-lg tracking-wider px-14 py-4 rounded-xl shadow-2xl border-2 border-red-500/30 hover:border-red-400/50 transition-all duration-300 backdrop-blur-sm min-w-[240px] h-[60px] flex items-center justify-center"
                    style={{
                      background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 50%, #991b1b 100%)',
                      boxShadow: '0 10px 30px rgba(220, 38, 38, 0.3), 0 0 0 1px rgba(220, 38, 38, 0.1)',
                    }}
                  >
                    <span className="relative z-10">EXPLORE WORK</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-red-600/20 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300" />
                  </button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                >
                  <button
                    onClick={() => {
                      // Scroll to contact section
                      const contactSection = document.querySelector('[data-contact-section]');
                      if (contactSection) {
                        contactSection.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="relative z-50 bg-transparent text-white font-semibold text-lg tracking-wider px-14 py-4 rounded-xl border-2 border-red-500 hover:border-red-400 hover:bg-red-500/10 transition-all duration-300 backdrop-blur-sm min-w-[240px] h-[60px] flex items-center justify-center"
                    style={{
                      borderColor: '#dc2626',
                      boxShadow: '0 0 20px rgba(220, 38, 38, 0.2), inset 0 0 20px rgba(220, 38, 38, 0.05)',
                    }}
                  >
                    <span className="relative z-10">GET IN TOUCH</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-red-600/10 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300" />
                  </button>
                </motion.div>
              </motion.div>
            </ScrollAnimation>
          </div>

          {/* Scroll Indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: [0.4, 0, 0.6, 1] }}
          >
            <ChevronDown className="w-6 h-6 text-gray-400" />
          </motion.div>
        </main>

        {/* Explore Work Section */}
        {/* Removed all direct rendering of <VideoGalleryShowcase />. Now handled by routing only. */}

        {/* Additional Scroll Content - Timeline appears here when scrolling */}
        <section className="relative z-10 bg-gradient-to-b from-black to-gray-900/95 py-32">
          <div className="container mx-auto px-8">
            {/* Timeline Section that appears on scroll */}
            <ScrollAnimation direction="up" delay={0.2} className="mb-16">
              <h2 className="text-5xl md:text-7xl font-thin mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-red-500 to-red-600">
                CREATIVE PROCESS
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto font-light text-center mb-16">
                Behind every frame lies a story of precision, creativity, and technical mastery
              </p>
            </ScrollAnimation>
            
            <ScrollAnimation direction="down" delay={0.4}>
              <div className="flex justify-center">
                <PremiumTimeline className="w-full max-w-5xl" />
              </div>
            </ScrollAnimation>
            
            {/* Software Section */}
            <ScrollAnimation direction="up" delay={0.6} className="mt-32">
              <div className="text-center max-w-6xl mx-auto">
                <h3 className="text-4xl md:text-5xl font-thin mb-8 text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-red-500 to-red-600">
                  SOFTWARE MASTERY
                </h3>
                <p className="text-xl text-gray-300 leading-relaxed mb-16 max-w-3xl mx-auto">
                  Powered by industry-leading software, every project is crafted with precision 
                  and professional-grade tools to deliver exceptional results.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
                  {[
                    { 
                      name: "Adobe Premiere Pro", 
                      desc: "Professional video editing and post-production",
                      color: "from-purple-500 to-blue-600",
                      bgColor: "from-purple-500/10 to-blue-600/10",
                      icon: Monitor
                    },
                    { 
                      name: "DaVinci Resolve", 
                      desc: "Advanced color grading and visual effects",
                      color: "from-orange-500 to-red-600",
                      bgColor: "from-orange-500/10 to-red-600/10",
                      icon: Palette
                    },
                    { 
                      name: "CapCut", 
                      desc: "Creative mobile and desktop editing",
                      color: "from-pink-500 to-purple-600",
                      bgColor: "from-pink-500/10 to-purple-600/10",
                      icon: Scissors
                    }
                  ].map((software, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 40, scale: 0.9 }}
                      whileInView={{ opacity: 1, y: 0, scale: 1 }}
                      viewport={{ once: true, amount: 0.3 }}
                      transition={{ 
                        delay: index * 0.2, 
                        duration: 0.8, 
                        ease: [0.4, 0, 0.2, 1],
                        type: "spring",
                        stiffness: 100,
                        damping: 15
                      }}
                      whileHover={{ 
                        y: -8, 
                        scale: 1.05,
                        transition: { 
                          duration: 0.3, 
                          ease: [0.4, 0, 0.2, 1] 
                        }
                      }}
                      className="relative group bg-gradient-to-br from-gray-900/50 to-black/50 border border-red-500/20 rounded-2xl p-8 backdrop-blur-sm overflow-hidden cursor-pointer"
                    >
                      {/* Background glow effect */}
                      <motion.div
                        className={`absolute inset-0 bg-gradient-to-br ${software.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-2xl`}
                        initial={{ scale: 0.8, opacity: 0 }}
                        whileHover={{ scale: 1, opacity: 0.1 }}
                        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                      />
                      
                      {/* Floating particles */}
                      <div className="absolute inset-0 pointer-events-none">
                        {Array.from({ length: 3 }).map((_, i) => (
                          <motion.div
                            key={i}
                            className={`absolute w-1 h-1 bg-gradient-to-r ${software.color} rounded-full opacity-0 group-hover:opacity-60`}
                            style={{
                              left: `${20 + i * 30}%`,
                              top: `${20 + i * 20}%`,
                            }}
                            animate={{
                              y: [0, -20, 0],
                              x: [0, 10, 0],
                              scale: [0, 1, 0],
                              opacity: [0, 0.6, 0]
                            }}
                            transition={{
                              duration: 2 + i * 0.5,
                              repeat: Infinity,
                              delay: index * 0.3 + i * 0.2,
                              ease: [0.4, 0, 0.6, 1]
                            }}
                          />
                        ))}
                      </div>
                      
                      {/* Icon with animation */}
                      <motion.div
                        className="flex justify-center mb-6"
                        whileHover={{ 
                          rotateY: 15,
                          scale: 1.1,
                          transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
                        }}
                      >
                        <motion.div
                          className={`p-4 rounded-xl bg-gradient-to-br ${software.color}`}
                          animate={{
                            rotateY: [0, 5, 0],
                            scale: [1, 1.02, 1]
                          }}
                          transition={{
                            duration: 4,
                            repeat: Infinity,
                            delay: index * 0.5,
                            ease: [0.4, 0, 0.6, 1]
                          }}
                        >
                          <software.icon className="w-8 h-8 text-white" />
                        </motion.div>
                      </motion.div>
                      
                      {/* Content */}
                      <motion.h4 
                        className="text-xl font-semibold mb-3 text-white"
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.2 + 0.3, duration: 0.6 }}
                      >
                        {software.name}
                      </motion.h4>
                      <motion.p 
                        className="text-gray-400 leading-relaxed"
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.2 + 0.4, duration: 0.6 }}
                      >
                        {software.desc}
                      </motion.p>
                      
                      {/* Hover border effect */}
                      <motion.div
                        className="absolute inset-0 rounded-2xl border-2 border-red-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            </ScrollAnimation>

            {/* Reels & TikTok Section */}
            <ScrollAnimation direction="up" delay={0.8} className="mt-32">
              <div className="text-center max-w-6xl mx-auto">
                <h3 className="text-4xl md:text-5xl font-thin mb-8 text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-red-500 to-red-600">
                  REELS & TIKTOK
                </h3>
                <p className="text-xl text-gray-300 leading-relaxed mb-16 max-w-3xl mx-auto">
                  I was in charge of editing content for Reels and TikTok, by cutting 
                  and arranging clips to fit short durations, adjusting trending 
                  songs/videos and ensuring the video immediately grabs attention 
                  within the first 3 seconds.
                </p>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  {/* Timeline Interface */}
                  <motion.div
                    initial={{ opacity: 0, x: -50, scale: 0.95 }}
                    whileInView={{ opacity: 1, x: 0, scale: 1 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                    className="relative bg-gradient-to-br from-gray-900/95 to-black/95 border border-red-500/20 rounded-xl overflow-hidden p-6 backdrop-blur-xl"
                  >
                    {/* Timeline Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                        <span className="text-red-400 text-xs font-mono">EDITING</span>
                      </div>
                      <div className="text-xs text-gray-400 font-mono">0:15 / 0:30</div>
                    </div>

                    {/* Timeline Tracks */}
                    <div className="relative h-24 bg-gradient-to-r from-black/60 to-gray-900/60 rounded-lg border border-gray-700/50 overflow-hidden mb-4">
                      {/* Time markers */}
                      <div className="absolute top-0 left-0 right-0 h-6 border-b border-gray-600/50">
                        {Array.from({ length: 6 }).map((_, i) => (
                          <div
                            key={i}
                            className="absolute top-0 w-px h-6 bg-gray-500/70"
                            style={{ left: `${i * 20}%` }}
                          >
                            <span className="absolute -top-5 -left-2 text-xs text-gray-400 font-mono">
                              {i * 5}s
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Video clips for short-form content */}
                      <div className="absolute top-6 left-0 right-0 bottom-0">
                        {[
                          { id: 1, start: 0, duration: 40, color: "from-purple-500 to-purple-700", type: "Hook", layer: 0 },
                          { id: 2, start: 5, duration: 80, color: "from-blue-500 to-blue-700", type: "Main", layer: 1 },
                          { id: 3, start: 0, duration: 85, color: "from-emerald-500 to-emerald-700", type: "Audio", layer: 2 },
                          { id: 4, start: 70, duration: 15, color: "from-amber-500 to-amber-700", type: "CTA", layer: 0 },
                        ].map((clip, index) => (
                          <motion.div
                            key={clip.id}
                            className={`absolute h-4 bg-gradient-to-r ${clip.color} rounded-sm border border-white/10 flex items-center justify-center shadow-lg`}
                            style={{
                              left: `${clip.start}%`,
                              width: `${clip.duration}%`,
                              top: `${clip.layer * 18}px`,
                            }}
                            initial={{ opacity: 0, scale: 0.8, x: -20 }}
                            whileInView={{ 
                              opacity: 1, 
                              scale: 1, 
                              x: 0,
                            }}
                            viewport={{ once: true }}
                            transition={{
                              delay: index * 0.15,
                              duration: 0.6,
                              ease: [0.4, 0, 0.2, 1]
                            }}
                            whileHover={{
                              scale: 1.05,
                              y: -1,
                              transition: { duration: 0.2 }
                            }}
                          >
                            <span className="text-white text-xs font-semibold opacity-90">
                              {clip.type}
                            </span>
                          </motion.div>
                        ))}
                      </div>

                      {/* Playhead for short content */}
                      <motion.div
                        className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-20"
                        animate={{
                          left: ["0%", "85%", "0%"],
                          y: [0, -8, 0, 8, 0], // up at start, down at middle, up at end
                        }}
                        transition={{
                          left: {
                            duration: 10, // slower movement
                            repeat: Infinity,
                            ease: [0.4, 0, 0.6, 1],
                          },
                          y: {
                            duration: 10,
                            repeat: Infinity,
                            times: [0, 0.25, 0.5, 0.75, 1],
                            ease: "easeInOut",
                          },
                        }}
                      >
                        <div className="absolute -top-2 -left-1 w-2 h-2 bg-red-500 rotate-45" />
                      </motion.div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-red-400 text-lg font-bold">3s</div>
                        <div className="text-xs text-gray-400">Hook Rule</div>
                      </div>
                      <div>
                        <div className="text-red-400 text-lg font-bold">15-30s</div>
                        <div className="text-xs text-gray-400">Duration</div>
                      </div>
                      <div>
                        <div className="text-red-400 text-lg font-bold">9:16</div>
                        <div className="text-xs text-gray-400">Aspect</div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Mobile Preview */}
                  <motion.div
                    initial={{ opacity: 0, x: 50, scale: 0.95 }}
                    whileInView={{ opacity: 1, x: 0, scale: 1 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
                    className="flex justify-center"
                  >
                    <div className="relative">
                      {/* Phone Frame */}
                      <div className="relative w-[320px] h-[650px] rounded-[2.5rem] shadow-2xl bg-black border-[8px] border-neutral-900 overflow-hidden flex flex-col items-center" style={{boxShadow: '0 8px 32px rgba(0,0,0,0.7), 0 1.5px 0 0 #222'}}>
                        {/* Speaker and Camera */}
                        <div className="absolute top-3 left-1/2 -translate-x-1/2 flex flex-col items-center z-30">
                          <div className="w-16 h-2 bg-neutral-700 rounded-full mb-1" />
                          <div className="w-4 h-4 bg-neutral-800 rounded-full border-2 border-neutral-600" />
                        </div>
                        {/* Status Bar */}
                        <div className="absolute top-0 left-0 right-0 h-10 flex items-center justify-between px-6 text-white text-xs font-semibold z-20 bg-black/40 rounded-t-[2.5rem]">
                          <span>10:34</span>
                          <div className="flex items-center gap-1">
                            <svg width="18" height="10" viewBox="0 0 18 10" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="1" y="3" width="2" height="6" rx="1" fill="white"/><rect x="4" y="1" width="2" height="8" rx="1" fill="white"/><rect x="7" y="0" width="2" height="9" rx="1" fill="white"/><rect x="10" y="2" width="2" height="7" rx="1" fill="white"/><rect x="13" y="4" width="2" height="5" rx="1" fill="white"/></svg>
                            <svg width="16" height="10" viewBox="0 0 16 10" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="1" y="3" width="14" height="4" rx="2" fill="white"/></svg>
                            <svg width="20" height="10" viewBox="0 0 20 10" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="1" y="2" width="16" height="6" rx="3" fill="white"/><rect x="17" y="4" width="2" height="2" rx="1" fill="white"/></svg>
                            <span>100%</span>
                          </div>
                        </div>
                        {/* Fullscreen Video Content */}
                        <div className="absolute top-0 left-0 w-full h-full z-10 flex items-start justify-center">
                          <video
                            src="/vishnu-bathroom.mp4"
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              borderRadius: '2.5rem',
                              background: 'black',
                            }}
                            autoPlay
                            loop
                            muted
                            playsInline
                            controls={false}
                            title="Vishnu Bathroom Reel"
                          />
                          {/* Instagram-style Action Icons */}
                          <div className="absolute bottom-16 right-4 flex flex-col items-center gap-6 z-20 select-none">
                            <button className="focus:outline-none">
                              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-lg">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                              </svg>
                              <div className="text-xs text-white mt-1 font-semibold drop-shadow">1,234</div>
                            </button>
                            <button className="focus:outline-none">
                              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-lg">
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                              </svg>
                              <div className="text-xs text-white mt-1 font-semibold drop-shadow">321</div>
                            </button>
                            <button className="focus:outline-none">
                              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-lg">
                                <path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7"></path>
                                <polyline points="16 6 12 2 8 6"></polyline>
                                <line x1="12" y1="2" x2="12" y2="15"></line>
                              </svg>
                              <div className="text-xs text-white mt-1 font-semibold drop-shadow">Share</div>
                            </button>
                          </div>
                        </div>
                        {/* Phone Glow Effect */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-red-600/20 rounded-[2.5rem] blur-xl -z-10"
                          animate={{
                            scale: [1, 1.05, 1],
                            opacity: [0.3, 0.6, 0.3]
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: [0.4, 0, 0.6, 1]
                          }}
                        />
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </ScrollAnimation>
          </div>
        </section>

        {/* Contact Section */}
        <section data-contact-section className="relative z-10 bg-gradient-to-b from-gray-900/95 to-black py-32">
          <div className="container mx-auto px-8">
            <ScrollAnimation direction="up" delay={0.2}>
              <div className="text-center max-w-4xl mx-auto">
                <h2 className="text-5xl md:text-7xl font-thin mb-8 text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-red-500 to-red-600">
                  LET'S CREATE
                </h2>
                <p className="text-xl text-gray-300 leading-relaxed mb-12">
                  Ready to transform your vision into reality? Let's collaborate and create something extraordinary 
                  that resonates with your audience and stands the test of time.
                </p>
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                >
                  <button
                    onClick={() => {
                      window.open('mailto:contact@vishnuadari.com', '_blank');
                    }}
                    className="relative z-50 bg-gradient-to-r from-red-600 via-red-700 to-red-800 hover:from-red-700 hover:via-red-800 hover:to-red-900 text-white font-semibold text-lg tracking-wider px-16 py-4 rounded-xl shadow-2xl border-2 border-red-500/30 hover:border-red-400/50 transition-all duration-300 backdrop-blur-sm min-w-[250px] h-[60px] flex items-center justify-center"
                    style={{
                      background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 50%, #991b1b 100%)',
                      boxShadow: '0 10px 30px rgba(220, 38, 38, 0.3), 0 0 0 1px rgba(220, 38, 38, 0.1)',
                    }}
                  >
                    <span className="relative z-10">START A PROJECT</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-red-600/20 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300" />
                  </button>
                </motion.div>
                {/* Contact Information */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ delay: 0.3, duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                  className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
                >
                  <div className="text-center">
                    <h4 className="text-red-400 font-light text-lg mb-2">Email</h4>
                    <p className="text-gray-300">contact@vishnuadari.com</p>
                  </div>
                  <div className="text-center">
                    <h4 className="text-red-400 font-light text-lg mb-2">Phone</h4>
                    <p className="text-gray-300">+1 (555) 123-4567</p>
                  </div>
                  <div className="text-center">
                    <h4 className="text-red-400 font-light text-lg mb-2">Location</h4>
                    <p className="text-gray-300">Available Worldwide</p>
                  </div>
                </motion.div>
              </div>
            </ScrollAnimation>
          </div>
        </section>

        {/* Footer */}
        <motion.footer 
          className="p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        >
          <div className="text-center text-gray-500 text-sm font-light tracking-wide">
            © 2024 Vishnu Adari. All rights reserved.
          </div>
        </motion.footer>
      </div>

      {/* Ambient Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-red-500/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -200, 0],
              opacity: [0, 0.8, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 5 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: [0.4, 0, 0.6, 1]
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default CinematicPortfolio;