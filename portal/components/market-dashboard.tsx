"use client";

import {
  ArrowDown,
  ArrowDownToLine,
  ArrowUp,
  ArrowUpDown,
  BarChart3,
  FileText,
  LoaderCircle,
  RotateCcw,
  SlidersHorizontal,
  WandSparkles,
} from "lucide-react";
import { useMemo, useState } from "react";
import { currency, number } from "@/lib/format";
import type { MarketSummary, Property, PropertyInput } from "@/lib/types";
import type { PredictionResponse } from "@/lib/generated/openapi/models/PredictionResponse";

type Props = { initialSummary: MarketSummary; initialProperties: Property[]; connected: boolean };
type SortKey =
  | "price"
  | "square_footage"
  | "lot_size"
  | "bedrooms"
  | "bathrooms"
  | "year_built"
  | "school_rating"
  | "distance_to_city_center";
type FilterState = {
  id: string;
  bedrooms: string;
  bathrooms: string;
  minPrice: string;
  maxPrice: string;
  minSquareFootage: string;
  maxSquareFootage: string;
  minLotSize: string;
  maxLotSize: string;
  minYearBuilt: string;
  maxYearBuilt: string;
  minSchoolRating: string;
  maxSchoolRating: string;
  minDistance: string;
  maxDistance: string;
};
type FilterKey = keyof FilterState;

const scenarioDefaults: PropertyInput = { square_footage: 1700, bedrooms: 3, bathrooms: 2, year_built: 2000, lot_size: 7200, distance_to_city_center: 5, school_rating: 8 };

const propertyColumns: Array<{
  key: SortKey;
  label: string;
  format: (property: Property) => string;
}> = [
  { key: "price", label: "Price", format: (property) => currency.format(property.price) },
  {
    key: "square_footage",
    label: "Living area",
    format: (property) => `${number.format(property.square_footage)} ft²`,
  },
  {
    key: "lot_size",
    label: "Lot size",
    format: (property) => `${number.format(property.lot_size)} ft²`,
  },
  { key: "bedrooms", label: "Beds", format: (property) => number.format(property.bedrooms) },
  { key: "bathrooms", label: "Baths", format: (property) => number.format(property.bathrooms) },
  { key: "year_built", label: "Year built", format: (property) => String(property.year_built) },
  {
    key: "school_rating",
    label: "School",
    format: (property) => `${property.school_rating}/10`,
  },
  {
    key: "distance_to_city_center",
    label: "Distance",
    format: (property) => `${property.distance_to_city_center} mi`,
  },
];

const emptyFilters: FilterState = {
  id: "",
  bedrooms: "",
  bathrooms: "",
  minPrice: "",
  maxPrice: "",
  minSquareFootage: "",
  maxSquareFootage: "",
  minLotSize: "",
  maxLotSize: "",
  minYearBuilt: "",
  maxYearBuilt: "",
  minSchoolRating: "",
  maxSchoolRating: "",
  minDistance: "",
  maxDistance: "",
};

