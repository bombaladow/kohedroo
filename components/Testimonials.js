'use client';

export default function Testimonials({ testimonials }) {
  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section id="testimonials" className="py-20 px-6 md:px-12 border-t border-zinc-900">
      <h2 className="text-xs font-mono uppercase text-zinc-500 tracking-widest mb-12">
        Client Words
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((t, i) => (
          <div key={t.id || i} className="border border-zinc-900 rounded-xl p-7 bg-zinc-950/40">
            <p className="text-zinc-300 text-sm leading-relaxed mb-5">&ldquo;{t.quote}&rdquo;</p>
            <div className="font-semibold text-sm">{t.name}</div>
            <div className="text-zinc-500 text-xs font-mono uppercase tracking-wider mt-1">{t.role}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
