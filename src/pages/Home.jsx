"use client";

import { useEffect } from "react";
import "../styles/home-reference.css";

import HomeNavbar from "../components/Home/HomeNavbar";
import HomeHero from "../components/Home/HomeHero";
import HomeSearchBar from "../components/Home/HomeSearchBar";
import HomePackages from "../components/Home/HomePackages";
import HomeWhyUs from "../components/Home/HomeWhyUs";
import HomeGallery from "../components/Home/HomeGallery";
import HomeVideos from "../components/Home/HomeVideos";
import HomeFAQ from "../components/Home/HomeFAQ";
import HomeTestimonials from "../components/Home/HomeTestimonials";
import HomeContact from "../components/Home/HomeContact";
import HomeFooter from "../components/Home/HomeFooter";

export default function Home({ packages = [], gallery = [], testimonials = [], faqs = [] }) {
  useEffect(() => {
    // Reveal animation logic
    const observerOptions = {
      threshold: 0.12,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const revealElements = document.querySelectorAll(".reveal");
    revealElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [packages, gallery, testimonials]);

  const images = gallery.filter(item => item.mediaType === 'photo')
  const videos = gallery.filter(item => item.mediaType === 'video')


  return (
    <div className="home-body">
      <HomeNavbar />
      <HomeHero />
      <HomeSearchBar />
      <HomePackages packages={packages} />
      <HomeWhyUs />
      <HomeGallery images={images} />
      <HomeVideos videos={videos} />
      <HomeFAQ faqs={faqs} />
      <HomeTestimonials testimonials={testimonials} />
      <HomeContact />
      <HomeFooter />
    </div>
  );
}
