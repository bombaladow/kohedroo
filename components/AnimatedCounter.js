'use client';
import { useEffect, useRef } from 'react';
import { useInView, useMotionValue, useSpring, motion } from 'framer-motion';

export default function AnimatedCounter({ value, duration = 2 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  
  // بنشيل أي حروف من الرقم (زي علامة +) عشان نقدر نعد بالرقم
  const numericValue = parseInt(value.toString().replace(/[^0-9]/g, '')) || 0;
  const suffix = value.toString().replace(/[0-9]/g, ''); // بياخد علامة + لو موجودة

  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    damping: 30,
    stiffness: 100,
    duration: duration * 1000,
  });

  useEffect(() => {
    if (inView) {
      motionValue.set(numericValue);
    }
  }, [inView, numericValue, motionValue]);

  useEffect(() => {
    springValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = Math.floor(latest) + suffix;
      }
    });
  }, [springValue, suffix]);

  return <span ref={ref}>0{suffix}</span>;
}