"use client";

export default function HomeFooter() {
  return (
    <footer className="home-footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <div className="f-logo">
            Kishori <span>Travels</span>
          </div>
          <p>
            Connecting you to the sacred and beautiful landscapes of India.
            Experience travel like never before with our expert-guided tours.
          </p>
          <div className="social-row">
            <a href="#" className="social-btn">
              <i className="fa-brands fa-facebook-f"></i>
            </a>
            <a href="#" className="social-btn">
              <i className="fa-brands fa-instagram"></i>
            </a>
            <a href="#" className="social-btn">
              <i className="fa-brands fa-whatsapp"></i>
            </a>
          </div>
        </div>

        <div className="footer-col">
          <h5>Quick Links</h5>
          <ul>
            <li>
              <a href="#hero">Home</a>
            </li>
            <li>
              <a href="#packages">Tour Packages</a>
            </li>
            <li>
              <a href="#gallery">Gallery</a>
            </li>
            <li>
              <a href="#faq">FAQ</a>
            </li>
          </ul>
        </div>

        <div className="footer-col">
          <h5>Popular Tours</h5>
          <ul>
            <li>
              <a href="#">Kedarnath Yatra</a>
            </li>
            <li>
              <a href="#">Kashmir Holiday</a>
            </li>
            <li>
              <a href="#">Manali Special</a>
            </li>
            <li>
              <a href="#">Goa Beach Tour</a>
            </li>
          </ul>
        </div>

        <div className="footer-col">
          <h5>Contact Info</h5>
          <ul>
            <li>
              <a href="mailto:info@kishoritravels.com">
                info@kishoritravels.com
              </a>
            </li>
            <li>
              <a href="tel:+919811111111">+91 98111 11111</a>
            </li>
            <li>
              <span>Delhi, India</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()} Kishori Travels. All Rights Reserved.
        </p>
        <p>Crafted with ❤️ for Travelers</p>
      </div>

      <div className="fab-group">
        <a
          href="https://wa.me/919811111111"
          className="fab flex items-center justify-center fab-wa"
          target="_blank"
        >
          <i className="fa-brands fa-whatsapp fab-icon"></i>
          <span className="fab-label">WhatsApp</span>
        </a>
        <a
          href="tel:+919811111111"
          className="fab flex items-center justify-center fab-call"
        >
          <i className="fa-solid fa-phone fab-icon"></i>
          <span className="fab-label">Call Us</span>
        </a>
        <a href="https://instagram.com" className="fab fab-ig">
          <i className="fa-brands fa-instagram fab-icon"></i>
          <span className="fab-label">Instagram</span>
        </a>
      </div>

      <button
        id="btt"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <i className="fa-solid fa-arrow-up"></i>
      </button>
    </footer>
  );
}
