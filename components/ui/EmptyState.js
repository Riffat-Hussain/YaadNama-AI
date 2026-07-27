import Button from "@/components/ui/Button";

export default function EmptyState({ action, children, description, icon: Icon, title }) {
  return (
    <section className="keepsake-card rounded-keepsake px-6 py-9 text-center shadow-keepsake sm:px-10">
      {Icon ? (
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-[1.4rem] bg-teal/10 text-teal-dark">
          <Icon aria-hidden="true" className="h-8 w-8" />
        </div>
      ) : null}
      <h2 className="font-display text-2xl font-semibold text-ink dark:text-white">{title}</h2>
      {description ? <p className="mx-auto mt-2 max-w-lg leading-7 text-muted">{description}</p> : null}
      {children}
      {action ? (
        <Button className="mt-5" onClick={action.onClick} variant={action.variant || "primary"}>
          {action.icon ? <action.icon aria-hidden="true" className="h-5 w-5" /> : null}
          {action.label}
        </Button>
      ) : null}
    </section>
  );
}
