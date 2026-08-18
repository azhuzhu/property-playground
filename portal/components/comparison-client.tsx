"use client";

import { Check, GitCompareArrows } from "lucide-react";
import { useMemo, useState } from "react";
import { useEstimateHistory } from "@/hooks/use-estimate-history";
import { currency, number } from "@/lib/format";

export function ComparisonClient() {
  const { history } = useEstimateHistory();
  const [selected, setSelected] = useState<string[]>([]);
  const compared = useMemo(() => history.filter((record) => selected.includes(record.id)), [history, selected]);
  const maximum = Math.max(...compared.map((record) => record.prediction), 1);

  function toggle(id: string) {
    setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : current.length < 4 ? [...current, id] : current);
  }

  return (
    <div className="mt-8 grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
      <section className="card p-5">
        <h2 className="text-sm font-extrabold">Select up to four estimates</h2>
        <p className="mt-1 text-xs text-slate-500">Saved on this device</p>
        <div className="mt-5 space-y-2">
          {history.map((record) => {
            const active = selected.includes(record.id);
            return <button key={record.id} onClick={() => toggle(record.id)} aria-pressed={active} className={`flex w-full items-center justify-between rounded-xl border p-3 text-left transition ${active ? "border-emerald-400 bg-emerald-50" : "border-slate-100 hover:border-slate-300"}`}><div><p className="text-sm font-bold">{currency.format(record.prediction)}</p><p className="text-[11px] text-slate-500">{number.format(record.square_footage)} sq ft · {record.bedrooms} beds</p></div><span className={`grid size-6 place-items-center rounded-full ${active ? "bg-emerald-500 text-white" : "bg-slate-100 text-transparent"}`}><Check size={13} /></span></button>;
          })}
          {history.length === 0 && <div className="rounded-xl bg-slate-50 p-6 text-center"><GitCompareArrows className="mx-auto text-slate-300" /><p className="mt-3 text-xs leading-5 text-slate-500">Create at least two estimates to begin a comparison.</p></div>}
        </div>
      </section>

      <section className="card overflow-hidden">
        <div className="border-b border-slate-100 p-5 sm:p-6"><h2 className="text-lg font-extrabold">Side-by-side analysis</h2><p className="mt-1 text-xs text-slate-500">Compare value, size, configuration, and location signals.</p></div>
        {compared.length ? <div className="overflow-x-auto p-5 sm:p-6">
          <div className="mb-8 grid min-w-[520px] gap-3" style={{ gridTemplateColumns: `repeat(${compared.length}, minmax(120px, 1fr))` }}>
            {compared.map((record, index) => <div key={record.id}><div className="flex h-40 items-end rounded-xl bg-slate-50 p-3"><div className="w-full rounded-lg bg-emerald-400 transition-all" style={{ height: `${Math.max(12, (record.prediction / maximum) * 100)}%` }} /></div><p className="mt-2 text-center text-xs font-bold">Property {index + 1}</p></div>)}
          </div>
          <table className="w-full min-w-[620px] text-left text-sm">
            <thead><tr className="border-b border-slate-200"><th className="pb-3 text-xs uppercase tracking-wide text-slate-500">Metric</th>{compared.map((record, index) => <th key={record.id} className="pb-3 text-right">Property {index + 1}</th>)}</tr></thead>
            <tbody className="divide-y divide-slate-100">
              {[
                ["Estimated value", (item: typeof compared[number]) => currency.format(item.prediction)],
                ["Price / sq ft", (item: typeof compared[number]) => currency.format(item.prediction / item.square_footage)],
                ["Living area", (item: typeof compared[number]) => `${number.format(item.square_footage)} sq ft`],
                ["Bed / bath", (item: typeof compared[number]) => `${item.bedrooms} / ${item.bathrooms}`],
                ["Year built", (item: typeof compared[number]) => String(item.year_built)],
                ["School rating", (item: typeof compared[number]) => `${item.school_rating}/10`],
                ["Distance", (item: typeof compared[number]) => `${item.distance_to_city_center} mi`],
              ].map(([label, formatter]) => <tr key={label as string}><th className="py-3 font-medium text-slate-500">{label as string}</th>{compared.map((item) => <td key={item.id} className="py-3 text-right font-bold">{(formatter as (value: typeof item) => string)(item)}</td>)}</tr>)}
            </tbody>
          </table>
        </div> : <div className="grid min-h-96 place-items-center p-8 text-center"><div><GitCompareArrows className="mx-auto text-slate-300" size={36} /><p className="mt-4 text-sm font-bold">Choose estimates to compare</p><p className="mt-2 text-xs text-slate-500">Select saved properties from the list.</p></div></div>}
      </section>
    </div>
  );
}
