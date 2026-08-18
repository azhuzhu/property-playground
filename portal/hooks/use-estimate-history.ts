"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import type { EstimateRecord } from "@/lib/types";

const STORAGE_KEY = "property-estimate-history-v1";
const CHANGE_EVENT = "property-estimate-history-change";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(CHANGE_EVENT, callback);
  };
}

function getSnapshot() {
  return localStorage.getItem(STORAGE_KEY) ?? "[]";
}

export function useEstimateHistory() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, () => "[]");
  const history = useMemo<EstimateRecord[]>(() => {
    try {
      return JSON.parse(snapshot);
    } catch {
      return [];
    }
  }, [snapshot]);

  const persist = useCallback((records: EstimateRecord[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }, []);

  const addEstimate = useCallback(
    (record: EstimateRecord) => persist([record, ...history].slice(0, 20)),
    [history, persist],
  );

  const clearHistory = useCallback(() => persist([]), [persist]);

  return { history, addEstimate, clearHistory };
}
