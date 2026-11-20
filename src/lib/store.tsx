"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Comment } from "./data";

type Profile = { kommune: string; district: string; topics: string[] };

type State = {
  votes: Record<string, number>;
  likes: string[];
  follows: string[];
  comments: Record<string, Comment[]>;
  questions: number;
  profile: Profile;
  rewardDone: boolean;
  playground: Record<string, string> | null;
};

const EMPTY: State = {
  votes: {},
  likes: [],
  follows: [],
  comments: {},
  questions: 0,
  rewardDone: false,
  playground: null,
  profile: { kommune: "Saarbrücken", district: "St. Johann", topics: [] },
};
const KEY = "mitreden-v2";

type Ctx = State & {
  ready: boolean;
  vote: (pollId: string, value: number) => void;
  toggleLike: (id: string) => void;
  toggleFollow: (id: string) => void;
  addComment: (projectId: string, text: string) => void;
  sendQuestion: () => void;
  setProfile: (p: Partial<Profile>) => void;
  finishReward: () => void;
  savePlayground: (grid: Record<string, string>) => void;
};

const StoreContext = createContext<Ctx | null>(null);

const toggle = (list: string[], id: string) =>
  list.includes(id) ? list.filter((x) => x !== id) : [...list, id];

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<State>(EMPTY);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        setState({ ...EMPTY, ...saved, profile: { ...EMPTY.profile, ...saved.profile } });
      }
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {}
  }, [state, ready]);

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
    setState((s) => {
      const c: Comment = {
        id: `u-${Date.now()}`,
        author: "Du",
        district: s.profile.district,
        text,
        time: "gerade eben",
        likes: 0,
      };
      return { ...s, comments: { ...s.comments, [projectId]: [c, ...(s.comments[projectId] ?? [])] } };
    });
  }, []);
  const sendQuestion = useCallback(() => {
    setState((s) => ({ ...s, questions: s.questions + 1 }));
  }, []);
  const setProfile = useCallback((p: Partial<Profile>) => {
    setState((s) => ({ ...s, profile: { ...s.profile, ...p } }));
  }, []);

  const finishReward = useCallback(() => setState((s) => ({ ...s, rewardDone: true })), []);
  const savePlayground = useCallback(
    (grid: Record<string, string>) => setState((s) => ({ ...s, playground: grid })),
    [],
  );

  const value = useMemo(
    () => ({
      ...state,
      ready,
      vote,
      toggleLike,
      toggleFollow,
      addComment,
      sendQuestion,
      setProfile,
      finishReward,
      savePlayground,
    }),
    [state, ready, vote, toggleLike, toggleFollow, addComment, sendQuestion, setProfile, finishReward, savePlayground],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore outside provider");
  return ctx;
}

export function useCommentCount(projectId: string, seed: Comment[]) {
  const { comments } = useStore();
  return seed.reduce((n, c) => n + 1 + (c.replies?.length ?? 0), 0) + (comments[projectId]?.length ?? 0);
}
