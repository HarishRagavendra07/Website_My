"use client";

import { useState } from "react";
import { CloseIcon, MenuIcon } from "./icons";

const links = [
  { href: "#projects", label: "Projects" },
  { href: "#skills", label: "Skills" },
  { href: "#experience", label: "Experience" },
  { href: "#contact", label: "Contact" },
];

export default function Header({ name, resume }: { name: string; resume: string }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-bg border-b border-border">
      <nav
        className="max-w-[1200px] mx-auto px-4 h-16 flex items-center justify-between"
        aria-label="Primary navigation"
      >
        <a href="#top" className="flex items-center gap-2.5 group">
          <span className="w-4 h-4 rounded-[3px] bg-electric-blue shrink-0 rotate-45 group-hover:rotate-0 transition-transform duration-300" />
          <span className="font-medium text-ink text-[15px] tracking-[-0.01em]">{name}</span>
        </a>
        <ul className="hidden sm:flex items-center gap-8">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="text-[14px] text-ink/80 hover:text-ink transition-colors">
                {l.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href={resume}
              download
              className="text-[14px] px-3 pt-[6px] pb-[5px] rounded-btn bg-carbon text-white hover:bg-accent-hover transition-colors"
            >
              Resume
            </a>
          </li>
        </ul>
        <button
          className="sm:hidden p-2 text-ink"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <CloseIcon /> : <MenuIcon />}
        </button>
      </nav>
      {open && (
        <ul className="sm:hidden border-t border-border bg-bg px-4 py-3 space-y-1">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                onClick={() => setOpen(false)}
                className="block py-2 text-[15px] text-ink/80 hover:text-ink"
              >
                {l.label}
              </a>
            </li>
          ))}
          <li className="pt-2">
            <a
              href={resume}
              download
              className="inline-block text-[14px] px-3 pt-[6px] pb-[5px] rounded-btn bg-carbon text-white"
            >
              Resume
            </a>
          </li>
        </ul>
      )}
    </header>
  );
}
