'use client';

export default function Services({ services }) {
  return (
    <section id="services" className="py-20 px-6 md:px-12 border-t border-black/10 bg-transparent">
      <h2 className="text-xs font-mono uppercase text-zinc-600 tracking-widest mb-12 font-bold">
        Capabilities & Services
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {services.map((service, i) => (
          <div 
            key={service.id || i} 
            className="border border-black/10 p-8 rounded-xl bg-white/70 backdrop-blur-md hover:bg-white/90 hover:border-black/30 transition-all shadow-sm"
          >
            <span className="font-mono text-xs text-zinc-500 font-semibold">
              {service.number || String(i + 1).padStart(2, '0')}
            </span>
            <h3 className="text-2xl font-bold mt-4 mb-2 text-black">{service.title}</h3>
            <p className="text-zinc-700 text-sm leading-relaxed">{service.description || service.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}