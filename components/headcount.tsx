"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";

export const MIN_HEADS = 2;
export const MAX_HEADS = 9;
export const DEFAULT_HEADS = 6;

const STORE_KEY = "donner-headcount";

export const HEAD_RANGE = Array.from(
  { length: MAX_HEADS - MIN_HEADS + 1 },
  (_, i) => MIN_HEADS + i
);

const clamp = (n: number) =>
  Math.min(MAX_HEADS, Math.max(MIN_HEADS, Math.round(n)));

type HeadcountValue = {
  headcount: number;
  setHeadcount: (n: number) => void;
};

const HeadcountContext = createContext<HeadcountValue>({
  headcount: DEFAULT_HEADS,
  setHeadcount: () => {},
});

/* Runs before paint on the client so a shared ?n= link doesn't flash the
   default number first. On the server it is a no-op. */
const useBeforePaint =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

export function HeadcountProvider({ children }: { children: React.ReactNode }) {
  const [headcount, setValue] = useState(DEFAULT_HEADS);

  useBeforePaint(() => {
    let stored: string | null = null;
    try {
      stored = window.localStorage.getItem(STORE_KEY);
    } catch {
      stored = null;
    }
    const fromUrl = new URL(window.location.href).searchParams.get("n");
    const raw = Number(fromUrl ?? stored);
    if (Number.isFinite(raw) && raw > 0) {
      const next = clamp(raw);
      if (next !== DEFAULT_HEADS) setValue(next);
    }
  }, []);

  const setHeadcount = useCallback((n: number) => {
    const next = clamp(n);
    setValue(next);
    try {
      window.localStorage.setItem(STORE_KEY, String(next));
    } catch {
      /* private browsing — the number just won't persist */
    }
    const url = new URL(window.location.href);
    url.searchParams.set("n", String(next));
    window.history.replaceState(null, "", url.toString());
  }, []);

  return (
    <HeadcountContext.Provider value={{ headcount, setHeadcount }}>
      {children}
    </HeadcountContext.Provider>
  );
}

export const useHeadcount = () => useContext(HeadcountContext);
