"use client";

import { BarChart3, Building2, Calculator, GitCompareArrows, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/", label: "Overview", icon: Building2 },
  { href: "/estimator", label: "Value estimator", icon: Calculator },
  { href: "/estimator/compare", label: "Compare", icon: GitCompareArrows },
  { href: "/market", label: "Market analysis", icon: BarChart3 },
];

export function Navigation() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className="fixed right-4 top-4 z-50 rounded-xl border border-white/10 bg-slate-950 p-2 text-white md:hidden"
        onClick={() => setOpen((value) => !value)}
        aria-label={open ? "Close navigation" : "Open navigation"}
        aria-expanded={open}
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-white/8 bg-slate-950 px-5 py-7 text-white transition-transform duration-300 md:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <Link href="/" className="mb-10 flex items-center gap-3" onClick={() => setOpen(false)}>
          <span className="grid size-10 place-items-center rounded-xl bg-emerald-400 text-lg font-black text-slate-950">P</span>
          <span>
            <span className="block text-sm font-bold tracking-wide">Property Playground</span>
            <span className="block text-xs text-slate-400">Intelligence portal</span>
          </span>
        </Link>
        <nav aria-label="Primary navigation" className="space-y-2">
          {links.map(({ href, label, icon: Icon }) => {
            const active = href === "/" || href === "/estimator"
              ? pathname === href
              : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${active ? "bg-emerald-400 text-slate-950" : "text-slate-300 hover:bg-white/8 hover:text-white"}`}
              >
                <Icon size={18} aria-hidden="true" />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto rounded-2xl border border-white/8 bg-white/5 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">Model status</p>
          <div className="mt-3 flex items-center gap-2 text-sm text-slate-300">
            <span className="size-2 rounded-full bg-emerald-400 shadow-[0_0_12px_#34d399]" />
            Regression API ready
          </div>
        </div>
      </aside>
      {open && <button className="fixed inset-0 z-30 bg-slate-950/70 md:hidden" onClick={() => setOpen(false)} aria-label="Close navigation overlay" />}
    </>
  );
}