const filterGroups: Array<{
  title: string;
  description: string;
  fields: Array<{
    key: FilterKey;
    label: string;
    placeholder: string;
    min?: number;
    max?: number;
    step?: number;
  }>;
}> = [
  {
    title: "Value & identity",
    description: "Locate a record or narrow its asking price.",
    fields: [
      { key: "id", label: "Property ID", placeholder: "Any ID", min: 1, step: 1 },
      { key: "minPrice", label: "Minimum price", placeholder: "$ min", min: 0, step: 10000 },
      { key: "maxPrice", label: "Maximum price", placeholder: "$ max", min: 0, step: 10000 },
    ],
  },
  {
    title: "Space",
    description: "Set ranges for indoor and outdoor area.",
    fields: [
      { key: "minSquareFootage", label: "Min living area", placeholder: "ft² min", min: 0, step: 50 },
      { key: "maxSquareFootage", label: "Max living area", placeholder: "ft² max", min: 0, step: 50 },
      { key: "minLotSize", label: "Min lot size", placeholder: "ft² min", min: 0, step: 100 },
      { key: "maxLotSize", label: "Max lot size", placeholder: "ft² max", min: 0, step: 100 },
    ],
  },
  {
    title: "Property details",
    description: "Filter configuration and construction year.",
    fields: [
      { key: "bedrooms", label: "Bedrooms", placeholder: "Any", min: 0, step: 1 },
      { key: "bathrooms", label: "Bathrooms", placeholder: "Any", min: 0, step: 0.5 },
      { key: "minYearBuilt", label: "Built from", placeholder: "Year min", min: 1800, max: 2100, step: 1 },
      { key: "maxYearBuilt", label: "Built to", placeholder: "Year max", min: 1800, max: 2100, step: 1 },
    ],
  },
  {
    title: "Location & quality",
    description: "Refine school rating and distance to centre.",
    fields: [
      { key: "minSchoolRating", label: "Min school rating", placeholder: "0–10", min: 0, max: 10, step: 0.1 },
      { key: "maxSchoolRating", label: "Max school rating", placeholder: "0–10", min: 0, max: 10, step: 0.1 },
      { key: "minDistance", label: "Min distance", placeholder: "mi min", min: 0, step: 0.1 },
      { key: "maxDistance", label: "Max distance", placeholder: "mi max", min: 0, step: 0.1 },
    ],
  },
];

const rangePairs: Array<[FilterKey, FilterKey, string]> = [
  ["minPrice", "maxPrice", "price"],
  ["minSquareFootage", "maxSquareFootage", "living area"],
  ["minLotSize", "maxLotSize", "lot size"],
  ["minYearBuilt", "maxYearBuilt", "year built"],
  ["minSchoolRating", "maxSchoolRating", "school rating"],
  ["minDistance", "maxDistance", "distance"],
];

