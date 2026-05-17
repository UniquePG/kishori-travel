"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function HomeContact() {
  const [packages, setPackages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    budget: "",
    days: "",
    night: "",
    numberOfPeople: "",
    destinationInterest: "",
    message: ""
  });

  useEffect(() => {
    fetch("/api/packages?activeOnly=1")
      .then(res => res.json())
      .then(data => setPackages(data))
      .catch(err => console.error("Failed to load packages", err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        toast.success("Thank you! Our team will contact you soon.");
        setFormData({
          fullName: "",
          phone: "",
          email: "",
          budget: "",
          days: "",
          night: "",
          numberOfPeople: "",
          destinationInterest: "",
          message: ""
        });
      } else {
        const data = await res.json();
        toast.error(data.error || "Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Inquiry submission error:", error);
      toast.error("Failed to send inquiry. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

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

          <form className="contact-form reveal in" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Full Name</label>
                <input 
                  type="text" 
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your name" 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input 
                  type="tel" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone" 
                  required 
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Email Address</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email" 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Budget (INR)</label>
                <input 
                  type="number" 
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  placeholder="E.g. 50000" 
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Days</label>
                <input 
                  type="number" 
                  name="days"
                  value={formData.days}
                  onChange={handleChange}
                  placeholder="No. of days" 
                />
              </div>
              <div className="form-group">
                <label>Nights</label>
                <input 
                  type="number" 
                  name="night"
                  value={formData.night}
                  onChange={handleChange}
                  placeholder="No. of nights" 
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>No. of People</label>
                <input 
                  type="number" 
                  name="numberOfPeople"
                  value={formData.numberOfPeople}
                  onChange={handleChange}
                  placeholder="E.g. 4" 
                />
              </div>
              <div className="form-group">
                <label>Interested in Package (Optional)</label>
                <select 
                  name="destinationInterest"
                  value={formData.destinationInterest}
                  onChange={handleChange}
                >
                  <option value="">Choose a package</option>
                  {packages.map(pkg => (
                    <option key={pkg.id} value={pkg.id}>{pkg.title}</option>
                  ))}
                  <option value="0">Custom Trip</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Your Message</label>
              <textarea 
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="4" 
                placeholder="How can we help you?"
              ></textarea>
            </div>
            
            <button 
              type="submit" 
              className="btn-primary" 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending...
                </span>
              ) : (
                "Send Inquiry →"
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
