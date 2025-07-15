import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Placeholder video data
const videos = [
  {
    id: 1,
    type: "file",
    src: "/vishnu-bathroom.mp4",
    title: "Vishnu Bathroom Reel",
    description: "A cinematic shower scene.",
    views: 1234,
    duration: "0:30",
    badge: "MP4",
    thumb: "/vishnu-bathroom.mp4", // For demo, use video as thumb
    meta: "Custom Video File"
  },
  {
    id: 2,
    type: "youtube",
    src: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    title: "YouTube Demo",
    description: "A YouTube video demo.",
    views: 5678,
    duration: "1:12",
    badge: "YouTube",
    thumb: "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
    meta: "YouTube Embed"
  },
  // Add more demo videos as needed
];

const gradient = "bg-gradient-to-br from-purple-700 via-blue-700 to-indigo-900";

export default function VideoGalleryShowcase({ onClose }: { onClose?: () => void }) {
  const [current, setCurrent] = useState(0);
  const [modal, setModal] = useState<null | number>(null);
  const [transitioning, setTransitioning] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (modal !== null) {
        if (e.key === "Escape") setModal(null);
        return;
      }
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  });

  // Prevent rapid clicking
  const next = () => {
    if (transitioning) return;
    setTransitioning(true);
    setCurrent((c) => (c + 1) % videos.length);
    setTimeout(() => setTransitioning(false), 500);
  };
  const prev = () => {
    if (transitioning) return;
    setTransitioning(true);
    setCurrent((c) => (c - 1 + videos.length) % videos.length);
    setTimeout(() => setTransitioning(false), 500);
  };

  // Touch navigation
  useEffect(() => {
    const ref = carouselRef.current;
    if (!ref) return;
    let startX = 0;
    let dx = 0;
    const onTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
    };
    const onTouchMove = (e: TouchEvent) => {
      dx = e.touches[0].clientX - startX;
    };
    const onTouchEnd = () => {
      if (dx > 50) prev();
      else if (dx < -50) next();
      dx = 0;
    };
    ref.addEventListener("touchstart", onTouchStart);
    ref.addEventListener("touchmove", onTouchMove);
    ref.addEventListener("touchend", onTouchEnd);
    return () => {
      ref.removeEventListener("touchstart", onTouchStart);
      ref.removeEventListener("touchmove", onTouchMove);
      ref.removeEventListener("touchend", onTouchEnd);
    };
  }, [carouselRef, transitioning]);

  // Modal close on click outside
  const modalBgRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (modal === null) return;
    const handleClick = (e: MouseEvent) => {
      if (modalBgRef.current && e.target === modalBgRef.current) setModal(null);
    };
    window.addEventListener("mousedown", handleClick);
    return () => window.removeEventListener("mousedown", handleClick);
  }, [modal]);

  return (
    <div className={`relative w-full min-h-[60vh] flex flex-col items-center justify-center ${gradient} rounded-3xl shadow-2xl p-4 md:p-12 overflow-hidden`}>
      {/* Carousel */}
      <div className="relative w-full max-w-2xl mx-auto flex items-center justify-center">
        {/* Left Arrow */}
        <button
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/40 hover:bg-black/70 text-white rounded-full p-2 shadow-lg backdrop-blur-lg disabled:opacity-40"
          onClick={prev}
          disabled={transitioning}
          aria-label="Previous video"
        >
          <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        {/* Video Display */}
        <div ref={carouselRef} className="w-full flex items-center justify-center select-none">
          <AnimatePresence initial={false}>
            <motion.div
              key={videos[current].id}
              initial={{ opacity: 0, scale: 0.96, x: 80 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.96, x: -80 }}
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
              className="relative w-full max-w-lg aspect-video rounded-2xl overflow-hidden shadow-xl group cursor-pointer"
              onClick={() => setModal(current)}
            >
              {/* Video/Thumb */}
              {videos[current].type === "youtube" ? (
                <img src={videos[current].thumb} alt={videos[current].title} className="w-full h-full object-cover group-hover:brightness-110 group-hover:scale-105 transition-all duration-300" />
              ) : (
                <video src={videos[current].src} className="w-full h-full object-cover group-hover:brightness-110 group-hover:scale-105 transition-all duration-300" muted loop playsInline />
              )}
              {/* Play Overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <svg width="64" height="64" fill="white" className="drop-shadow-lg"><polygon points="24,16 56,32 24,48" /></svg>
              </div>
              {/* Badges */}
              <div className="absolute top-3 left-3 flex gap-2">
                <span className="px-2 py-0.5 text-xs rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold shadow">{videos[current].badge}</span>
                <span className="px-2 py-0.5 text-xs rounded-full bg-black/60 text-white font-semibold shadow">{videos[current].duration}</span>
              </div>
              {/* Views */}
              <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/50 rounded-full px-2 py-0.5 text-xs text-white font-semibold shadow">
                <svg width="16" height="16" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3.2"/><path d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10z"/></svg>
                {videos[current].views}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        {/* Right Arrow */}
        <button
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/40 hover:bg-black/70 text-white rounded-full p-2 shadow-lg backdrop-blur-lg disabled:opacity-40"
          onClick={next}
          disabled={transitioning}
          aria-label="Next video"
        >
          <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg>
        </button>
      </div>
      {/* Dot Indicators */}
      <div className="flex gap-2 mt-6 mb-2 items-center justify-center">
        {videos.map((v, i) => (
          <button
            key={v.id}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${i === current ? 'bg-gradient-to-r from-purple-400 to-blue-400 scale-125 shadow-lg' : 'bg-white/30'}`}
            onClick={() => setCurrent(i)}
            aria-label={`Go to video ${i+1}`}
          />
        ))}
        <span className="ml-4 text-xs text-white/80 font-mono">{current+1} / {videos.length}</span>
      </div>
      {/* Title/Meta */}
      <div className="text-center mt-2">
        <div className="text-lg md:text-2xl font-bold text-white drop-shadow mb-1">{videos[current].title}</div>
        <div className="text-sm text-blue-200/80 mb-2">{videos[current].meta}</div>
        <div className="text-base text-white/80 max-w-xl mx-auto font-light">{videos[current].description}</div>
      </div>
      {/* Modal */}
      <AnimatePresence>
        {modal !== null && (
          <motion.div
            ref={modalBgRef}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="relative bg-gradient-to-br from-purple-900/90 to-blue-900/90 rounded-3xl shadow-2xl p-4 md:p-8 w-[90vw] max-w-2xl mx-auto flex flex-col items-center"
            >
              {/* Close */}
              <button
                onClick={() => setModal(null)}
                className="absolute top-4 right-4 text-white bg-black/40 hover:bg-black/70 rounded-full p-2 shadow-lg"
                aria-label="Close modal"
              >
                <svg width="28" height="28" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
              {/* Video Player */}
              <div className="w-full aspect-video rounded-2xl overflow-hidden bg-black flex items-center justify-center mb-4">
                {videos[modal].type === "youtube" ? (
                  <iframe
                    src={videos[modal].src}
                    title={videos[modal].title}
                    width="100%"
                    height="100%"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                    className="w-full h-full border-none rounded-2xl"
                  />
                ) : (
                  <video
                    src={videos[modal].src}
                    controls
                    autoPlay
                    className="w-full h-full object-contain rounded-2xl bg-black"
                  />
                )}
              </div>
              {/* Info */}
              <div className="text-center">
                <div className="text-xl md:text-2xl font-bold text-white drop-shadow mb-1">{videos[modal].title}</div>
                <div className="text-sm text-blue-200/80 mb-2">{videos[modal].meta}</div>
                <div className="text-base text-white/80 max-w-xl mx-auto font-light mb-2">{videos[modal].description}</div>
                <div className="flex gap-4 justify-center mt-2">
                  <span className="px-2 py-0.5 text-xs rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold shadow">{videos[modal].badge}</span>
                  <span className="px-2 py-0.5 text-xs rounded-full bg-black/60 text-white font-semibold shadow">{videos[modal].duration}</span>
                  <span className="flex items-center gap-1 bg-black/50 rounded-full px-2 py-0.5 text-xs text-white font-semibold shadow">
                    <svg width="16" height="16" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3.2"/><path d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10z"/></svg>
                    {videos[modal].views}
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Close Button (mobile) */}
      {onClose && (
        <button
          onClick={onClose}
          className="mt-8 px-8 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold shadow-lg hover:scale-105 transition-all duration-300"
        >
          Close Gallery
        </button>
      )}
    </div>
  );
} 