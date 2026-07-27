"use client";

import { useEffect, useState } from "react";
import { Contrast, Moon, Type } from "lucide-react";
import RequireProfile from "@/components/RequireProfile";
import Card from "@/components/ui/Card";
import { getSettings, setSettings } from "@/lib/storage";

function SettingsContent() {
  const [settings, setLocalSettings] = useState(getSettings());
  useEffect(() => { setLocalSettings(getSettings()); }, []);
  function update(partial) {
    const next = { ...settings, ...partial };
    setLocalSettings(next);
    setSettings(next);
    window.dispatchEvent(new Event("yaadnama:settings-changed"));
  }
  return (
    <div className="page-fade max-w-2xl space-y-7">
      <section>
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-teal/10 px-3 py-1.5 text-sm font-semibold text-teal-dark">
          <Contrast aria-hidden="true" className="h-4 w-4" /> Make it yours
        </div>
        <h1 className="font-display text-3xl font-semibold text-ink sm:text-4xl dark:text-white">
          Settings for comfort
        </h1>
        <p className="mt-2 leading-7 text-muted">
          Choose what makes YaadNama easiest to read and use.
        </p>
      </section>
      <div className="space-y-4">
        <Card className="divide-y divide-surface-2 dark:divide-white/10">
          <SettingRow icon={Moon} title="Dark mode" description="Easier on the eyes in low light.">
            <Toggle checked={settings.darkMode} onChange={(value) => update({ darkMode: value })} label="Dark mode" />
          </SettingRow>
          <SettingRow icon={Contrast} title="High contrast" description="Stronger separation between text and backgrounds.">
            <Toggle checked={settings.highContrast} onChange={(value) => update({ highContrast: value })} label="High contrast" />
          </SettingRow>
        </Card>
        <Card>
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gold/15 text-gold-dark">
              <Type aria-hidden="true" className="h-5 w-5" />
            </span>
            <div className="flex-1">
              <p className="font-semibold text-ink dark:text-white">Text size</p>
              <p className="mt-1 text-sm leading-6 text-muted">Choose the size that feels most comfortable for reading.</p>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-2" role="radiogroup" aria-label="Text size options">
            {["normal", "large", "xlarge"].map((size) => (
              <button
                key={size}
                onClick={() => update({ fontScale: size })}
                role="radio"
                aria-checked={settings.fontScale === size}
                className={`min-h-11 rounded-full px-5 text-sm font-semibold transition duration-200 ease-out ${
                  settings.fontScale === size
                    ? "bg-teal text-white shadow-sm"
                    : "bg-surface-2 text-ink/75 hover:bg-teal/10 hover:text-teal-dark dark:bg-white/10 dark:text-white/80"
                }`}
              >
                {size === "xlarge" ? "Extra large" : size.charAt(0).toUpperCase() + size.slice(1)}
              </button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function SettingRow({ children, description, icon: Icon, title }) {
  return (
    <div className="flex items-center justify-between gap-5 py-5 first:pt-0 last:pb-0">
      <div className="flex items-start gap-3 min-w-0 flex-1">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-teal/10 text-teal-dark">
          <Icon aria-hidden="true" className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <p className="font-semibold text-ink dark:text-white">{title}</p>
          <p className="mt-1 text-sm leading-6 text-muted">{description}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

function Toggle({ checked, label, onChange }) {
  return (
    <button
      role="switch"
      aria-label={label}
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative h-8 w-[3.25rem] shrink-0 rounded-full p-0.5 transition-colors duration-200 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-dark ${
        checked ? "bg-teal" : "bg-surface-2 dark:bg-white/20"
      }`}
    >
      <span
        className={`block h-7 w-7 rounded-full bg-white shadow-md transition-transform duration-200 ease-out ${
          checked ? "translate-x-[1.4rem]" : "translate-x-0"
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
