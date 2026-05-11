export default function HomeWhyUs() {
  return (
    <section id="why">
      <div className="container">
        <div className="reveal in">
          <div className="section-label">Our Commitment</div>
          <h2 className="section-title">Why Choose <em>Kishori Travels</em></h2>
          <p className="section-sub">
            We don't just provide tours; we create life-changing experiences with a focus on comfort, safety, and spiritual authenticity.
          </p>
        </div>

        <div className="why-grid">
          <div className="why-card reveal in">
            <div className="why-icon"><i className="fa-solid fa-shield-heart"></i></div>
            <div className="why-title">Safety First</div>
            <div className="why-desc">Your safety is our priority. Professional guides and verified accommodations on every trip.</div>
          </div>
          <div className="why-card reveal in">
            <div className="why-icon"><i className="fa-solid fa-gem"></i></div>
            <div className="why-title">Premium Service</div>
            <div className="why-desc">Enjoy luxury Volvo buses, 3-star deluxe hotels, and personalized attention throughout your journey.</div>
          </div>
          <div className="why-card reveal in">
            <div className="why-icon"><i className="fa-solid fa-tags"></i></div>
            <div className="why-title">Best Value</div>
            <div className="why-desc">Unbeatable prices with no hidden costs. We provide high-quality travel at budget-friendly rates.</div>
          </div>
          <div className="why-card reveal in">
            <div className="why-icon"><i className="fa-solid fa-map-location-dot"></i></div>
            <div className="why-title">Expert Guides</div>
            <div className="why-desc">Our local experts bring stories and traditions to life, ensuring a truly immersive experience.</div>
          </div>
        </div>
      </div>
    </section>
  );
}
