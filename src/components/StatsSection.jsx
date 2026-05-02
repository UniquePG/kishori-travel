export default function StatsSection() {
  return (
    <section className="bg-white py-24 px-6 lg:px-8 border-y border-slate-100">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-16 lg:grid-cols-4 md:grid-cols-2 text-center">
          {[
            { label: "Happy Travellers", value: "50k+" },
            { label: "Unique Destinations", value: "150+" },
            { label: "Expert Guides", value: "200+" },
            { label: "Customer Rating", value: "4.9/5" },
          ].map((stat, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="text-4xl font-serif text-slate-900 mb-2">{stat.value}</div>
              <div className="text-xs font-bold uppercase tracking-widest text-orange-500">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
