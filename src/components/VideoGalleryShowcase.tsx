import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Placeholder video data
const videos = [
  {
    id: 3,
    type: "file",
    src: "/v-1.mp4",
    title: "Fun at the Park",
    description: "A fun vertical video experiment with friends at the park.",
    views: 321,
    duration: "0:14",
    badge: "MP4",
    thumb: "/v-1.mp4",
    meta: "Custom Video File",
    vertical: true,
    rotate: "-rotate-90"
  },
  {
    id: 4,
    type: "file",
    src: "/v-2.mp4",
    title: "Street Performance",
    description: "A vertical video capturing a lively street performance.",
    views: 210,
    duration: "0:22",
    badge: "MP4",
    thumb: "/v-2.mp4",
    meta: "Custom Video File",
    vertical: true,
    rotate: "-rotate-90"
  },
  {
    id: 5,
    type: "file",
    src: "/v-3.mp4",
    title: "Golden Hour Short Film",
    description: "A creative short film shot during golden hour.",
    views: 145,
    duration: "0:45",
    badge: "MP4",
    thumb: "/v-3.mp4",
    meta: "Custom Video File",
    vertical: true,
    rotate: "-rotate-90"
  },
  {
    id: 6,
    type: "file",
    src: "/v-4.mp4",
    title: "Festival Behind the Scenes",
    description: "A behind-the-scenes look at a local festival.",
    views: 98,
    duration: "0:37",
    badge: "MP4",
    thumb: "/v-4.mp4",
    meta: "Custom Video File",
    vertical: true,
    rotate: "-rotate-90"
  },
  {
    id: 7,
    type: "file",
    src: "/v-5.mp4",
    title: "Scenic Travel Montage",
    description: "A landscape travel montage with scenic views.",
    views: 187,
    duration: "1:05",
    badge: "MP4",
    thumb: "/v-5.mp4",
    meta: "Custom Video File"
    // Removed vertical and rotate properties for horizontal view
  },
  // Add more demo videos as needed
];

