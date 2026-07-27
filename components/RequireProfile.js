"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "@/lib/auth";
import { DEMO_MODE } from "@/lib/demo";
import Nav from "@/components/Nav";

export default function RequireProfile({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    async function checkAuth() {
      if (DEMO_MODE) {
        const demoUser = localStorage.getItem("yaadnama_demo_user");
        if (demoUser) {
          const user = JSON.parse(demoUser);
          setUser({ email: user.email });
          return;
        }
      }

      const { session } = await getSession();
      if (!session?.user) {
        router.replace("/login");
      } else {
        setUser(session.user);
      }
    }
    checkAuth();
  }, [router]);

  if (user === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center px-5 text-center text-ink/70 dark:text-white/70">
        <div className="glass-card inline-flex max-w-md flex-col items-center gap-3 rounded-[2rem] border border-surface-2 px-10 py-12 text-lg font-medium shadow-glow">
          <div className="h-12 w-12 rounded-3xl bg-teal/15 text-teal-dark flex items-center justify-center text-2xl">⌛</div>
          <p>Preparing your memory space...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Nav userEmail={user?.email} />
      <main className="mx-auto max-w-6xl px-5 py-8 pb-28 md:px-8 lg:ml-72 lg:max-w-[calc(100%-18rem)] lg:px-10 lg:py-10 lg:pb-10">{children}</main>
    </>
  );
}
