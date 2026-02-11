export default function ProjectLoading() {
  return (
    <div className="flex h-full min-h-[300px] items-center justify-center rounded-2xl border border-borderSoft bg-surface/80">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-accent border-t-transparent" />
        <p className="text-sm font-medium text-slate-600">Loading project…</p>
      </div>
    </div>
  );
}
