"use client";

import { useState, useEffect } from "react";

export default function HomeTestimonials({ testimonials = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const data = testimonials.length > 0 ? testimonials : [
    { name: "Ananya Sharma", loc: "Mumbai", rating: 5, text: "Kishori Travel made our Rajasthan trip absolutely magical. Every detail was perfectly planned.", initials: "AS" },
    { name: "Rohan Mehta", loc: "Bangalore", rating: 5, text: "The Kerala backwaters tour was beyond anything I expected. Pure value for money.", initials: "RM" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev >= data.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [data.length]);

  return (
    <section id="testimonials">
      <div className="container">
        <div className="reveal in" style={{ textAlign: 'center' }}>
          <div className="section-label">Wall of Love</div>
          <h2 className="section-title">What Our <em>Travelers</em> Say</h2>
          <p className="section-sub" style={{ margin: '0 auto 3rem' }}>Hear from those who have explored the beauty of India with us.</p>
        </div>

        <div className="testimonials-slider">
          <div 
            className="testimonials-track"
            style={{ 
                transform: `translateX(-${currentIndex * 100}%)`,
                transition: 'transform 0.5s ease'
            }}
          >
            {data.map((t, idx) => (
              <div key={idx} className="testimonial-card">
                <div className="testimonial-inner">
                  <div className="stars">{"★".repeat(t.rating || 5)}</div>
                  <div className="testimonial-text">"{t.review}"</div>
                  <div className="testimonial-author">
                    <div className="author-avatar">{t.customerName.charAt(0)}</div>
                    <div>
                      <div className="author-name">{t.customerName}</div>
                      <div className="author-loc"><i className="fa-solid fa-location-dot"></i> {t.location}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="test-dots">
          {data.map((_, idx) => (
            <button 
              key={idx} 
              className={`test-dot ${currentIndex === idx ? "active" : ""}`}
              onClick={() => setCurrentIndex(idx)}
            ></button>
          ))}
        </div>
      </div>
    </section>
  );
}
