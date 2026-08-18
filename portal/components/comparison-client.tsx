"use client";

import { Check, GitCompareArrows } from "lucide-react";
import { useMemo, useState } from "react";
import { useEstimateHistory } from "@/hooks/use-estimate-history";
import { currency, number } from "@/lib/format";
import type { EstimateRecord } from "@/lib/types";

type ComparisonMetric = {
  label: string;
  value: (item: EstimateRecord) => number;
  format: (item: EstimateRecord) => string;
};

const metrics: ComparisonMetric[] = [
  {
    label: "Estimated value",
    value: (item) => item.prediction,
    format: (item) => currency.format(item.prediction),
  },
  {
    label: "Price / sq ft",
    value: (item) => item.prediction / item.square_footage,
    format: (item) => currency.format(item.prediction / item.square_footage),
  },
  {
    label: "Living area",
    value: (item) => item.square_footage,
    format: (item) => `${number.format(item.square_footage)} sq ft`,
  },
  {
    label: "Lot size",
    value: (item) => item.lot_size,
    format: (item) => `${number.format(item.lot_size)} sq ft`,
  },
  {
    label: "Bedrooms",
    value: (item) => item.bedrooms,
    format: (item) => number.format(item.bedrooms),
  },
  {
    label: "Bathrooms",
    value: (item) => item.bathrooms,
    format: (item) => number.format(item.bathrooms),
  },
  {
    label: "Year built",
    value: (item) => item.year_built,
    format: (item) => String(item.year_built),
  },
  {
    label: "School rating",
    value: (item) => item.school_rating,
    format: (item) => `${item.school_rating}/10`,
  },
  {
    label: "Distance",
    value: (item) => item.distance_to_city_center,
    format: (item) => `${item.distance_to_city_center} mi`,
  },
];

function comparisonRank(metric: ComparisonMetric, item: EstimateRecord, compared: EstimateRecord[]) {
  if (compared.length < 2) return null;
  const values = compared.map(metric.value);
  const minimum = Math.min(...values);
  const maximum = Math.max(...values);
  if (minimum === maximum) return null;
  const value = metric.value(item);
  if (value === maximum) return "highest";
  if (value === minimum) return "lowest";
  return null;
}

export function ComparisonClient() {
  const { history } = useEstimateHistory();
  const [selected, setSelected] = useState<string[]>([]);
  const compared = useMemo(
    () => history.filter((record) => selected.includes(record.id)),
    [history, selected],
  );
  const maximum = Math.max(...compared.map((record) => record.prediction), 1);
  const minimum = Math.min(...compared.map((record) => record.prediction));

  function toggle(id: string) {
    setSelected((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : current.length < 4
          ? [...current, id]
          : current,
    );
  }

  return (
    <div className="mt-8 grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
      <section className="card p-5">
        <h2 className="text-sm font-extrabold">Select up to four estimates</h2>
        <p className="mt-1 text-xs text-slate-500">Saved on this device</p>
        <div className="mt-5 space-y-2">
          {history.map((record) => {
            const active = selected.includes(record.id);
            return (
              <button
                key={record.id}
                onClick={() => toggle(record.id)}
                aria-pressed={active}
                className={`flex w-full items-center justify-between rounded-xl border p-3 text-left transition ${active ? "border-emerald-400 bg-emerald-50" : "border-slate-100 hover:border-slate-300"}`}
              >
                <div>
                  <p className="text-sm font-bold">{currency.format(record.prediction)}</p>
                  <p className="text-[11px] text-slate-500">
                    {number.format(record.square_footage)} sq ft · {record.bedrooms} beds
                  </p>
                </div>
                <span
                  className={`grid size-6 place-items-center rounded-full ${active ? "bg-emerald-500 text-white" : "bg-slate-100 text-transparent"}`}
                >
                  <Check size={13} />
                </span>
              </button>
            );
          })}
          {history.length === 0 && (
            <div className="rounded-xl bg-slate-50 p-6 text-center">
              <GitCompareArrows className="mx-auto text-slate-300" />
              <p className="mt-3 text-xs leading-5 text-slate-500">
                Create at least two estimates to begin a comparison.
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="card overflow-hidden">
        <div className="border-b border-slate-100 p-5 sm:p-6">
          <h2 className="text-lg font-extrabold">Side-by-side analysis</h2>
          <p className="mt-1 text-xs text-slate-500">
            Compare value, size, configuration, and location signals.
          </p>
          <div className="mt-3 flex gap-3 text-[11px] font-bold" aria-label="Comparison key">
            <span className="text-emerald-700">↑ Highest</span>
            <span className="text-red-700">↓ Lowest</span>
          </div>
        </div>
        {compared.length ? (
          <div className="overflow-x-auto p-5 sm:p-6">
            <div
              className="mb-8 grid min-w-[520px] gap-3"
              style={{ gridTemplateColumns: `repeat(${compared.length}, minmax(120px, 1fr))` }}
            >
              {compared.map((record, index) => {
                const isHighest =
                  compared.length > 1 &&
                  maximum !== minimum &&
                  record.prediction === maximum;
                const isLowest =
                  compared.length > 1 && maximum !== minimum && record.prediction === minimum;
                const barColor = isHighest
                  ? "bg-emerald-500"
                  : isLowest
                    ? "bg-red-400"
                    : "bg-slate-400";
                return (
                  <div key={record.id}>
                    <div className="flex h-40 items-end rounded-xl bg-slate-50 p-3">
                      <div
                        className={`w-full rounded-lg transition-all ${barColor}`}
                        style={{ height: `${Math.max(12, (record.prediction / maximum) * 100)}%` }}
                      />
                    </div>
                    <p className="mt-2 text-center text-xs font-bold">Property {index + 1}</p>
                  </div>
                );
              })}
            </div>
            <table className="w-full min-w-[620px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="pb-3 text-xs uppercase tracking-wide text-slate-500">Metric</th>
                  {compared.map((record, index) => (
                    <th key={record.id} className="pb-3 text-right">
                      Property {index + 1}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {metrics.map((metric) => (
                  <tr key={metric.label}>
                    <th className="py-3 font-medium text-slate-500">{metric.label}</th>
                    {compared.map((item) => {
                      const rank = comparisonRank(metric, item, compared);
                      return (
                        <td key={item.id} className="py-2 text-right font-bold">
                          <span
                            className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 ${
                              rank === "highest"
                                ? "bg-emerald-50 text-emerald-700"
                                : rank === "lowest"
                                  ? "bg-red-50 text-red-700"
                                  : "text-slate-800"
                            }`}
                          >
                            {metric.format(item)}
                            {rank && (
                              <span aria-label={rank === "highest" ? "Highest value" : "Lowest value"}>
                                {rank === "highest" ? "↑" : "↓"}
                              </span>
                            )}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid min-h-96 place-items-center p-8 text-center">
            <div>
              <GitCompareArrows className="mx-auto text-slate-300" size={36} />
              <p className="mt-4 text-sm font-bold">Choose estimates to compare</p>
              <p className="mt-2 text-xs text-slate-500">Select saved properties from the list.</p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
