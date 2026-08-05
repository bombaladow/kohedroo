'use client';

export default function Packages({ packages }) {
  if (!packages || packages.length === 0) return null;

  return (
    <section id="packages" className="py-20 px-6 md:px-12 border-t border-black/10 bg-transparent">
      <h2 className="text-xs font-mono uppercase text-zinc-600 tracking-widest mb-12 font-bold">
        Packages & Pricing
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {packages.map((pkg, i) => (
          <div 
            key={pkg.id || i} 
            className="border border-black/10 rounded-xl p-8 bg-white/70 backdrop-blur-md hover:bg-white/90 hover:border-black/30 transition-all shadow-sm"
          >
            <h3 className="text-xl font-bold mb-2 text-black">{pkg.title}</h3>
            <div className="text-2xl font-extrabold tracking-tighter mb-6 text-black">{pkg.price}</div>
            <ul className="space-y-3 text-sm text-zinc-700 font-medium">
              {(pkg.features || '').split('\n').filter(Boolean).map((f, j) => (
                <li key={j} className="flex items-start gap-2">
                  <span className="text-zinc-400">—</span> {f}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}