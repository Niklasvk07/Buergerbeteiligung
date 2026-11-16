"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Comment } from "./data";

type State = {
  votes: Record<string, number>;
  likes: string[];
  follows: string[];
  comments: Record<string, Comment[]>;
};

const EMPTY: State = { votes: {}, likes: [], follows: [], comments: {} };
const KEY = "mitreden-v1";

type Ctx = State & {
  ready: boolean;
  vote: (pollId: string, value: number) => void;
  toggleLike: (id: string) => void;
  toggleFollow: (id: string) => void;
  addComment: (projectId: string, text: string) => void;
};

const StoreContext = createContext<Ctx | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<State>(EMPTY);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setState({ ...EMPTY, ...JSON.parse(raw) });
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {}
  }, [state, ready]);

  const toggle = (list: string[], id: string) =>
    list.includes(id) ? list.filter((x) => x !== id) : [...list, id];

  const vote = useCallback((pollId: string, value: number) => {
    setState((s) => ({ ...s, votes: { ...s.votes, [pollId]: value } }));
  }, []);
  const toggleLike = useCallback((id: string) => {
    setState((s) => ({ ...s, likes: toggle(s.likes, id) }));
  }, []);
  const toggleFollow = useCallback((id: string) => {
    setState((s) => ({ ...s, follows: toggle(s.follows, id) }));
  }, []);
  const addComment = useCallback((projectId: string, text: string) => {
    const c: Comment = {
      id: `u-${Date.now()}`,
      author: "Du",
      district: "Altstadt",
      text,
      time: "gerade eben",
      likes: 0,
    };
    setState((s) => ({
      ...s,
      comments: { ...s.comments, [projectId]: [c, ...(s.comments[projectId] ?? [])] },
    }));
  }, []);

  const value = useMemo(
    () => ({ ...state, ready, vote, toggleLike, toggleFollow, addComment }),
    [state, ready, vote, toggleLike, toggleFollow, addComment],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore outside provider");
  return ctx;
}
