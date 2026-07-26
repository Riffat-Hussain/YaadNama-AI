"use client";

import { useEffect, useState } from "react";
import RequireProfile from "@/components/RequireProfile";
import { getSettings, setSettings } from "@/lib/storage";

function SettingsContent() {
  const [settings, setLocalSettings] = useState(getSettings());

  useEffect(() => {
    setLocalSettings(getSettings());
  }, []);

  function update(partial) {
    const next = { ...settings, ...partial };
    setLocalSettings(next);
    setSettings(next);
    window.dispatchEvent(new Event("yaadnama:settings-changed"));
  }

  return (
    <div className="max-w-xl space-y-8">
      <section>
        <h1 className="font-display text-3xl font-semibold">Settings</h1>
        <p className="mt-1 text-inkfaint">Make YaadNama comfortable for you.</p>
      </section>

      <div className="keepsake-card space-y-6 rounded-keepsake p-6 shadow-keepsake">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Dark mode</p>
            <p className="text-sm text-inkfaint">Easier on the eyes at night.</p>
          </div>
          <Toggle checked={settings.darkMode} onChange={(v) => update({ darkMode: v })} />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">High contrast</p>
            <p className="text-sm text-inkfaint">Stronger black/white contrast for readability.</p>
          </div>
          <Toggle
            checked={settings.highContrast}
            onChange={(v) => update({ highContrast: v })}
          />
        </div>

        <div>
          <p className="mb-2 font-medium">Text size</p>
          <div className="flex gap-2">
            {["normal", "large", "xlarge"].map((size) => (
              <button
                key={size}
                onClick={() => update({ fontScale: size })}
                className={`rounded-full px-4 py-2 text-sm font-medium capitalize ${
                  settings.fontScale === size
                    ? "bg-teal text-white"
                    : "bg-paper2 text-ink/70 dark:bg-white/10"
                }`}
              >
                {size === "xlarge" ? "Extra large" : size}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Toggle({ checked, onChange }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`h-8 w-14 rounded-full p-1 transition-colors ${
        checked ? "bg-teal" : "bg-paper2 dark:bg-white/20"
      }`}
    >
      <span
        className={`block h-6 w-6 rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-6" : "translate-x-0"
        }`}
      />
    </button>
  );
}

export default function SettingsPage() {
  return (
    <RequireProfile>
      <SettingsContent />
    </RequireProfile>
  );
}
