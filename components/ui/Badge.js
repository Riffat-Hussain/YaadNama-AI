const TONES = {
  teal: "bg-teal/10 text-teal-dark dark:bg-teal/20 dark:text-teal-light",
  gold: "bg-gold/15 text-gold-dark dark:bg-gold/20 dark:text-gold-light",
  rose: "bg-rose/10 text-rose-dark dark:bg-rose/20 dark:text-rose-light",
  neutral: "bg-surface-2 text-muted dark:bg-white/10 dark:text-white/80",
};

export default function Badge({ children, className = "", tone = "neutral" }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${TONES[tone]} ${className}`}>
      {children}
    </span>
  );
}