export function MarketDashboard({ initialSummary, initialProperties, connected }: Props) {
  const [properties, setProperties] = useState(initialProperties);
  const [summary, setSummary] = useState(initialSummary);
  const [filters, setFilters] = useState<FilterState>(emptyFilters);
  const [appliedQuery, setAppliedQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("price");
  const [descending, setDescending] = useState(true);
  const [filtering, setFiltering] = useState(false);
  const [scenario, setScenario] = useState(scenarioDefaults);
  const [scenarioResult, setScenarioResult] = useState<number | null>(null);
  const [scenarioLoading, setScenarioLoading] = useState(false);
  const [error, setError] = useState("");

  const sortedProperties = useMemo(() => [...properties].sort((a, b) => (a[sort] - b[sort]) * (descending ? -1 : 1)), [properties, sort, descending]);
  const maxSegmentPrice = Math.max(...summary.segments.map((item) => item.averagePrice), 1);
  const activeFilterCount = Object.values(filters).filter(Boolean).length;
  const exportQuery = appliedQuery ? `?${appliedQuery}` : "";

  async function loadFilteredMarket(nextFilters: FilterState) {
    const params = new URLSearchParams();
    Object.entries(nextFilters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    setFiltering(true); setError("");
    try {
      const [summaryResponse, propertiesResponse] = await Promise.all([
        fetch(`/api/market/summary?${params}`), fetch(`/api/market/properties?${params}`),
      ]);
      if (!summaryResponse.ok || !propertiesResponse.ok) throw new Error("Market filters could not be applied");
      setSummary(await summaryResponse.json()); setProperties(await propertiesResponse.json());
      setAppliedQuery(params.toString());
    } catch (requestError) { setError(requestError instanceof Error ? requestError.message : "Market service unavailable"); }
    finally { setFiltering(false); }
  }

  function applyFilters() {
    const invalidRange = rangePairs.find(([minimum, maximum]) => (
      filters[minimum] && filters[maximum] && Number(filters[minimum]) > Number(filters[maximum])
    ));
    if (invalidRange) {
      setError(`Minimum ${invalidRange[2]} cannot be greater than maximum ${invalidRange[2]}.`);
      return;
    }
    void loadFilteredMarket(filters);
  }

  function resetFilters() {
    setFilters(emptyFilters);
    void loadFilteredMarket(emptyFilters);
  }

  function updateFilter(key: FilterKey, value: string) {
    setFilters((current) => ({ ...current, [key]: value }));
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
          <div className="flex flex-wrap gap-2"><a href={`/api/market/export/csv${exportQuery}`} className="secondary-button"><ArrowDownToLine size={15} /> CSV</a><a href={`/api/market/export/pdf${exportQuery}`} className="secondary-button"><FileText size={15} /> PDF</a></div>
        </div>
        <form
          className="border-b border-slate-200 bg-slate-50/70 p-4 sm:p-6"
          onSubmit={(event) => { event.preventDefault(); applyFilters(); }}
        >
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">Refine property records</h3>
              <p className="mt-1 text-xs text-slate-500">Combine any criteria below. Ranges include their boundary values.</p>
            </div>
            <span className={`w-fit rounded-full px-3 py-1 text-xs font-bold ${activeFilterCount ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-600"}`}>
              {activeFilterCount} active {activeFilterCount === 1 ? "filter" : "filters"}
            </span>
          </div>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {filterGroups.map((group) => (
              <fieldset key={group.title} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <legend className="sr-only">{group.title}</legend>
                <h4 className="text-xs font-extrabold uppercase tracking-[0.1em] text-emerald-800">{group.title}</h4>
                <p className="mt-1 min-h-8 text-[11px] leading-4 text-slate-500">{group.description}</p>
                <div className="mt-3 grid grid-cols-2 gap-2.5">
                  {group.fields.map((field) => (
                    <label key={field.key} className={group.fields.length === 3 && field.key === "id" ? "col-span-2" : ""}>
                      <span className="mb-1.5 block text-[11px] font-bold text-slate-600">{field.label}</span>
                      <input
                        className="field-input px-3 py-2.5"
                        type="number"
                        inputMode="decimal"
                        min={field.min}
                        max={field.max}
                        step={field.step}
                        placeholder={field.placeholder}
                        value={filters[field.key]}
                        onChange={(event) => updateFilter(field.key, event.target.value)}
                      />
                    </label>
                  ))}
                </div>
              </fieldset>
            ))}
          </div>
          <div className="mt-4 flex flex-col-reverse gap-2 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-end">
            <button type="button" className="secondary-button" onClick={resetFilters} disabled={filtering || (!activeFilterCount && !appliedQuery)}>
              <RotateCcw size={15} /> Reset all
            </button>
            <button type="submit" className="primary-button" disabled={filtering}>
              {filtering ? <LoaderCircle className="animate-spin" size={15} /> : <SlidersHorizontal size={15} />}
              {filtering ? "Applying…" : "Apply filters"}
            </button>
          </div>
        </form>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1120px] text-left text-sm">
            <thead className="bg-white text-[11px] uppercase tracking-[0.1em] text-slate-500">
              <tr>
                <th className="px-6 py-4">ID</th>
                {propertyColumns.map((column) => {
                  const active = column.key === sort;
                  const SortIcon = active ? (descending ? ArrowDown : ArrowUp) : ArrowUpDown;
                  return (
                    <th
                      key={column.key}
                      className="px-4 py-4"
                      aria-sort={active ? (descending ? "descending" : "ascending") : undefined}
                    >
                      <button
                        className={`flex items-center gap-1.5 whitespace-nowrap rounded-lg px-2 py-1 font-bold transition ${
                          active
                            ? "bg-emerald-100 text-emerald-800"
                            : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                        }`}
                        onClick={() => changeSort(column.key)}
                        aria-pressed={active}
                      >
                        {column.label}
                        <SortIcon size={13} strokeWidth={active ? 3 : 2} aria-hidden="true" />
                      </button>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sortedProperties.map((property) => (
                <tr key={property.id} className="transition hover:bg-emerald-50/50">
                  <td className="px-6 py-4 text-slate-400">#{property.id}</td>
                  {propertyColumns.map((column) => (
                    <td
                      key={column.key}
                      className={`whitespace-nowrap px-4 py-4 ${
                        column.key === "price" ? "font-extrabold text-emerald-700" : "font-medium"
                      }`}
                    >
                      {column.format(property)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {sortedProperties.length === 0 && <p className="py-12 text-center text-sm text-slate-500">No properties match these filters.</p>}
        </div>
      </section>
    </>
  );
}
