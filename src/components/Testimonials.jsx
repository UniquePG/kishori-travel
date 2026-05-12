import { Star, Quote } from "lucide-react";

export default function Testimonials({ testimonials = [] }) {
  if (testimonials.length === 0) {
    return null; // Or some fallback
  }

  return (
    <section id="reviews" className="bg-[#fcf8f3] py-24 px-6 lg:px-8">
      <div className="mx-auto max-w-7xl text-center">
        <span className="text-xs font-bold tracking-[0.3em] text-orange-500 uppercase">
          What Travellers Say
        </span>
        <h2 className="mt-2 font-serif text-4xl text-slate-900 md:text-5xl italic">
          Stories from Our Guests
        </h2>

        <div className="mt-16 grid gap-8 md:grid-cols-2">
          {testimonials?.map((t) => (
            <div
              key={t.id}
              className="relative bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-50 text-left group hover:shadow-xl transition-all"
            >
              <div className="absolute top-10 right-10 opacity-10 group-hover:opacity-20 transition-opacity">
                <Quote className="h-16 w-16 text-orange-500" />
              </div>

              <div className="flex gap-1 mb-6">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-orange-400 text-orange-400" />
                ))}
              </div>

              <p className="text-lg text-slate-600 leading-relaxed italic mb-8">
                &ldquo;{t.review}&rdquo;
              </p>

              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-xl uppercase">
                  {t.name?.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">{t.name}</h4>
                  <p className="text-sm text-slate-400 font-medium">
                    {t?.location} - {t?.date}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
