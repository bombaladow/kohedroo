'use client';

export default function AboutSection() {
  const brands = [
    'Dubai Duty Free',
    'Joyalukkas',
    'Giordano',
    'Rasasi Perfumes',
    'Al Ain Water',
    'OnPlan Group'
  ];

  return (
    <section id="about" className="py-20 px-6 md:px-12 border-t border-black/10 text-center">
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        
        <span className="text-xs font-mono uppercase text-zinc-500 tracking-widest font-bold mb-4 block">
          About & Background
        </span>

        <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-black leading-snug mb-8">
          Art Director & AI Creative Lead with 13+ years driving visual storytelling, AI production, and premium commercial branding across Dubai & Egypt.
        </h2>

        <div className="w-full mt-8 pt-8 border-t border-black/5">
          <span className="text-xs font-mono uppercase text-zinc-400 tracking-widest block mb-6 font-semibold">
            Brands & Clients Worked With
          </span>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-14 text-zinc-600 font-mono text-xs md:text-sm uppercase tracking-wider font-bold">
            {brands.map((brand, i) => (
              <span key={i} className="hover:text-black transition-colors">
                {brand}
              </span>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}