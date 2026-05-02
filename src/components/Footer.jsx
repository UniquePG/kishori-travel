import Link from "next/link";
import { Instagram, Facebook, Twitter, Mail, Phone, MapPin, Plane } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#0a0502] pt-24 pb-12 text-white px-6 lg:px-8 overflow-hidden">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-orange-500 p-1 rounded-lg">
                <Plane className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-serif tracking-tight">
                Kishori <span className="text-orange-500">Travel</span>
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Creating unforgettable journeys across Incredible India since 2010.
              Your adventure, our expertise.
            </p>
            <div className="flex gap-4">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-orange-500 transition-colors"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-6 uppercase tracking-widest text-xs text-orange-500">
              Explore
            </h4>
            <ul className="space-y-4 text-sm text-slate-400">
              <li><a href="#packages" className="hover:text-white transition-colors">Tour Packages</a></li>
              <li><a href="#gallery" className="hover:text-white transition-colors">Gallery</a></li>
              <li><a href="#reviews" className="hover:text-white transition-colors">Reviews</a></li>
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 uppercase tracking-widest text-xs text-orange-500">
              Popular
            </h4>
            <ul className="space-y-4 text-sm text-slate-400">
              <li><a href="#" className="hover:text-white transition-colors">Rajasthan</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Kerala</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Himachal Pradesh</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Uttarakhand</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 uppercase tracking-widest text-xs text-orange-500">
              Get in Touch
            </h4>
            <ul className="space-y-4 text-sm text-slate-400">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-orange-500 pt-1" />
                <span>123 Travel Lane, Jaipur, Rajasthan - 302001</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-orange-500" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-orange-500" />
                <span>hello@kishoritravel.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] uppercase tracking-widest text-slate-500 font-bold">
          <p>&copy; 2024 Kishori Travel. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <Link href="/login" className="text-orange-500">Admin Panel</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
