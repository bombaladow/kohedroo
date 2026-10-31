'use client';
import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { useLoading } from '@/lib/LoadingContext';
import VideoModal from '@/components/VideoModal';
import ImageLightbox from '@/components/ImageLightbox';
import styles from './brandPage.module.css';

const TABS = [
  { key: 'all', label: 'All' },
  { key: 'video', label: 'Motion' },
  { key: 'image', label: 'Stills' },
];

function VideoTile({ project, onOpen }) {
  // Orientation is read from the poster once it loads, so vertical
  // and horizontal videos each keep their own shape in the masonry.
  const [ratio, setRatio] = useState('16 / 9');

  return (
    <button
      type="button"
      className={styles.tile}
      onClick={() => onOpen(project.video_url || project.media_url)}
      aria-label={`Play ${project.title}`}
    >
      <span className={`${styles.frame} ${styles.frameVideo}`} style={{ aspectRatio: ratio }}>
        {project.media_url && (
          <img
            src={project.media_url}
            alt=""
            loading="lazy"
            decoding="async"
            onLoad={(e) => {
              const { naturalWidth: w, naturalHeight: h } = e.currentTarget;
              if (w && h) setRatio(`${w} / ${h}`);
            }}
          />
        )}
        <span className={styles.play} aria-hidden="true">
          <svg viewBox="0 0 24 24"><path d="M6 4l14 8-14 8z" /></svg>
        </span>
      </span>
      <span className={styles.caption}>
        <span className={styles.captionTitle}>{project.title}</span>
        <span className={`${styles.mono} ${styles.captionMeta}`}>{project.year}</span>
      </span>
    </button>
  );
}

function ImageTile({ project, onOpen }) {
  return (
    <button
      type="button"
      className={styles.tile}
      onClick={() => onOpen(project.media_url)}
      aria-label={`Open ${project.title}`}
    >
      <span className={styles.frame}>
        <img src={project.media_url} alt={project.title || ''} loading="lazy" decoding="async" />
      </span>
      <span className={styles.caption}>
        <span className={styles.captionTitle}>{project.title}</span>
        <span className={`${styles.mono} ${styles.captionMeta}`}>{project.year}</span>
      </span>
    </button>
  );
}

function Section({ title, accent, count, children }) {
  return (
    <section className={styles.section}>
      <div className={styles.sectionHead}>
        <h2 className={styles.sectionTitle}>
          <em>{accent}</em> {title}
        </h2>
        <span className={`${styles.mono} ${styles.count}`}>{String(count).padStart(2, '0')}</span>
      </div>
      <div className={styles.masonry}>{children}</div>
    </section>
  );
}

export default function BrandPage() {
  const { id } = useParams();
  const router = useRouter();
  const { setIsDataLoaded } = useLoading();

  const [brand, setBrand] = useState(null);
  const [projects, setProjects] = useState([]);
  const [tab, setTab] = useState('all');
  const [activeVideo, setActiveVideo] = useState(null);
  const [activeImage, setActiveImage] = useState(null);

  // Read the filter from the URL (?type=video) so a filtered view can be shared
  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get('type');
    if (t === 'video' || t === 'image') setTab(t);
  }, []);

  useEffect(() => {
    const load = async () => {
      const { data: brandData, error } = await supabase
        .from('brands')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !brandData) {
        setIsDataLoaded(true);
        router.push('/');
        return;
      }
      setBrand(brandData);

      const { data: projectsData } = await supabase
        .from('projects')
        .select('*')
        .eq('brand_id', id)
        .order('sort_order', { ascending: true });

      setProjects(projectsData || []);
      setIsDataLoaded(true);
    };
    load();
  }, [id, router, setIsDataLoaded]);

  const videos = useMemo(() => projects.filter((p) => p.type === 'video'), [projects]);
  const images = useMemo(() => projects.filter((p) => p.type !== 'video'), [projects]);

  const yearsLabel = useMemo(() => {
    const ys = projects.map((p) => parseInt(p.year, 10)).filter(Boolean);
    if (ys.length === 0) return '-';
    const min = Math.min(...ys);
    const max = Math.max(...ys);
    return min === max ? String(min) : `${min}-${String(max).slice(2)}`;
  }, [projects]);

  const changeTab = (key) => {
    setTab(key);
    const url = new URL(window.location.href);
    if (key === 'all') url.searchParams.delete('type');
    else url.searchParams.set('type', key);
    window.history.replaceState(null, '', url);
  };

  if (!brand) return <div className={`${styles.loading} ${styles.mono}`}>Loading</div>;

  const counts = { all: projects.length, video: videos.length, image: images.length };
  const showVideos = (tab === 'all' || tab === 'video') && videos.length > 0;
  const showImages = (tab === 'all' || tab === 'image') && images.length > 0;

  return (
    <div className={styles.page}>
      <header className={`${styles.hero} ${styles.wrap}`}>
        <Link href="/#brands" className={`${styles.back} ${styles.mono}`}>
          <span aria-hidden="true">&larr;</span> All brands
        </Link>

        <div className={styles.heroGrid}>
          <div>
            <div className={styles.logo} style={brand.logo_bg ? { background: brand.logo_bg } : undefined}>
              {brand.logo_url && <img src={brand.logo_url} alt="" />}
            </div>
            <span className={`${styles.mono} ${styles.eyebrow}`}>Client / Case study</span>
            <h1 className={styles.name}>{brand.name}</h1>
            {brand.description && <p className={styles.desc}>{brand.description}</p>}
          </div>

          <dl className={styles.stats}>
            <div className={styles.stat}>
              <dt className={styles.mono}>Motion</dt>
              <dd>{videos.length}</dd>
            </div>
            <div className={styles.stat}>
              <dt className={styles.mono}>Stills</dt>
              <dd>{images.length}</dd>
            </div>
            <div className={styles.stat}>
              <dt className={styles.mono}>Years</dt>
              <dd>{yearsLabel}</dd>
            </div>
          </dl>
        </div>
      </header>

      <div className={styles.bar}>
        <div className={`${styles.barInner} ${styles.wrap}`} role="group" aria-label="Filter work">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              aria-pressed={tab === t.key}
              onClick={() => changeTab(t.key)}
              className={`${styles.tab} ${styles.mono} ${tab === t.key ? styles.tabActive : ''}`}
            >
              {t.label}
              <sup>{counts[t.key]}</sup>
            </button>
          ))}
        </div>
      </div>

      <main className={`${styles.content} ${styles.wrap}`}>
        {showVideos && (
          <Section accent="Motion" title="& reels" count={videos.length}>
            {videos.map((p) => (
              <VideoTile key={p.id} project={p} onOpen={setActiveVideo} />
            ))}
          </Section>
        )}

        {showImages && (
          <Section accent="Stills" title="& design" count={images.length}>
            {images.map((p) => (
              <ImageTile key={p.id} project={p} onOpen={setActiveImage} />
            ))}
          </Section>
        )}

        {!showVideos && !showImages && (
          <p className={`${styles.empty} ${styles.mono}`}>No work in this section yet.</p>
        )}
      </main>

      <VideoModal isOpen={!!activeVideo} onClose={() => setActiveVideo(null)} videoUrl={activeVideo} />
      <ImageLightbox isOpen={!!activeImage} onClose={() => setActiveImage(null)} imageUrl={activeImage} />
    </div>
  );
}
