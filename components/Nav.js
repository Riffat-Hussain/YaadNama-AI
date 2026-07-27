"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BookOpen,
  HeartPulse,
  LayoutDashboard,
  LogOut,
  MessageCircle,
  Settings,
  Siren,
} from "lucide-react";
import { signOut } from "@/lib/auth";
import { DEMO_MODE } from "@/lib/demo";

const LINKS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/memories", label: "Memory Vault", icon: BookOpen },
  { href: "/companion", label: "Companion", icon: MessageCircle },
  { href: "/mood", label: "Mood", icon: HeartPulse },
  { href: "/emergency", label: "SOS", icon: Siren, emergency: true },
  { href: "/settings", label: "Settings", icon: Settings },
];

function NavLink({ link, mobile, pathname }) {
  const Icon = link.icon;
  const active = pathname === link.href;
  const activeClasses = link.emergency
    ? active
      ? "bg-rose text-white shadow-sm"
      : "bg-rose/10 text-rose-dark hover:bg-rose hover:text-white dark:bg-rose/20 dark:text-rose-light"
    : active
      ? "bg-teal text-white shadow-sm"
      : "text-ink/75 hover:bg-teal/10 hover:text-teal-dark dark:text-white/80";

  return (
    <Link
      href={link.href}
      aria-current={active ? "page" : undefined}
      className={
        mobile
          ? `flex min-h-16 flex-col items-center justify-center gap-1 rounded-2xl px-1 text-[11px] font-semibold leading-none transition ${activeClasses}`
          : `flex min-h-12 items-center gap-3 rounded-2xl px-4 py-3 text-base font-semibold transition ${activeClasses}`
      }
    >
      <Icon aria-hidden="true" className={mobile ? "h-5 w-5" : "h-5 w-5 shrink-0"} />
      <span>{link.label}</span>
    </Link>
  );
}

export default function Nav({ userEmail }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    if (DEMO_MODE) {
      localStorage.removeItem("yaadnama_demo_user");
    } else {
      await signOut();
    }
    router.push("/");
  }

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-surface-2 bg-background/95 p-5 backdrop-blur-xl lg:flex lg:flex-col">
        <Link href="/dashboard" className="flex items-center gap-3 rounded-2xl px-3 py-3 text-ink transition hover:bg-teal/10">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal text-lg font-bold text-white shadow-sm">Y</span>
          <span>
            <span className="block font-display text-2xl font-semibold leading-none">YaadNama</span>
            <span className="mt-1 block text-xs font-medium text-muted">Your memory companion</span>
          </span>
        </Link>

        <nav aria-label="Main navigation" className="mt-8 space-y-2">
          <p className="px-4 text-xs font-semibold uppercase tracking-[0.18em] text-muted">Your space</p>
          {LINKS.slice(0, 4).map((link) => <NavLink key={link.href} link={link} pathname={pathname} />)}
          <div className="my-4 border-t border-surface-2" />
          <p className="px-4 text-xs font-semibold uppercase tracking-[0.18em] text-muted">Always here</p>
          {LINKS.slice(4).map((link) => <NavLink key={link.href} link={link} pathname={pathname} />)}
        </nav>

        <div className="mt-auto rounded-2xl border border-surface-2 bg-surface p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Signed in as</p>
          <p className="mt-1 truncate font-medium text-ink dark:text-white">{userEmail}</p>
          <button onClick={handleSignOut} className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-white px-3 py-2 text-sm font-semibold text-teal-dark transition hover:bg-teal/10 dark:bg-white/10 dark:text-teal-light">
            <LogOut aria-hidden="true" className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </aside>

      <header className="sticky top-0 z-30 border-b border-surface-2 bg-background/95 px-5 py-3 backdrop-blur-xl lg:hidden">
        <div className="flex min-h-11 items-center justify-between gap-3">
          <Link href="/dashboard" className="flex items-center gap-2 font-display text-xl font-semibold text-ink dark:text-white">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal text-sm font-bold text-white">Y</span>
            YaadNama
          </Link>
          <button onClick={handleSignOut} className="inline-flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm font-semibold text-teal-dark transition hover:bg-teal/10">
            <LogOut aria-hidden="true" className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </header>

      <nav aria-label="Main navigation" className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-6 gap-1 border-t border-surface-2 bg-background/95 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-10px_30px_-24px_rgba(43,42,40,0.45)] backdrop-blur-xl lg:hidden">
        {LINKS.map((link) => <NavLink key={link.href} link={link} mobile pathname={pathname} />)}
      </nav>
    </>
  );
}
