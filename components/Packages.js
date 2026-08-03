'use client';

export default function Packages({ packages }) {
  if (!packages || packages.length === 0) return null;

  return (
    <section id="packages" className="py-20 px-6 md:px-12 border-t border-zinc-900 bg-zinc-950/50">
      <h2 className="text-xs font-mono uppercase text-zinc-500 tracking-widest mb-12">
        Packages & Pricing
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {packages.map((pkg, i) => (
          <div key={pkg.id || i} className="border border-zinc-800 rounded-xl p-8 bg-black/40 hover:border-zinc-600 transition-colors">
            <h3 className="text-xl font-bold mb-2">{pkg.title}</h3>
            <div className="text-2xl font-extrabold tracking-tighter mb-6">{pkg.price}</div>
            <ul className="space-y-3 text-sm text-zinc-400">
              {(pkg.features || '').split('\n').filter(Boolean).map((f, j) => (
                <li key={j} className="flex items-start gap-2">
                  <span className="text-zinc-600">—</span> {f}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
