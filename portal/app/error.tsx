"use client";

import { AlertTriangle } from "lucide-react";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="grid min-h-screen place-items-center px-6">
      <div className="card max-w-md p-8 text-center">
        <AlertTriangle className="mx-auto text-amber-500" size={34} aria-hidden="true" />
        <h1 className="mt-5 text-2xl font-extrabold">Something went off plan</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">The portal could not load this view. Your saved estimates are still safe in this browser.</p>
        <button className="primary-button mt-6" onClick={reset}>Try again</button>
      </div>
    </div>
  );
}
