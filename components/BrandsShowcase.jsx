'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import styles from './BrandCard.module.css';

function BrandCard({ brand, index, videos, images }) {
  const total = videos + images;

  return (
    <li className={styles.item}>
      <Link
        href={`/brand/${brand.id}`}
        className={styles.card}
        aria-label={`${brand.name}: view work`}
      >
        <span className={styles.index} aria-hidden="true">
          {String(index + 1).padStart(2, '0')}
        </span>

        <span className={styles.logo} style={brand.logo_bg ? { background: brand.logo_bg } : undefined}>
          {brand.logo_url ? (
            <img
              src={brand.logo_url}
              alt=""
              loading="lazy"
              decoding="async"
              width="72"
              height="72"
            />
          ) : (
            <span className={styles.logoFallback} aria-hidden="true">
              {brand.name?.[0]}
            </span>
          )}
        </span>

        <span className={styles.text}>
          <h3 className={styles.name}>{brand.name}</h3>
          <span className={styles.meta}>
            <span>{total} {total === 1 ? 'work' : 'works'}</span>
            {videos > 0 && <span>{videos} video</span>}
            {images > 0 && <span>{images} stills</span>}
          </span>
        </span>

        <span className={styles.arrow} aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M4 12h16M14 6l6 6-6 6" />
          </svg>
        </span>
      </Link>
    </li>
  );
}

export default function BrandsShowcase() {
  const [brands, setBrands] = useState([]);
  const [counts, setCounts] = useState({});

  useEffect(() => {
    const load = async () => {
      const [brandsRes, projectsRes] = await Promise.all([
        supabase.from('brands').select('*').order('sort_order', { ascending: true }),
        supabase.from('projects').select('brand_id, type').not('brand_id', 'is', null),
      ]);

      if (brandsRes.data) setBrands(brandsRes.data);

      const map = {};
      (projectsRes.data || []).forEach((p) => {
        if (!map[p.brand_id]) map[p.brand_id] = { videos: 0, images: 0 };
        if (p.type === 'video') map[p.brand_id].videos += 1;
        else map[p.brand_id].images += 1;
      });
      setCounts(map);
    };
    load();
  }, []);

  if (brands.length === 0) return null;

  return (
    <section id="brands" className={styles.section}>
      <div className={styles.inner}>
        <header className={styles.head}>
          <span className={styles.eyebrow}>Brands I&apos;ve worked with</span>
          <h2 className={styles.title}>
            Brands I&apos;ve <em>worked</em> with
          </h2>
        </header>

        <ul className={styles.list}>
          {brands.map((brand, i) => (
            <BrandCard
              key={brand.id}
              brand={brand}
              index={i}
              videos={counts[brand.id]?.videos || 0}
              images={counts[brand.id]?.images || 0}
            />
          ))}
        </ul>
      </div>
    </section>
  );
}
