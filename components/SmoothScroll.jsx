'use client';
import { ReactLenis } from 'lenis/react';

export default function SmoothScroll({ children }) {
  return (
    <ReactLenis root options={{ lerp: 0.08, smoothWheel: true, autoRaf: true }}>
      {children}
    </ReactLenis>
  );
}