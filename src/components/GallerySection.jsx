"use client";

import { useRef, useState, useEffect } from "react";
import { Play, Camera, ChevronRight, ChevronLeft, X } from "lucide-react";

export default function GallerySection({ gallery = [] }) {
  const [activeTab, setActiveTab] = useState("photo");
  const [selectedMedia, setSelectedMedia] = useState(null);
  const scrollRef = useRef(null);

  const filteredItems = gallery.filter((item) => item.type === activeTab);

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    const { scrollLeft, clientWidth } = scrollRef.current;
    const scrollTo = direction === "left" ? scrollLeft - clientWidth : scrollLeft + clientWidth;
    scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
  };

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (selectedMedia) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedMedia]);

  return (
    <section id="gallery" className="bg-white py-24 px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 px-4">
          <div className="max-w-xl text-left">
            <span className="text-xs font-bold tracking-[0.3em] text-orange-500 uppercase">
              Moments Captured
            </span>
            <h2 className="mt-2 font-serif text-4xl text-slate-900 md:text-5xl">
              Our <span className="italic">Visual Stories</span>
            </h2>
            <p className="mt-4 text-slate-500">
              A glimpse of the unforgettable landscapes and memories waiting for you across
              Incredible India.
            </p>
          </div>

          <div className="mt-8 flex bg-slate-100 p-1.5 rounded-2xl md:mt-0">
            <button
              onClick={() => setActiveTab("photo")}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${
                activeTab === "photo" ? "bg-white text-orange-600 shadow-lg" : "text-slate-500"
              }`}
            >
              <Camera className="h-4 w-4" /> Photos
            </button>
            <button
              onClick={() => setActiveTab("video")}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${
                activeTab === "video" ? "bg-white text-orange-600 shadow-lg" : "text-slate-500"
              }`}
            >
              <Play className="h-4 w-4" /> Videos
            </button>
          </div>
        </div>

        <div className="relative group">
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory no-scrollbar"
          >
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedMedia(item)}
                className="min-w-[300px] md:min-w-[450px] aspect-[4/5] relative rounded-[2rem] overflow-hidden snap-start group/item cursor-pointer shadow-sm hover:shadow-2xl transition-all"
              >
                {activeTab === "video" && !item.thumbnail ? (
                  <video
                    src={item.url}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover/item:scale-110"
                    loop
                    muted
                    onMouseEnter={(e) => e.target.play()}
                    onMouseLeave={(e) => {
                      e.target.pause();
                      e.target.currentTime = 0;
                    }}
                  />
                ) : (
                  <img
                    src={activeTab === "photo" ? item.url : item.thumbnail}
                    alt={item.title || "Gallery Media"}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover/item:scale-110"
                    referrerPolicy="no-referrer"
                  />
                )}
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8">
                  <h4 className="text-white font-serif text-2xl drop-shadow-md translate-y-4 group-hover/item:translate-y-0 transition-transform duration-300">
                    {item.title}
                  </h4>
                  {activeTab === "video" && (
                    <div className="absolute inset-0 m-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-500/90 text-white shadow-lg shadow-orange-500/30 scale-90 group-hover/item:scale-100 transition-transform duration-300">
                      <Play className="h-6 w-6 ml-1" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => scroll("left")}
            className="absolute left-4 top-1/2 -translate-y-1/2 h-14 w-14 rounded-full bg-white/90 shadow-xl border border-slate-100 flex items-center justify-center text-slate-800 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-orange-500 hover:text-white"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="absolute right-4 top-1/2 -translate-y-1/2 h-14 w-14 rounded-full bg-white/90 shadow-xl border border-slate-100 flex items-center justify-center text-slate-800 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-orange-500 hover:text-white"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Full View Modal */}
      {selectedMedia && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/95 backdrop-blur-xl p-4 sm:p-8 transition-opacity">
          <button
            onClick={() => setSelectedMedia(null)}
            className="absolute top-6 right-6 p-4 rounded-full bg-white/10 hover:bg-white/20 hover:rotate-90 text-white backdrop-blur-md transition-all z-10 shadow-2xl border border-white/10"
          >
            <X className="h-6 w-6" />
          </button>

          <div className="relative max-w-6xl w-full h-full flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-300">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-black/50 ring-1 ring-white/10">
              {selectedMedia.type === "photo" ? (
                <img
                  src={selectedMedia.url}
                  alt={selectedMedia.title || "Gallery Image"}
                  className="max-w-full max-h-[75vh] object-contain"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <video
                  src={selectedMedia.url}
                  controls
                  autoPlay
                  className="max-w-full max-h-[75vh] object-contain"
                />
              )}
            </div>
            
            {(selectedMedia.title || selectedMedia.description) && (
              <div className="mt-10 text-center max-w-2xl bg-black/20 p-6 rounded-3xl backdrop-blur-md border border-white/5">
                {selectedMedia.title && (
                  <h3 className="text-3xl font-serif text-white mb-0">{selectedMedia.title}</h3>
                )}
                {selectedMedia.description && (
                  <p className="text-slate-300 leading-relaxed text-lg">{selectedMedia.description}</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
