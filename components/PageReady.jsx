'use client';
import { useEffect } from 'react';
import { useLoading } from '@/lib/LoadingContext';

export default function PageReady() {
  const { setIsDataLoaded } = useLoading();
  useEffect(() => { setIsDataLoaded(true); }, [setIsDataLoaded]);
  return null;
}