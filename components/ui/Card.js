export default function Card({ children, className = "", interactive = false }) {
  return (
    <section
      className={`keepsake-card rounded-keepsake p-5 shadow-keepsake ${
        interactive ? "card-interactive" : ""
      } ${className}`}
    >
      {children}
    </section>
  );
}
