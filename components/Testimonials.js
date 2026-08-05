'use client';

export default function Testimonials({ testimonials }) {
  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section id="testimonials" className="py-20 px-6 md:px-12 border-t border-black/10 bg-transparent">
      <h2 className="text-xs font-mono uppercase text-zinc-600 tracking-widest mb-12 font-bold">
        Client Words
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((t, i) => (
          <div 
            key={t.id || i} 
            className="border border-black/10 rounded-xl p-7 bg-white/70 backdrop-blur-md hover:bg-white/90 hover:border-black/30 transition-all shadow-sm flex flex-col justify-between"
          >
            <p className="text-zinc-800 text-sm leading-relaxed mb-6 font-normal">
              &ldquo;{t.quote}&rdquo;
            </p>
            <div>
              <div className="font-bold text-sm text-black">{t.name}</div>
              <div className="text-zinc-500 text-xs font-mono uppercase tracking-wider mt-1 font-medium">
                {t.role}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}