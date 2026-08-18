import type { Metadata } from "next";
import { EstimatorClient } from "@/components/estimator-client";

export const metadata: Metadata = { title: "Value estimator" };

export default function EstimatorPage() {
  return (
    <div className="page-shell">
      <p className="eyebrow">App 01 · Python backend</p>
      <h1 className="page-title">Property value estimator</h1>
      <p className="page-copy">Enter the property characteristics used by the regression model to receive an instant estimate and save it locally for comparison.</p>
      <EstimatorClient />
    </div>
  );
}
