"use client";

import { useEffect, useRef, useState } from "react";

// Both sheets are 3x3 grids (see scripts/mascot.py). In the directions sheet,
// frame (row, col) looks toward (col - 1, row - 1); frame 4 looks ahead.
const CENTER = 4;
const REACTION_MS = 1200;

function position(frame: number) {
  return `${(frame % 3) * 50}% ${Math.floor(frame / 3) * 50}%`;
}

export default function Mascot({
  directions = "/mascots/directions.png",
  reactions = "/mascots/reactions.png",
  size = 88,
  className = "",
}: {
  directions?: string;
  reactions?: string;
  size?: number;
  className?: string;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const [look, setLook] = useState(CENTER);
  const [reaction, setReaction] = useState<number | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    function onMove(e: PointerEvent) {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vx = e.clientX - (r.left + r.width / 2);
      const vy = e.clientY - (r.top + r.height / 2);
      const dist = Math.hypot(vx, vy);
      if (dist < r.width * 0.6) {
        setLook(CENTER);
        return;
      }
      const dx = Math.abs(vx) > dist * 0.38 ? Math.sign(vx) : 0;
      const dy = Math.abs(vy) > dist * 0.38 ? Math.sign(vy) : 0;
      setLook((dy + 1) * 3 + (dx + 1));
    }
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      clearTimeout(timer.current);
    };
  }, []);

  function react() {
    clearTimeout(timer.current);
    setReaction((prev) => {
      let next = Math.floor(Math.random() * 9);
      if (next === prev) next = (next + 1) % 9;
      return next;
    });
    timer.current = setTimeout(() => setReaction(null), REACTION_MS);
  }

  const layer = "absolute inset-0 bg-no-repeat [background-size:300%_300%] [image-rendering:pixelated]";

  return (
    <button
      ref={ref}
      type="button"
      onClick={react}
      aria-label="Pixel mascot of Harish. Click for a reaction"
      title="Click me"
      className={`relative block cursor-pointer select-none rounded-xl focus-visible:outline-2 focus-visible:outline-electric-blue ${className}`}
      style={{ width: size, height: size }}
    >
      <span
        className={`block w-full h-full transition-transform duration-200 ${reaction !== null ? "scale-110 -rotate-3" : ""}`}
      >
        <span
          className={layer}
          style={{
            backgroundImage: `url(${directions})`,
            backgroundPosition: position(look),
            opacity: reaction === null ? 1 : 0,
          }}
        />
        <span
          className={layer}
          style={{
            backgroundImage: `url(${reactions})`,
            backgroundPosition: position(reaction ?? 0),
            opacity: reaction === null ? 0 : 1,
          }}
        />
      </span>
    </button>
  );
}
