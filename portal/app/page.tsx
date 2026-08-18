import { ArrowRight, BarChart3, Calculator, Database, Server } from "lucide-react";
import Link from "next/link";

const applications = [
  {
    number: "01",
    title: "Property value estimator",
    copy: "Turn seven property signals into a defensible value estimate, then compare scenarios and revisit your recent work.",
    href: "/estimator",
    label: "Open estimator",
    icon: Calculator,
    accent: "bg-emerald-400",
  },
  {
    number: "02",
    title: "Property market analysis",
    copy: "Explore the supplied housing market, filter comparable properties, run what-if scenarios, and export analysis.",
    href: "/market",
    label: "Open market analysis",
    icon: BarChart3,
    accent: "bg-amber-300",
  },
];

export default function HomePage() {
  return (
    <div className="page-shell">
      <section className="relative overflow-hidden rounded-[2rem] bg-slate-950 px-6 py-12 text-white sm:px-10 lg:px-14 lg:py-16">
        <div className="absolute -right-24 -top-32 size-96 rounded-full border-[70px] border-emerald-400/10" />
        <div className="relative max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-300">U.S. suburban property intelligence</p>
          <h1 className="mt-5 text-4xl font-black leading-[1.05] tracking-[-0.055em] sm:text-6xl">One portal.<br />Two analytical lenses.</h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-slate-300">Estimate an individual home through the Python workflow, or explore the broader market through the Java analytics service—all powered by the same regression model.</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/estimator" className="primary-button bg-emerald-400 text-slate-950 hover:bg-emerald-300">Start an estimate <ArrowRight size={17} /></Link>
            <Link href="/market" className="rounded-xl border border-white/15 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10">Explore the market</Link>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-5 lg:grid-cols-2" aria-label="Portal applications">
        {applications.map(({ number, title, copy, href, label, icon: Icon, accent }) => (
          <article key={number} className="card group p-6 sm:p-8">
            <div className="flex items-start justify-between">
              <span className="text-xs font-black tracking-[0.18em] text-slate-400">APP {number}</span>
              <span className={`grid size-11 place-items-center rounded-2xl ${accent} text-slate-950`}><Icon size={21} /></span>
            </div>
            <h2 className="mt-10 text-2xl font-extrabold tracking-[-0.035em] text-slate-950">{title}</h2>
            <p className="mt-3 max-w-lg text-sm leading-6 text-slate-600">{copy}</p>
            <Link href={href} className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-emerald-700 transition group-hover:gap-3">{label} <ArrowRight size={16} /></Link>
          </article>
        ))}
      </section>

      <section className="mt-8 grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 sm:grid-cols-3 sm:p-6" aria-label="System architecture">
        <div className="flex items-center gap-4"><Server className="text-emerald-600" /><div><p className="text-sm font-bold">Python service</p><p className="text-xs text-slate-500">Validated estimates</p></div></div>
        <div className="flex items-center gap-4"><Database className="text-emerald-600" /><div><p className="text-sm font-bold">Shared ML model</p><p className="text-xs text-slate-500">One prediction source</p></div></div>
        <div className="flex items-center gap-4"><BarChart3 className="text-emerald-600" /><div><p className="text-sm font-bold">Java analytics</p><p className="text-xs text-slate-500">Cached market insights</p></div></div>
      </section>
    </div>
  );
}
