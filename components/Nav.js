"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "@/lib/auth";
import { DEMO_MODE } from "@/lib/demo";

const LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/memories", label: "Memory Vault" },
  { href: "/companion", label: "AI Companion" },
  { href: "/mood", label: "Mood" },
  { href: "/settings", label: "Settings" },
];

export default function Nav({ userEmail }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    // Check for demo mode
    if (DEMO_MODE) {
      localStorage.removeItem("yaadnama_demo_user");
    } else {
      await signOut();
    }
    router.push("/");
  }

  return (
    <header className="nav-surface sticky top-0 z-20 border-b border-black/5 bg-paper/90 backdrop-blur dark:bg-[#1c2321]/90">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-5 py-4">
        <Link href="/dashboard" className="font-display text-xl font-semibold text-teal-dark dark:text-gold-light">
          YaadNama <span className="text-gold">AI</span>
        </Link>

        <nav className="flex flex-wrap items-center gap-1 text-sm sm:gap-2">
          {LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-3 py-2 font-medium transition-colors ${
                  active
                    ? "bg-teal text-white"
                    : "text-ink/70 hover:bg-paper2 dark:text-white/70 dark:hover:bg-white/10"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/emergency"
            className="rounded-full bg-rose px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-rose-dark"
          >
            SOS
          </Link>
          {userEmail ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-ink/60 dark:text-white/60">{userEmail}</span>
              <button
                onClick={handleSignOut}
                className="text-sm font-medium text-ink/60 underline-offset-2 hover:underline dark:text-white/60"
              >
                Sign out
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
