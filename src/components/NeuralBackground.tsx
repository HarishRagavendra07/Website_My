"use client";

import { useEffect, useRef } from "react";

type Node = { x: number; y: number; vx: number; vy: number; r: number };

const LINK_DISTANCE = 150;

// A faint, slowly drifting node graph behind the hero: the site's "AI" hint.
export default function NeuralBackground({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let nodes: Node[] = [];
    let color = "34, 0, 255";
    let width = 0;
    let height = 0;
    let frame = 0;
    let visible = true;

    function readColor() {
      const hex = getComputedStyle(document.documentElement).getPropertyValue("--color-electric-blue").trim();
      const m = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})/i.exec(hex);
      if (m) color = `${parseInt(m[1], 16)}, ${parseInt(m[2], 16)}, ${parseInt(m[3], 16)}`;
    }

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas!.clientWidth;
      height = canvas!.clientHeight;
      canvas!.width = width * dpr;
      canvas!.height = height * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(70, (width * height) / 16000));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.4 + 0.8,
      }));
      draw();
    }

    function draw() {
      ctx!.clearRect(0, 0, width, height);
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < LINK_DISTANCE) {
            ctx!.strokeStyle = `rgba(${color}, ${0.18 * (1 - d / LINK_DISTANCE)})`;
            ctx!.lineWidth = 1;
            ctx!.beginPath();
            ctx!.moveTo(a.x, a.y);
            ctx!.lineTo(b.x, b.y);
            ctx!.stroke();
          }
        }
      }
      for (const n of nodes) {
        ctx!.fillStyle = `rgba(${color}, 0.45)`;
        ctx!.beginPath();
        ctx!.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx!.fill();
      }
    }

    function tick() {
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;
      }
      draw();
      frame = requestAnimationFrame(tick);
    }

    function start() {
      cancelAnimationFrame(frame);
      if (!still && visible && !document.hidden) frame = requestAnimationFrame(tick);
    }

    readColor();
    resize();
    start();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    const themeObserver = new MutationObserver(() => {
      readColor();
      draw();
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    const viewObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      start();
    });
    viewObserver.observe(canvas);
    document.addEventListener("visibilitychange", start);

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      themeObserver.disconnect();
      viewObserver.disconnect();
      document.removeEventListener("visibilitychange", start);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className={`pointer-events-none ${className}`} />;
}
