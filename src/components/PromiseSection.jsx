import { Map } from "lucide-react";

export default function PromiseSection() {
  return (
    <section className="bg-[#0a0502] py-24 text-white px-6 lg:px-8">
      <div className="mx-auto max-w-7xl grid gap-16 lg:grid-cols-2 items-center">
        <div>
          <span className="text-xs font-bold tracking-[0.3em] text-orange-500 uppercase">
            Our Promise
          </span>
          <h2 className="mt-4 font-serif text-4xl leading-tight md:text-6xl">
            We don&apos;t just plan trips - we craft <span className="italic">memories that last</span> a
            lifetime.
          </h2>
        </div>
        <div className="grid gap-8 sm:grid-cols-2">
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
            <div className="h-10 w-10 bg-orange-500 rounded-lg flex items-center justify-center mb-4">
              <Map className="text-white h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Expert Guides</h3>
            <p className="text-slate-400 text-sm">
              Passionate locals who bring each destination alive with stories, culture, and
              insight.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
            <div className="h-10 w-10 bg-orange-500 rounded-lg flex items-center justify-center mb-4">
              <Map className="text-white h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Secure Travel</h3>
            <p className="text-slate-400 text-sm">
              All tours include comprehensive insurance, 24/7 support, and vetted accommodation
              partners.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
