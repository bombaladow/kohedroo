'use client';
import { createContext, useContext, useState } from 'react';

const LoadingContext = createContext();

export function LoadingProvider({ children }) {
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  return (
    <LoadingContext.Provider value={{ isDataLoaded, setIsDataLoaded }}>
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  return useContext(LoadingContext);
}