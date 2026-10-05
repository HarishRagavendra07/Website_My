import type { ReactNode } from "react";

export function Section({
  id,
  label,
  title,
  intro,
  children,
  as: Tag = "section",
}: {
  id: string;
  label: string;
  title: string;
  intro?: string;
  children: ReactNode;
  as?: "section" | "footer";
}) {
  return (
    <Tag id={id} aria-label={label} className="py-16 px-4 max-w-[1200px] mx-auto border-t border-border">
      <div className="mb-8">
        <h2 className="font-heading font-medium text-[24px] leading-[1.27] tracking-[-0.02em] text-ink mb-1.5">
          {title}
        </h2>
        {intro && <p className="text-sm text-muted max-w-xl">{intro}</p>}
      </div>
      {children}
    </Tag>
  );
}

export function Chip({ children, mono = true }: { children: ReactNode; mono?: boolean }) {
  return (
    <span
      className={`${mono ? "font-mono" : ""} text-[11px] px-2.5 py-1 rounded-full bg-card-alt text-ink`}
    >
      {children}
    </span>
  );
}

export const btnPrimary =
  "text-[16px] px-3 pt-[6px] pb-[5px] rounded-btn bg-carbon text-white hover:bg-accent-hover transition-colors";
export const btnOutline =
  "flex items-center gap-1.5 text-[16px] px-3 pt-[6px] pb-[5px] rounded-btn border border-ink text-ink hover:bg-ink/5 transition-colors";
