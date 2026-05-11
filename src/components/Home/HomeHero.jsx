"use client";

export default function HomeHero() {
  return (
    <section id="hero">
      <div className="hero-slides">
        <div className="hero-slide active">
          <video 
            src="/assests/13327036-uhd_2560_1440_25fps (2).mp4" 
            autoPlay 
            muted 
            loop 
            playsInline
          />
        </div>
      </div>
      
      <div className="hero-content reveal in">
        <div className="hero-tag">Premium Travel Experience</div>
        <h1 className="hero-title">
          Explore the Sacred <em>Spirit</em> of India with Kishori Travels
        </h1>
        <p className="hero-sub">
          Curated spiritual journeys and adventurous escapes across the majestic landscapes of India.
        </p>
        <div className="hero-btns">
          <a href="#packages" className="btn-primary">Explore Packages</a>
          <a href="#gallery" className="btn-outline">View Gallery</a>
        </div>
      </div>
    </section>
  );
}
