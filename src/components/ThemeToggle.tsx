"use client";

import { MoonIcon, SunIcon } from "./icons";

export default function ThemeToggle({ className = "" }: { className?: string }) {
  function toggle() {
    const root = document.documentElement;
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {}
  }

  // Both icons render and CSS picks one, so server and client markup match.
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle light and dark mode"
      title="Toggle light / dark"
      className={`flex items-center justify-center w-9 h-9 rounded-full text-ink/80 hover:text-ink hover:bg-ink/5 transition-colors ${className}`}
    >
      <MoonIcon className="w-[18px] h-[18px] dark:hidden" />
      <SunIcon className="w-[18px] h-[18px] hidden dark:block" />
    </button>
  );
}
