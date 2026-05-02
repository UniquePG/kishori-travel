import Hero from "../components/Hero";
import PackagesSection from "../components/PackagesSection";
import PromiseSection from "../components/PromiseSection";
import GallerySection from "../components/GallerySection";
import StatsSection from "../components/StatsSection";
import Testimonials from "../components/Testimonials";

export default function Home({ packages = [], gallery = [], testimonials = [] }) {
  return (
    <div className="flex flex-col gap-0">
      <Hero />
      <PackagesSection packages={packages} />
      <PromiseSection />
      <GallerySection gallery={gallery} />
      <StatsSection />
      <Testimonials testimonials={testimonials} />

      {/* Contact Section */}
      <section id="contact" className="py-24 px-6 lg:px-8 bg-white overflow-hidden relative border-t border-slate-100">
        <div className="absolute -right-20 top-0 text-[15rem] font-serif opacity-[0.03] select-none pointer-events-none">
          PLAN
        </div>
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-serif text-4xl md:text-6xl text-slate-900 italic">
            Plan Your Journey Today
          </h2>
          <p className="mt-6 text-lg text-slate-500 leading-relaxed">
            Have questions or ready to customize your perfect Indian getaway? Our travel experts
            are just a message away.
          </p>
          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-10 py-5 bg-orange-500 text-white rounded-full font-bold text-lg hover:bg-orange-600 transition-all shadow-xl shadow-orange-500/20">
              Send Inquiry
            </button>
            <button className="px-10 py-5 border border-slate-200 rounded-full font-bold text-lg hover:border-orange-500 hover:text-orange-500 transition-all">
              Chat on WhatsApp
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
