"use client";

import { AlertCircle, ArrowRight, Clock3, LoaderCircle, RotateCcw, Sparkles, Trash2 } from "lucide-react";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { currency, number } from "@/lib/format";
import { useEstimateHistory } from "@/hooks/use-estimate-history";
import type { EstimateResponse } from "@/lib/generated/openapi/models/EstimateResponse";
import type { PropertyInput } from "@/lib/types";

const initialValues: PropertyInput = {
  square_footage: 1550,
  bedrooms: 3,
  bathrooms: 2,
  year_built: 1997,
  lot_size: 6800,
  distance_to_city_center: 4.1,
  school_rating: 7.6,
};

const fields: Array<{ key: keyof PropertyInput; label: string; suffix?: string; min: number; max?: number; step?: number }> = [
  { key: "square_footage", label: "Living area", suffix: "sq ft", min: 100 },
  { key: "bedrooms", label: "Bedrooms", min: 0, max: 20, step: 1 },
  { key: "bathrooms", label: "Bathrooms", min: 0, max: 20, step: 0.5 },
  { key: "year_built", label: "Year built", min: 1700, max: new Date().getFullYear() + 5, step: 1 },
  { key: "lot_size", label: "Lot size", suffix: "sq ft", min: 100 },
  { key: "distance_to_city_center", label: "Distance to centre", suffix: "mi", min: 0, step: 0.1 },
  { key: "school_rating", label: "School rating", suffix: "/ 10", min: 0, max: 10, step: 0.1 },
];

function validate(values: PropertyInput) {
  const errors: Partial<Record<keyof PropertyInput, string>> = {};
  for (const field of fields) {
    const value = values[field.key];
    if (!Number.isFinite(value)) errors[field.key] = "Enter a valid number";
    else if (value < field.min) errors[field.key] = `Must be at least ${field.min}`;
    else if (field.max !== undefined && value > field.max) errors[field.key] = `Must be ${field.max} or less`;
  }
  return errors;
}

export function EstimatorClient() {
  const [values, setValues] = useState<PropertyInput>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof PropertyInput, string>>>({});
  const [result, setResult] = useState<number | null>(null);
  const [requestError, setRequestError] = useState("");
  const [loading, setLoading] = useState(false);
  const { history, addEstimate, clearHistory } = useEstimateHistory();

  async function submit(event: FormEvent) {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setLoading(true);
    setRequestError("");
    try {
      const response = await fetch("/api/estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const body = (await response.json()) as EstimateResponse & { detail?: string };
      if (!response.ok) throw new Error(body.detail ?? "The estimate could not be completed");
      setResult(body.prediction);
      addEstimate({ ...values, id: crypto.randomUUID(), prediction: body.prediction, createdAt: new Date().toISOString() });
    } catch (error) {
      setRequestError(error instanceof Error ? error.message : "The estimate could not be completed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-8 grid items-start gap-6 xl:grid-cols-[minmax(0,1.25fr)_minmax(320px,.75fr)]">
      <form className="card p-5 sm:p-7" onSubmit={submit} noValidate>
        <div className="flex items-center justify-between gap-4">
          <div><h2 className="text-lg font-extrabold">Property details</h2><p className="mt-1 text-xs text-slate-500">All fields are required</p></div>
          <button type="button" className="secondary-button" onClick={() => { setValues(initialValues); setErrors({}); }}><RotateCcw size={15} /> Reset</button>
        </div>
        <div className="mt-7 grid gap-5 sm:grid-cols-2">
          {fields.map((field) => (
            <label key={field.key}>
              <span className="field-label">{field.label}</span>
              <div className="relative">
                <input
                  className={`field-input ${errors[field.key] ? "border-red-400" : ""}`}
                  type="number"
                  value={values[field.key]}
                  min={field.min}
                  max={field.max}
                  step={field.step ?? 1}
                  aria-invalid={Boolean(errors[field.key])}
                  aria-describedby={errors[field.key] ? `${field.key}-error` : undefined}
                  onChange={(event) => setValues({ ...values, [field.key]: event.target.valueAsNumber })}
                />
                {field.suffix && <span className="pointer-events-none absolute right-3 top-3 text-xs font-semibold text-slate-400">{field.suffix}</span>}
              </div>
              {errors[field.key] && <span id={`${field.key}-error`} className="mt-1.5 flex items-center gap-1 text-xs text-red-600"><AlertCircle size={12} />{errors[field.key]}</span>}
            </label>
          ))}
        </div>
        {requestError && <div role="alert" className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-700">{requestError}</div>}
        <button className="primary-button mt-7 w-full sm:w-auto" disabled={loading}>
          {loading ? <><LoaderCircle className="animate-spin" size={17} /> Calculating…</> : <><Sparkles size={17} /> Estimate property value</>}
        </button>
      </form>

      <div className="space-y-6">
        <section className="overflow-hidden rounded-2xl bg-slate-950 p-6 text-white" aria-live="polite">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-300">Estimated market value · USD</p>
          <p className="mt-4 text-4xl font-black tracking-[-0.04em]">{result === null ? "—" : currency.format(result)}</p>
          <p className="mt-2 text-xs text-slate-400">Regression estimate · not a formal appraisal</p>
          <div className="mt-7 border-t border-white/10 pt-5">
            <div className="mb-2 flex justify-between text-xs text-slate-400"><span>Relative value</span><span>{result ? `${Math.round((result / 450000) * 100)}%` : "0%"}</span></div>
            <div className="h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-emerald-400 transition-all duration-700" style={{ width: `${Math.min(100, result ? (result / 450000) * 100 : 0)}%` }} /></div>
          </div>
          {result !== null && (
            <table className="mt-6 w-full text-left text-xs">
              <tbody className="divide-y divide-white/10">
                <tr><th className="py-2 font-medium text-slate-400">Price / sq ft</th><td className="py-2 text-right font-bold">{currency.format(result / values.square_footage)}</td></tr>
                <tr><th className="py-2 font-medium text-slate-400">Living area</th><td className="py-2 text-right font-bold">{number.format(values.square_footage)} sq ft</td></tr>
                <tr><th className="py-2 font-medium text-slate-400">School rating</th><td className="py-2 text-right font-bold">{values.school_rating}/10</td></tr>
              </tbody>
            </table>
          )}
        </section>

        <section className="card p-5">
          <div className="flex items-center justify-between"><div className="flex items-center gap-2"><Clock3 size={17} className="text-emerald-700" /><h2 className="text-sm font-extrabold">Recent estimates</h2></div>{history.length > 0 && <button onClick={clearHistory} className="text-slate-400 hover:text-red-600" aria-label="Clear estimate history"><Trash2 size={15} /></button>}</div>
          <div className="mt-4 space-y-2">
            {history.slice(0, 4).map((item) => <div key={item.id} className="flex items-center justify-between rounded-xl bg-slate-50 p-3"><div><p className="text-sm font-bold">{currency.format(item.prediction)}</p><p className="text-[11px] text-slate-500">{number.format(item.square_footage)} sq ft · {item.bedrooms} beds</p></div><time className="text-[10px] text-slate-400">{new Date(item.createdAt).toLocaleDateString()}</time></div>)}
            {history.length === 0 && <p className="py-5 text-center text-xs text-slate-500">Your estimates will appear here.</p>}
          </div>
          <Link href="/estimator/compare" className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 text-xs font-bold text-emerald-700">Compare saved properties <ArrowRight size={14} /></Link>
        </section>
      </div>
    </div>
  );
}
