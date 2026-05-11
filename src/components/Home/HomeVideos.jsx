"use client";

import { useState, useEffect } from "react";

export default function HomeVideos({videos}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxVideo, setLightboxVideo] = useState(null);

  const allVideos = videos.length > 0 ? videos : [
    { title: "Kedarnath Yatra", desc: "A journey to the heavens.", src: "https://vjs.zencdn.net/v/oceans.mp4" },
    { title: "Kashmir Beauty", desc: "Paradise on Earth.", src: "https://vjs.zencdn.net/v/oceans.mp4" },
    { title: "Manali Snow", desc: "Experience the chill.", src: "https://vjs.zencdn.net/v/oceans.mp4" },
    { title: "Haridwar Aarti", desc: "Spiritual awakening.", src: "https://vjs.zencdn.net/v/oceans.mp4" },
    { title: "Goa Sunset", desc: "Peaceful vibes.", src: "https://vjs.zencdn.net/v/oceans.mp4" }
  ];

  const visibleCount = typeof window !== 'undefined' ? (window.innerWidth < 600 ? 1 : window.innerWidth < 900 ? 2 : 3) : 3;
  const maxIndex = videos.length - visibleCount;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [maxIndex]);

  const moveSlider = (dir) => {
    let next = currentIndex + dir;
    if (next > maxIndex) next = 0;
    if (next < 0) next = maxIndex;
    setCurrentIndex(next);
  };

  return (
    <section id="videos">
      <div className="container">
        <div className="reveal in">
          <div className="section-label">Cinematic Experience</div>
          <h2 className="section-title">Video <em>Stories</em></h2>
          <p className="section-sub">Experience the magic of our tours through the lens of our travelers.</p>
        </div>

        <div className="video-slider">
          <div 
            className="video-track"
            style={{ 
                transform: `translateX(-${currentIndex * (100 / visibleCount)}%)`,
                transition: 'transform 0.5s ease',
                display: 'flex'
            }}
          >
            {allVideos.map((v, idx) => (
              <div key={idx} className="video-card" >
                <div className="video-inner" onClick={() => setLightboxVideo(v.mediaUrl || v.src)} style={{ cursor: 'pointer' }}>
                  <video src={v.mediaUrl || v.src} autoPlay muted loop playsInline />
                  <div className="video-info">
                    <h4>{v.title}</h4>
                    <p>{v.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="gallery-nav" style={{ marginTop: '2rem' }}>
          <button className="g-btn" onClick={() => moveSlider(-1)}><i className="fa-solid fa-chevron-left"></i></button>
          <button className="g-btn" onClick={() => moveSlider(1)}><i className="fa-solid fa-chevron-right"></i></button>
        </div>
      </div>
      {lightboxVideo && (
        <div className="open" id="lightbox" onClick={() => setLightboxVideo(null)}>
          <button id="lightbox-close" onClick={() => setLightboxVideo(null)}>✕</button>
          <video src={lightboxVideo} controls autoPlay style={{ maxWidth: '90vw', maxHeight: '85vh', borderRadius: '12px' }} onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </section>
  );
}
