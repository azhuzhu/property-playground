import type { Metadata } from "next";
import { ComparisonClient } from "@/components/comparison-client";

export const metadata: Metadata = { title: "Compare properties" };

export default function ComparisonPage() {
  return (
    <div className="page-shell">
      <p className="eyebrow">Estimator · Comparison</p>
      <h1 className="page-title">Compare property scenarios</h1>
      <p className="page-copy">Place saved estimates side by side to understand how value drivers differ between properties.</p>
      <ComparisonClient />
    </div>
  );
}
