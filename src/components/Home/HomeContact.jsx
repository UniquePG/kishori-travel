"use client";

export default function HomeContact() {
  return (
    <section id="contact">
      <div className="container">
        <div className="reveal in">
          <div className="section-label">Get In Touch</div>
          <h2 className="section-title">Let's Plan Your <em>Dream</em> Trip</h2>
          <p className="section-sub">Reach out to our experts for customized packages and expert travel advice.</p>
        </div>

        <div className="contact-grid">
          <div className="contact-info reveal in">
            <div className="contact-item">
              <div className="contact-icon"><i className="fa-solid fa-phone"></i></div>
              <div>
                <div className="contact-label">Call Us</div>
                <div className="contact-val"><a href="tel:+919811111111">+91 98111 11111</a></div>
              </div>
            </div>
            <div className="contact-item">
              <div className="contact-icon"><i className="fa-solid fa-envelope"></i></div>
              <div>
                <div className="contact-label">Email Us</div>
                <div className="contact-val"><a href="mailto:info@kishoritravels.com">info@kishoritravels.com</a></div>
              </div>
            </div>
            <div className="contact-item">
              <div className="contact-icon"><i className="fa-solid fa-location-dot"></i></div>
              <div>
                <div className="contact-label">Our Office</div>
                <div className="contact-val">Delhi, India</div>
              </div>
            </div>
          </div>

          <form className="contact-form reveal in" onSubmit={(e) => e.preventDefault()}>
            <div className="form-row">
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" placeholder="Enter your name" required />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" placeholder="Enter your email" required />
              </div>
            </div>
            <div className="form-group">
              <label>Select Destination</label>
              <select required>
                <option value="">Choose a destination</option>
                <option value="Uttarakhand">Uttarakhand</option>
                <option value="Kashmir">Kashmir</option>
                <option value="Rajasthan">Rajasthan</option>
              </select>
            </div>
            <div className="form-group">
              <label>Your Message</label>
              <textarea rows="4" placeholder="How can we help you?"></textarea>
            </div>
            <button type="submit" className="btn-primary">Send Inquiry →</button>
          </form>
        </div>
      </div>
    </section>
  );
}
