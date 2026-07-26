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
      // Check for demo mode
      if (DEMO_MODE) {
        const demoUser = localStorage.getItem("yaadnama_demo_user");
        if (demoUser) {
          const user = JSON.parse(demoUser);
          setUser({ email: user.email });
          return;
        }
      }

      // Production mode: use Supabase
      const { session, error } = await getSession();
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
      <div className="flex min-h-screen items-center justify-center text-ink/60">
        Loading your memories…
      </div>
    );
  }

  return (
    <>
      <Nav userEmail={user?.email} />
      <main className="mx-auto max-w-5xl px-5 py-8">{children}</main>
    </>
  );
}
