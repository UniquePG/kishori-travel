"use client";

import { useState } from "react";

export default function HomeFAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    { q: "How can I book a tour with Kishori Travels?", a: "Booking is simple! You can book directly through our website by selecting a package and clicking 'Book Now', or you can contact us via WhatsApp or Phone for personalized assistance." },
    { q: "What is included in the package price?", a: "Most of our packages include transportation (Volvo/Private Cab), hotel accommodations, breakfast, dinner, and sightseeing. Specific inclusions vary by package, so please check the 'View Itinerary' section for details." },
    { q: "Is it safe for solo female travelers?", a: "Absolutely. Safety is our top priority. We provide verified accommodations, professional drivers/guides, and 24/7 support to ensure a safe and comfortable environment for everyone." },
    { q: "Do you offer customized tour packages?", a: "Yes, we specialize in tailor-made journeys. Tell us your preferences, budget, and duration, and our experts will create a custom itinerary just for you." },
    { q: "What is your cancellation policy?", a: "Our cancellation policy depends on the timing of the request. Generally, cancellations made 30 days before travel receive a full refund minus processing fees. Please contact us for specific terms." }
  ];

  return (
    <section id="faq">
      <div className="container">
        <div className="reveal in" style={{ textAlign: 'center' }}>
          <div className="faq-got-tag">GOT QUESTIONS?</div>
          <h2 className="section-title">Frequently Asked <em>Questions</em></h2>
          <p className="section-sub" style={{ margin: '0 auto 3rem' }}>Find answers to common queries about our services, bookings, and travel safety.</p>
        </div>

        <div className="faq-list">
          {faqs.map((faq, idx) => (
            <div key={idx} className={`faq-item ${openIndex === idx ? "open" : ""}`}>
              <button className="faq-q" onClick={() => setOpenIndex(openIndex === idx ? null : idx)}>
                <div className="faq-icon-wrap"><i className="fa-solid fa-circle-question"></i></div>
                <span className="faq-q-text">{faq.q}</span>
                <div className="faq-arrow"><i className="fa-solid fa-chevron-down"></i></div>
              </button>
              <div className="faq-ans">
                <p>{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