export default function VideoGalleryShowcase({ onClose }: { onClose?: () => void }) {
  const [current, setCurrent] = useState(0);
  const [modal, setModal] = useState<null | number>(null);
  const [transitioning, setTransitioning] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  // For custom progress bar
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [seeking, setSeeking] = useState(false);

  // Update progress for current video
  useEffect(() => {
    const video = videoRefs.current[current];
    if (!video) return;
    const update = () => {
      if (video.duration) {
        setProgress((video.currentTime / video.duration) * 100);
        setDuration(video.duration);
      } else {
        setProgress(0);
        setDuration(0);
      }
    };
    video.addEventListener('timeupdate', update);
    video.addEventListener('loadedmetadata', update);
    return () => {
      video.removeEventListener('timeupdate', update);
      video.removeEventListener('loadedmetadata', update);
    };
  }, [current]);

  // Seek handler
  const handleSeek = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const bar = e.currentTarget;
    const rect = bar.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = x / rect.width;
    const video = videoRefs.current[current];
    if (video && video.duration) {
      video.currentTime = percent * video.duration;
    }
  };

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
    <>
      <div className="min-h-screen w-full flex flex-col items-center bg-black overflow-auto">
        <div className="relative w-full max-w-6xl mx-auto flex flex-col items-center justify-center">
          {/* Carousel and progress bar at the top */}
          <div className="w-full flex flex-col items-center justify-center rounded-3xl shadow-2xl p-4 md:p-12 bg-black">
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
                      videos[current].vertical ? (
                        <div className="relative w-full h-full flex items-center justify-center" style={{ aspectRatio: "16/9" }}>
                          <video
                            src={videos[current].src}
                            className={`max-h-[60vh] max-w-full object-contain group-hover:brightness-110 group-hover:scale-105 transition-all duration-300 ${videos[current].rotate ? videos[current].rotate : 'rotate-90'}`}
                            muted
                            loop
                            playsInline
                            ref={(el) => videoRefs.current[current] = el}
                          />
                        </div>
                      ) : (
                        <video
                          src={videos[current].src}
                          className="w-full h-full object-cover group-hover:brightness-110 group-hover:scale-105 transition-all duration-300"
                          muted
                          loop
                          playsInline
                          ref={(el) => videoRefs.current[current] = el}
                        />
                      )
                    )}
                    {/* Play Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <svg width="64" height="64" fill="white" className="drop-shadow-lg"><polygon points="24,16 56,32 24,48" /></svg>
                    </div>
                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex gap-2 items-center">
                      {videos[current].id === 1 && videos[current].type === 'file' && (
                        <span className="px-2 py-0.5 text-xs rounded-full bg-black text-red-500 font-bold shadow border border-red-500">v-1. MP4</span>
                      )}
                      <span className="px-2 py-0.5 text-xs rounded-full bg-red-600 text-white font-bold shadow">{videos[current].badge}</span>
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
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${i === current ? 'bg-red-500 scale-125 shadow-lg' : 'bg-white/30'}`}
                  onClick={() => setCurrent(i)}
                  aria-label={`Go to video ${i+1}`}
                />
              ))}
              <span className="ml-4 text-xs text-gray-300 font-mono">{current+1} / {videos.length}</span>
            </div>
            {/* Title/Meta */}
            <div className="text-center mt-2">
              <div className="text-lg md:text-2xl font-bold text-red-500 drop-shadow mb-1">{videos[current].title}</div>
              <div className="text-sm text-gray-400 mb-2">{videos[current].meta}</div>
              <div className="text-base text-gray-200 max-w-xl mx-auto font-light">{videos[current].description}</div>
            </div>
            {/* Custom Progress Bar (YouTube style) */}
            <div className="w-full max-w-lg mx-auto mt-1 mb-2 cursor-pointer select-none" onClick={handleSeek}>
              <div className="relative h-2 bg-neutral-800 rounded-full overflow-hidden">
                <div className="absolute left-0 top-0 h-2 bg-red-600 rounded-full" style={{ width: `${progress}%` }} />
                <div
                  className="absolute top-1/2 -translate-y-1/2 bg-red-600 rounded-full"
                  style={{ left: `calc(${progress}% - 6px)`, width: '12px', height: '12px', boxShadow: '0 0 6px 2px #ef4444' }}
                />
              </div>
            </div>
          </div>
          {/* Centered heading below carousel */}
          <div className="flex flex-col items-center mt-12 mb-6">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white text-center tracking-wide drop-shadow-lg" style={{ fontFamily: 'Montserrat, Inter, sans-serif' }}>
              More of my work
            </h2>
            <div className="mt-3 w-24 h-1 rounded-full bg-red-600 shadow-md" />
          </div>
          {/* Additional videos section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full mb-12 px-2">
            {/* v-8.mp4 */}
            <div className="bg-neutral-900 rounded-2xl shadow-xl p-6 max-w-sm w-full flex flex-col items-center mx-auto mt-8">
              <video
                src="/v-8.mp4"
                controls
                className="w-full rounded-xl mb-4 bg-black"
                style={{ maxHeight: '340px' }}
              />
              <div className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'Montserrat, Inter, sans-serif' }}>Creative Visuals Project</div>
              <div className="text-sm text-gray-400 mb-2">Custom Video File</div>
              <div className="text-base text-gray-200 text-center mb-2">A new creative video project showcasing unique visuals and editing.</div>
              <div className="flex gap-4 justify-center mt-2">
                <span className="px-2 py-0.5 text-xs rounded-full bg-red-600 text-white font-bold shadow">MP4</span>
                <span className="px-2 py-0.5 text-xs rounded-full bg-black/60 text-white font-semibold shadow">1:10</span>
              </div>
            </div>
            {/* v-6.mp4 */}
            <div className="bg-neutral-900 rounded-2xl shadow-xl p-6 max-w-sm w-full flex flex-col items-center mx-auto mt-8">
              <video
                src="/v-6.mp4"
                controls
                className="w-full rounded-xl mb-4 bg-black"
                style={{ maxHeight: '340px' }}
              />
              <div className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'Montserrat, Inter, sans-serif' }}>Urban Action Sequence</div>
              <div className="text-sm text-gray-400 mb-2">Custom Video File</div>
              <div className="text-base text-gray-200 text-center mb-2">A fast-paced action sequence with dynamic camera work.</div>
              <div className="flex gap-4 justify-center mt-2">
                <span className="px-2 py-0.5 text-xs rounded-full bg-red-600 text-white font-bold shadow">MP4</span>
                <span className="px-2 py-0.5 text-xs rounded-full bg-black/60 text-white font-semibold shadow">0:58</span>
              </div>
            </div>
            {/* v-7.mp4 */}
            <div className="bg-neutral-900 rounded-2xl shadow-xl p-6 max-w-sm w-full flex flex-col items-center mx-auto mt-8">
              <video
                src="/v-7.mp4"
                controls
                className="w-full rounded-xl mb-4 bg-black"
                style={{ maxHeight: '340px' }}
              />
              <div className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'Montserrat, Inter, sans-serif' }}>Cultural Documentary</div>
              <div className="text-sm text-gray-400 mb-2">Custom Video File</div>
              <div className="text-base text-gray-200 text-center mb-2">A documentary-style video exploring local culture and traditions.</div>
              <div className="flex gap-4 justify-center mt-2">
                <span className="px-2 py-0.5 text-xs rounded-full bg-red-600 text-white font-bold shadow">MP4</span>
                <span className="px-2 py-0.5 text-xs rounded-full bg-black/60 text-white font-semibold shadow">1:22</span>
              </div>
            </div>
            {/* v-9.mp4 */}
            <div className="bg-neutral-900 rounded-2xl shadow-xl p-6 max-w-sm w-full flex flex-col items-center mx-auto mt-8">
              <video
                src="/v-9.mp4"
                controls
                className="w-full rounded-xl mb-4 bg-black"
                style={{ maxHeight: '340px' }}
              />
              <div className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'Montserrat, Inter, sans-serif' }}>Experimental Transitions</div>
              <div className="text-sm text-gray-400 mb-2">Custom Video File</div>
              <div className="text-base text-gray-200 text-center mb-2">A visually stunning experimental video with creative transitions.</div>
              <div className="flex gap-4 justify-center mt-2">
                <span className="px-2 py-0.5 text-xs rounded-full bg-red-600 text-white font-bold shadow">MP4</span>
                <span className="px-2 py-0.5 text-xs rounded-full bg-black/60 text-white font-semibold shadow">1:03</span>
              </div>
            </div>
          </div>
        </div>
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
              className="relative bg-black rounded-3xl shadow-2xl p-4 md:p-8 w-[90vw] max-w-2xl mx-auto flex flex-col items-center"
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
                  videos[modal].vertical ? (
                    <div className="relative w-full flex items-center justify-center" style={{ aspectRatio: "16/9" }}>
                      <video
                        src={videos[modal].src}
                        controls
                        autoPlay
                        className={`max-h-[70vh] max-w-full object-contain rounded-2xl bg-black ${videos[modal].rotate ? videos[modal].rotate : 'rotate-90'}`}
                      />
                    </div>
                  ) : (
                    <video
                      src={videos[modal].src}
                      controls
                      autoPlay
                      className="w-full h-full object-contain rounded-2xl bg-black"
                    />
                  )
                )}
              </div>
              {/* Info */}
              <div className="text-center">
                <div className="text-xl md:text-2xl font-bold text-red-500 drop-shadow mb-1">{videos[modal].title}</div>
                <div className="text-sm text-gray-400 mb-2">{videos[modal].meta}</div>
                <div className="text-base text-gray-200 max-w-xl mx-auto font-light mb-2">{videos[modal].description}</div>
                <div className="flex gap-4 justify-center mt-2">
                  <span className="px-2 py-0.5 text-xs rounded-full bg-red-600 text-white font-bold shadow">{videos[modal].badge}</span>
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
          className="mt-8 px-8 py-3 rounded-xl bg-red-600 text-white font-semibold shadow-lg hover:bg-red-700 hover:scale-105 transition-all duration-300"
        >
          Close Gallery
        </button>
      )}
    </>
  );
} 