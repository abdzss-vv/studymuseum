import { useEffect, useState } from "react";
import { sampleTests } from "@/data/sample";
import type { Test } from "@/data/types";

const KEY = "collectnstudy.tests";

/** Tests list saved in this browser (starts with sample tests). */
export function useTests() {
  const [tests, setTests] = useState<Test[]>(sampleTests);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setTests(JSON.parse(raw));
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem(KEY, JSON.stringify(tests));
  }, [tests, loaded]);

  const sorted = [...tests].sort((a, b) => a.deadline.localeCompare(b.deadline));
  return {
    tests: sorted,
    add: (t: Omit<Test, "id">) => setTests((p) => [...p, { ...t, id: crypto.randomUUID() }]),
    update: (t: Test) => setTests((p) => p.map((x) => (x.id === t.id ? t : x))),
    remove: (id: string) => setTests((p) => p.filter((x) => x.id !== id)),
  };
}

export function daysUntil(deadline: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(deadline + "T00:00:00");
  return Math.round((d.getTime() - today.getTime()) / 86400000);
}

export function timeRemainingLabel(deadline: string) {
  const n = daysUntil(deadline);
  if (n < 0) return "Past";
  if (n === 0) return "Today";
  if (n === 1) return "Tomorrow";
  return `${n} days`;
}
