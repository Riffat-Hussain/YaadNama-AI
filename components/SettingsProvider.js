"use client";

import { useEffect } from "react";
import { getSettings } from "@/lib/storage";

const FONT_SIZE_MAP = {
  normal: "18px",
  large: "21px",
  xlarge: "25px",
};

export default function SettingsProvider({ children }) {
  useEffect(() => {
    applySettings(getSettings());

    function onStorage(e) {
      if (e.key === "yaadnama_settings") {
        applySettings(getSettings());
      }
    }
    window.addEventListener("storage", onStorage);
    window.addEventListener("yaadnama:settings-changed", () =>
      applySettings(getSettings())
    );
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  function applySettings(settings) {
    const root = document.documentElement;
    root.classList.toggle("dark", !!settings.darkMode);
    root.classList.toggle("high-contrast", !!settings.highContrast);
    root.style.fontSize = FONT_SIZE_MAP[settings.fontScale] || FONT_SIZE_MAP.normal;
  }

  return children;
}
