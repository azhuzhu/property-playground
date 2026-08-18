export default function Loading() {
  return (
    <div className="page-shell animate-pulse" role="status" aria-label="Loading page">
      <div className="h-4 w-24 rounded bg-slate-200" />
      <div className="mt-4 h-10 w-80 max-w-full rounded bg-slate-200" />
      <div className="mt-8 grid gap-5 lg:grid-cols-3">
        {[1, 2, 3].map((item) => <div key={item} className="h-52 rounded-2xl bg-white" />)}
      </div>
    </div>
  );
}
