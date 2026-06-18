"use client"

import { Provider } from "react-redux"
import { store } from "./lib/store"
import { useEffect, useState } from "react"

export function Providers({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    try {
      const savedState = localStorage.getItem('ordolait_state');
      if (savedState) {
        store.dispatch({ type: 'HYDRATE_STATE', payload: JSON.parse(savedState) });
      }
    } catch (e) {
      console.error("Failed to load state from localStorage", e);
    } finally {
      setIsReady(true);
    }
  }, []);

  if (!isReady) return null;

  return <Provider store={store}>{children}</Provider>
}
