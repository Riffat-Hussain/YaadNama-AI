const VARIANTS = {
  primary: "bg-teal text-white shadow-glow hover:bg-teal-dark",
  secondary: "border border-surface-2 bg-white/90 text-ink shadow-sm hover:border-teal-dark hover:bg-teal/5 dark:bg-surface dark:text-white",
  quiet: "bg-transparent text-teal-dark hover:bg-teal/10",
  danger: "bg-rose text-white shadow-sm hover:bg-rose-dark",
};

const SIZES = {
  default: "min-h-12 px-5 py-3 text-sm",
  compact: "min-h-11 px-4 py-2 text-sm",
  large: "min-h-14 px-6 py-3.5 text-base",
};

export default function Button({
  children,
  className = "",
  variant = "primary",
  size = "default",
  type = "button",
  ...props
}) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 rounded-full font-semibold transition duration-200 ease-out active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
