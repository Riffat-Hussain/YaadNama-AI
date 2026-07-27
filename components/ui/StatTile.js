export default function StatTile({ detail, icon: Icon, label, value, className = "" }) {
  return (
    <section className={`keepsake-card rounded-keepsake p-5 shadow-keepsake ${className}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-muted">{label}</p>
          <p className="mt-2 font-display text-3xl font-semibold text-ink dark:text-white">{value}</p>
          {detail ? <p className="mt-1 text-sm text-muted">{detail}</p> : null}
        </div>
        {Icon ? (
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-teal/10 text-teal-dark">
            <Icon aria-hidden="true" className="h-5 w-5" />
          </span>
        ) : null}
      </div>
    </section>
  );
}
