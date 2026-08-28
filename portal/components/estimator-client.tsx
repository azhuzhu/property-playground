"use client";

import { AlertCircle, ArrowRight, BarChart3, LoaderCircle, RotateCcw, Sparkles, Table2, Trash2 } from "lucide-react";
import Link from "next/link";
import { type FormEvent, type KeyboardEvent, useState } from "react";
import { currency, number } from "@/lib/format";
import { useEstimateHistory } from "@/hooks/use-estimate-history";
import type { EstimateResponse } from "@/lib/generated/openapi/models/EstimateResponse";
import type { EstimateRecord, PropertyInput } from "@/lib/types";

type HistoryView = "chart" | "table";

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

function createEstimateId() {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).slice(2, 10);
  return `${timestamp}-${random}`;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(new Date(value));
}

function formatTime(value: string) {
  return new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" }).format(new Date(value));
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

export function EstimatorClient() {
  const [values, setValues] = useState<PropertyInput>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof PropertyInput, string>>>({});
  const [result, setResult] = useState<EstimateRecord | null>(null);
  const [historyView, setHistoryView] = useState<HistoryView>("chart");
  const [requestError, setRequestError] = useState("");
  const [loading, setLoading] = useState(false);
  const { history, addEstimate, clearHistory } = useEstimateHistory();
  const chartData = result !== null
    ? [result, ...history.filter((item) => item.id !== result.id).slice(0, 3)]
    : history.slice(0, 4);
  const chartMaximum = Math.max(...chartData.map((item) => item.prediction), 1);

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
      const estimate = {
        ...values,
        id: createEstimateId(),
        prediction: body.prediction,
        createdAt: new Date().toISOString(),
      };
      setResult(estimate);
      addEstimate(estimate);
    } catch (error) {
      setRequestError(error instanceof Error ? error.message : "The estimate could not be completed");
    } finally {
      setLoading(false);
    }
  }

  function changeHistoryTabFromKeyboard(event: KeyboardEvent<HTMLButtonElement>) {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const nextView = event.key === "ArrowLeft" || event.key === "Home" ? "chart" : "table";
    setHistoryView(nextView);
    document.getElementById(`estimate-${nextView}-tab`)?.focus();
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
          <p className="mt-4 text-4xl font-black tracking-[-0.04em]">{result === null ? "—" : currency.format(result.prediction)}</p>
          <p className="mt-2 text-xs text-slate-400">Regression estimate · not a formal appraisal</p>
          {result !== null && (
            <div className="mt-7 border-t border-white/10 pt-5">
              <table className="w-full text-left text-xs">
                <caption className="sr-only">Prediction results</caption>
                <tbody className="divide-y divide-white/10">
                  <tr><th className="py-2 font-medium text-slate-400">Estimated value</th><td className="py-2 text-right font-bold">{currency.format(result.prediction)}</td></tr>
                  <tr><th className="py-2 font-medium text-slate-400">Price / sq ft</th><td className="py-2 text-right font-bold">{currency.format(result.prediction / result.square_footage)}</td></tr>
                  <tr><th className="py-2 font-medium text-slate-400">Living area</th><td className="py-2 text-right font-bold">{number.format(result.square_footage)} sq ft</td></tr>
                  <tr><th className="py-2 font-medium text-slate-400">Bedrooms / bathrooms</th><td className="py-2 text-right font-bold">{result.bedrooms} / {result.bathrooms}</td></tr>
                  <tr><th className="py-2 font-medium text-slate-400">School rating</th><td className="py-2 text-right font-bold">{result.school_rating}/10</td></tr>
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="card overflow-hidden" aria-labelledby="estimate-history-heading">
          <div className="flex items-start justify-between gap-4 border-b border-slate-100 p-5">
            <div>
              <h2 id="estimate-history-heading" className="text-sm font-extrabold">Estimate history</h2>
              <p className="mt-1 text-xs text-slate-500">Explore saved predictions visually or in full detail.</p>
            </div>
            {history.length > 0 && <button onClick={clearHistory} className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600" aria-label="Clear estimate history"><Trash2 size={15} /></button>}
          </div>

          <div className="flex gap-1 border-b border-slate-200 px-4 pt-2" role="tablist" aria-label="Estimate history views">
            {([[
              "chart", "Chart", BarChart3,
            ], ["table", "Table", Table2]] as const).map(([view, label, Icon]) => (
              <button
                key={view}
                id={`estimate-${view}-tab`}
                type="button"
                role="tab"
                aria-selected={historyView === view}
                aria-controls={`estimate-${view}-panel`}
                tabIndex={historyView === view ? 0 : -1}
                className={`flex items-center gap-2 border-b-2 px-3 py-3 text-xs font-bold transition ${
                  historyView === view
                    ? "border-emerald-600 text-emerald-800"
                    : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-800"
                }`}
                onClick={() => setHistoryView(view)}
                onKeyDown={changeHistoryTabFromKeyboard}
              >
                <Icon size={15} aria-hidden="true" /> {label}
              </button>
            ))}
          </div>

          {historyView === "chart" && <div id="estimate-chart-panel" role="tabpanel" aria-labelledby="estimate-chart-tab" className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xs font-extrabold uppercase tracking-[0.08em] text-slate-700">Estimated value over time</h3>
                <p className="mt-1 text-[11px] text-slate-500">Hover or focus a column to inspect every property field.</p>
              </div>
              <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">{chartData.length} result{chartData.length === 1 ? "" : "s"}</span>
            </div>
            {chartData.length > 0 ? <div className="mt-6" aria-label="Recent prediction values by submission date and time">
              <div className="mb-2 flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.08em] text-slate-400">
                <span>Estimated value (USD)</span>
                <span>Hover for details</span>
              </div>
              <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${chartData.length}, minmax(0, 1fr))` }}>
                {chartData.map((item, index) => {
                  const isCurrent = result?.id === item.id;
                  const tooltipPosition = index === 0
                    ? "left-0"
                    : index === chartData.length - 1
                      ? "right-0"
                      : "left-1/2 -translate-x-1/2";
                  return <div
                    key={item.id}
                    className="group relative min-w-0 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
                    tabIndex={0}
                    aria-label={`${formatDateTime(item.createdAt)}: ${currency.format(item.prediction)}, ${number.format(item.square_footage)} square feet, ${item.bedrooms} bedrooms, ${item.bathrooms} bathrooms, built ${item.year_built}, lot ${number.format(item.lot_size)} square feet, ${item.distance_to_city_center} miles from centre, school rating ${item.school_rating} out of 10`}
                  >
                    <div className={`pointer-events-none absolute top-2 z-20 hidden w-60 rounded-xl bg-slate-950 p-3 text-left text-white shadow-2xl group-hover:block group-focus:block ${tooltipPosition}`} aria-hidden="true">
                      <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-2">
                        <div><p className="text-xs font-black">{currency.format(item.prediction)}</p><p className="mt-0.5 text-[9px] text-slate-400">{formatDateTime(item.createdAt)}</p></div>
                        {isCurrent && <span className="rounded-full bg-emerald-400/20 px-2 py-0.5 text-[9px] font-bold text-emerald-300">Current</span>}
                      </div>
                      <dl className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-[9px]">
                        <dt className="text-slate-400">Living area</dt><dd className="text-right font-bold">{number.format(item.square_footage)} sq ft</dd>
                        <dt className="text-slate-400">Lot size</dt><dd className="text-right font-bold">{number.format(item.lot_size)} sq ft</dd>
                        <dt className="text-slate-400">Beds / baths</dt><dd className="text-right font-bold">{item.bedrooms} / {item.bathrooms}</dd>
                        <dt className="text-slate-400">Year built</dt><dd className="text-right font-bold">{item.year_built}</dd>
                        <dt className="text-slate-400">Distance</dt><dd className="text-right font-bold">{item.distance_to_city_center} mi</dd>
                        <dt className="text-slate-400">School</dt><dd className="text-right font-bold">{item.school_rating}/10</dd>
                      </dl>
                    </div>
                    <div className="flex h-44 flex-col justify-end border-b border-slate-200 px-1">
                      <span className="mb-1 truncate text-center text-[9px] font-extrabold text-slate-600">{currency.format(item.prediction)}</span>
                      <div
                        className={`mx-auto w-full max-w-12 rounded-t-lg transition-all duration-700 group-hover:bg-amber-400 group-focus:bg-amber-400 ${isCurrent ? "bg-emerald-500" : "bg-slate-300"}`}
                        style={{ height: `${Math.max(12, (item.prediction / chartMaximum) * 82)}%` }}
                      />
                    </div>
                    <time dateTime={item.createdAt} className="mt-2 block text-center text-[9px] font-bold leading-4 text-slate-500">
                      <span className="block">{formatDate(item.createdAt)}</span>
                      <span className="block font-medium text-slate-400">{formatTime(item.createdAt)}</span>
                    </time>
                  </div>;
                })}
              </div>
              <p className="mt-3 text-center text-[10px] font-bold uppercase tracking-[0.08em] text-slate-400">Submission date and time</p>
            </div> : <div className="py-12 text-center">
              <BarChart3 className="mx-auto text-slate-300" size={28} />
              <p className="mt-3 text-xs font-bold text-slate-600">No predictions to chart</p>
              <p className="mt-1 text-[11px] text-slate-400">Your estimates will appear here.</p>
            </div>}
          </div>}

          {historyView === "table" && <div id="estimate-table-panel" role="tabpanel" aria-labelledby="estimate-table-tab">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1120px] text-left text-xs">
                <caption className="sr-only">All saved estimate fields</caption>
                <thead className="bg-slate-50 text-[10px] uppercase tracking-[0.08em] text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Date & time</th>
                    <th className="px-4 py-3">Prediction</th>
                    <th className="px-4 py-3">Living area</th>
                    <th className="px-4 py-3">Lot size</th>
                    <th className="px-4 py-3">Beds</th>
                    <th className="px-4 py-3">Baths</th>
                    <th className="px-4 py-3">Year built</th>
                    <th className="px-4 py-3">Distance</th>
                    <th className="px-4 py-3">School</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {history.map((item) => <tr key={item.id} className="transition hover:bg-emerald-50/50">
                    <td className="whitespace-nowrap px-4 py-3"><time dateTime={item.createdAt}>{formatDateTime(item.createdAt)}</time></td>
                    <td className="whitespace-nowrap px-4 py-3 font-extrabold text-emerald-700">{currency.format(item.prediction)}</td>
                    <td className="whitespace-nowrap px-4 py-3">{number.format(item.square_footage)} sq ft</td>
                    <td className="whitespace-nowrap px-4 py-3">{number.format(item.lot_size)} sq ft</td>
                    <td className="px-4 py-3">{item.bedrooms}</td>
                    <td className="px-4 py-3">{item.bathrooms}</td>
                    <td className="px-4 py-3">{item.year_built}</td>
                    <td className="whitespace-nowrap px-4 py-3">{item.distance_to_city_center} mi</td>
                    <td className="px-4 py-3">{item.school_rating}/10</td>
                  </tr>)}
                  {history.length === 0 && <tr><td colSpan={9} className="py-12 text-center text-xs text-slate-500">Your estimates will appear here.</td></tr>}
                </tbody>
              </table>
            </div>
            <Link href="/estimator/compare" className="flex items-center justify-between border-t border-slate-100 px-5 py-4 text-xs font-bold text-emerald-700">Compare saved properties <ArrowRight size={14} /></Link>
          </div>}
        </section>
      </div>
    </div>
  );
}
