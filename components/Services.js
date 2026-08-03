'use client';

export default function Services({ services }) {
  return (
    <section id="services" className="py-20 px-6 md:px-12 border-t border-zinc-900 bg-zinc-950/50">
      <h2 className="text-xs font-mono uppercase text-zinc-500 tracking-widest mb-12">
        Capabilities & Services
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {services.map((service, i) => (
          <div key={service.id || i} className="border border-zinc-900 p-8 rounded-xl bg-black/40 hover:border-zinc-700 transition-colors">
            <span className="font-mono text-xs text-zinc-500">{service.number || String(i + 1).padStart(2, '0')}</span>
            <h3 className="text-2xl font-bold mt-4 mb-2">{service.title}</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">{service.description || service.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
