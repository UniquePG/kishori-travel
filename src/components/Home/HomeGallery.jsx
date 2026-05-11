"use client";

import { useState, useEffect } from "react";

export default function HomeGallery({ gallery = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxImg, setLightboxImg] = useState(null);

  const images = gallery.length > 0 ? gallery : [
    "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&q=75",
    "https://plus.unsplash.com/premium_photo-1697730447144-a2f7257e4a1f?fm=jpg&q=60&w=3000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&q=75",
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=75",
    "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&q=75",
    "https://images.unsplash.com/photo-1598091383021-15ddea10925d?w=600&q=75"
  ];

  const visibleCount = typeof window !== 'undefined' ? (window.innerWidth < 600 ? 1 : window.innerWidth < 900 ? 2 : 3) : 3;
  const maxIndex = images.length - visibleCount;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(interval);
  }, [maxIndex]);

  const moveGallery = (dir) => {
    let next = currentIndex + dir;
    if (next > maxIndex) next = 0;
    if (next < 0) next = maxIndex;
    setCurrentIndex(next);
  };

  return (
    <section id="gallery">
      <div className="container">
        <div className="reveal in">
          <div className="section-label">Visual Journey</div>
          <h2 className="section-title">Our Travel <em>Gallery</em></h2>
          <p className="section-sub">Capturing moments of peace, adventure, and beauty across our various destinations.</p>
        </div>

        <div className="gallery-slider">
          <div 
            className="gallery-track" 
            style={{ 
                transform: `translateX(-${currentIndex * (100 / visibleCount)}%)`,
                transition: 'transform 0.5s ease'
            }}
          >
            {images.map((src, idx) => (
              <div key={idx} className="gallery-img">
                <img 
                  src={typeof src === 'string' ? src : src.url} 
                  alt="Gallery" 
                  onClick={() => setLightboxImg(typeof src === 'string' ? src : src.url)}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="gallery-nav">
          <button className="g-btn" onClick={() => moveGallery(-1)}><i className="fa-solid fa-chevron-left"></i></button>
          <button className="g-btn" onClick={() => moveGallery(1)}><i className="fa-solid fa-chevron-right"></i></button>
        </div>
      </div>

      {lightboxImg && (
        <div className="open" id="lightbox" onClick={() => setLightboxImg(null)}>
          <button id="lightbox-close" onClick={() => setLightboxImg(null)}>✕</button>
          <img src={lightboxImg} alt="Enlarged" />
        </div>
      )}
    </section>
  );
}
