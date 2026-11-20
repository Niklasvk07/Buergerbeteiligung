"use client";

import { useEffect } from "react";

/** Setzt den Prototyp zurück (Stimmen, Kommentare, Abzeichen, Pop-up) – praktisch für Präsentationen */
export default function Reset() {
  useEffect(() => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch {}
    // harter Neuladen, damit auch der App-Zustand im Speicher leer ist
    window.location.replace("/");
  }, []);

  return <p className="py-20 text-center text-[15px] text-muted">Wird zurückgesetzt …</p>;
}
