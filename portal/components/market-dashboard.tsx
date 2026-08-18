"use client";

import { ArrowDownToLine, ArrowUpDown, BarChart3, FileText, LoaderCircle, SlidersHorizontal, WandSparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { currency, number } from "@/lib/format";
import type { MarketSummary, Property, PropertyInput } from "@/lib/types";
import type { PredictionResponse } from "@/lib/generated/openapi/models/PredictionResponse";

type Props = { initialSummary: MarketSummary; initialProperties: Property[]; connected: boolean };
type SortKey = "price" | "square_footage" | "school_rating" | "distance_to_city_center";

const scenarioDefaults: PropertyInput = { square_footage: 1700, bedrooms: 3, bathrooms: 2, year_built: 2000, lot_size: 7200, distance_to_city_center: 5, school_rating: 8 };

export function MarketDashboard({ initialSummary, initialProperties, connected }: Props) {
  const [properties, setProperties] = useState(initialProperties);
  const [summary, setSummary] = useState(initialSummary);
  const [bedrooms, setBedrooms] = useState("all");
  const [minimumPrice, setMinimumPrice] = useState("");
  const [sort, setSort] = useState<SortKey>("price");
  const [descending, setDescending] = useState(true);
  const [filtering, setFiltering] = useState(false);
  const [scenario, setScenario] = useState(scenarioDefaults);
  const [scenarioResult, setScenarioResult] = useState<number | null>(null);
  const [scenarioLoading, setScenarioLoading] = useState(false);
  const [error, setError] = useState("");

  const sortedProperties = useMemo(() => [...properties].sort((a, b) => (a[sort] - b[sort]) * (descending ? -1 : 1)), [properties, sort, descending]);
  const maxSegmentPrice = Math.max(...summary.segments.map((item) => item.averagePrice), 1);

  async function applyFilters() {
    setFiltering(true); setError("");
    const params = new URLSearchParams();
    if (bedrooms !== "all") params.set("bedrooms", bedrooms);
    if (minimumPrice) params.set("minPrice", minimumPrice);
    try {
      const [summaryResponse, propertiesResponse] = await Promise.all([
        fetch(`/api/market/summary?${params}`), fetch(`/api/market/properties?${params}`),
      ]);
      if (!summaryResponse.ok || !propertiesResponse.ok) throw new Error("Market filters could not be applied");
      setSummary(await summaryResponse.json()); setProperties(await propertiesResponse.json());
    } catch (requestError) { setError(requestError instanceof Error ? requestError.message : "Market service unavailable"); }
    finally { setFiltering(false); }
  }

  async function runScenario() {
    setScenarioLoading(true); setError("");
    try {
      const response = await fetch("/api/market/what-if", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(scenario) });
      const body = (await response.json()) as PredictionResponse & { detail?: string };
      if (!response.ok) throw new Error(body.detail ?? "Scenario could not be calculated");
      setScenarioResult(body.prediction);
    } catch (requestError) { setError(requestError instanceof Error ? requestError.message : "Scenario service unavailable"); }
    finally { setScenarioLoading(false); }
  }

  function changeSort(key: SortKey) {
    if (key === sort) setDescending((value) => !value); else { setSort(key); setDescending(true); }
  }

  const stats = [
    ["Properties", summary.count.toLocaleString(), "Filtered inventory"],
    ["Average price", currency.format(summary.averagePrice), "Across selected segment"],
    ["Median price", currency.format(summary.medianPrice), "Midpoint of market"],
    ["Average size", `${number.format(summary.averageSquareFootage)} ft²`, "Living area"],
  ];

  return (
    <>
      {!connected && <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800">Showing a summary preview while the Java service starts. Filters and exports become available when it connects.</div>}
      {error && <div role="alert" className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
      <section className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Market summary">
        {stats.map(([label, value, detail]) => <article key={label} className="card p-5"><p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">{label}</p><p className="mt-3 text-2xl font-black tracking-[-0.035em] text-slate-950">{value}</p><p className="mt-1 text-[11px] text-slate-400">{detail}</p></article>)}
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(340px,.65fr)]">
        <div className="card p-5 sm:p-6">
          <div className="flex items-center justify-between"><div><h2 className="text-lg font-extrabold">Average price by bedrooms</h2><p className="mt-1 text-xs text-slate-500">Segment comparison from the housing dataset</p></div><BarChart3 className="text-emerald-600" /></div>
          <div className="mt-8 space-y-5">
            {summary.segments.map((segment) => <div key={segment.bedrooms} className="grid grid-cols-[70px_1fr_90px] items-center gap-3"><span className="text-xs font-bold text-slate-600">{segment.bedrooms} beds</span><div className="h-9 overflow-hidden rounded-lg bg-slate-100"><div className="h-full rounded-lg bg-emerald-400 transition-all duration-700" style={{ width: `${(segment.averagePrice / maxSegmentPrice) * 100}%` }} /></div><span className="text-right text-xs font-extrabold">{currency.format(segment.averagePrice)}</span></div>)}
          </div>
        </div>

        <div className="rounded-2xl bg-slate-950 p-5 text-white sm:p-6">
          <div className="flex items-center gap-2"><WandSparkles size={18} className="text-amber-300" /><h2 className="text-lg font-extrabold">What-if analysis</h2></div>
          <p className="mt-2 text-xs leading-5 text-slate-400">Adjust the strongest market signals and query the shared ML model.</p>
          <div className="mt-5 space-y-4">
            {([[
              "square_footage", "Living area", 100, 4000, 50
            ], ["school_rating", "School rating", 0, 10, 0.1], ["distance_to_city_center", "Distance to centre", 0, 20, 0.1]] as const).map(([key, label, min, max, step]) => <label key={key} className="block"><span className="mb-2 flex justify-between text-xs font-semibold text-slate-300"><span>{label}</span><span>{scenario[key]}</span></span><input className="w-full accent-emerald-400" type="range" min={min} max={max} step={step} value={scenario[key]} onChange={(event) => setScenario({ ...scenario, [key]: Number(event.target.value) })} /></label>)}
          </div>
          <button onClick={runScenario} disabled={scenarioLoading} className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-400 px-4 py-3 text-sm font-black text-slate-950 transition hover:bg-emerald-300 disabled:opacity-50">{scenarioLoading ? <LoaderCircle className="animate-spin" size={16} /> : <WandSparkles size={16} />} Run scenario</button>
          <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4"><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">Predicted value</p><p className="mt-2 text-2xl font-black">{scenarioResult === null ? "—" : currency.format(scenarioResult)}</p></div>
        </div>
      </section>

      <section className="card mt-6 overflow-hidden">
        <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-end sm:justify-between sm:p-6">
          <div><div className="flex items-center gap-2"><SlidersHorizontal size={17} className="text-emerald-700" /><h2 className="text-lg font-extrabold">Property records</h2></div><p className="mt-1 text-xs text-slate-500">Filter, sort, and export the underlying market data.</p></div>
          <div className="flex flex-wrap gap-2"><a href="/api/market/export/csv" className="secondary-button"><ArrowDownToLine size={15} /> CSV</a><a href="/api/market/export/pdf" className="secondary-button"><FileText size={15} /> PDF</a></div>
        </div>
        <div className="grid gap-3 border-b border-slate-100 bg-slate-50/70 p-4 sm:grid-cols-[1fr_1fr_auto] sm:px-6">
          <label><span className="sr-only">Bedrooms</span><select className="field-input" value={bedrooms} onChange={(event) => setBedrooms(event.target.value)}><option value="all">All bedrooms</option><option value="2">2 bedrooms</option><option value="3">3 bedrooms</option><option value="4">4 bedrooms</option></select></label>
          <label><span className="sr-only">Minimum price</span><input className="field-input" type="number" min="0" placeholder="Minimum price" value={minimumPrice} onChange={(event) => setMinimumPrice(event.target.value)} /></label>
          <button className="primary-button" onClick={applyFilters} disabled={filtering}>{filtering ? <LoaderCircle className="animate-spin" size={15} /> : "Apply filters"}</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[780px] text-left text-sm">
            <thead className="bg-white text-[11px] uppercase tracking-[0.1em] text-slate-500"><tr><th className="px-6 py-4">ID</th>{([['square_footage', 'Living area'], ['price', 'Price'], ['school_rating', 'School'], ['distance_to_city_center', 'Distance']] as [SortKey, string][]).map(([key, label]) => <th key={key} className="px-4 py-4"><button className="flex items-center gap-1 font-bold" onClick={() => changeSort(key)}>{label}<ArrowUpDown size={12} /></button></th>)}<th className="px-4 py-4">Bed / bath</th></tr></thead>
            <tbody className="divide-y divide-slate-100">{sortedProperties.map((property) => <tr key={property.id} className="transition hover:bg-emerald-50/50"><td className="px-6 py-4 text-slate-400">#{property.id}</td><td className="px-4 py-4 font-bold">{number.format(property.square_footage)} ft²</td><td className="px-4 py-4 font-extrabold text-emerald-700">{currency.format(property.price)}</td><td className="px-4 py-4">{property.school_rating}/10</td><td className="px-4 py-4">{property.distance_to_city_center} mi</td><td className="px-4 py-4">{property.bedrooms} / {property.bathrooms}</td></tr>)}</tbody>
          </table>
          {sortedProperties.length === 0 && <p className="py-12 text-center text-sm text-slate-500">No properties match these filters.</p>}
        </div>
      </section>
    </>
  );
}
