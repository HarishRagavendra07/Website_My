import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import { getSite } from "@/lib/content";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export function generateMetadata(): Metadata {
  const site = getSite();
  return {
    title: `${site.name} — ${site.role}`,
    description: site.intro,
  };
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${geistMono.variable}`}>
      <body className="antialiased bg-bg text-ink font-body">{children}</body>
    </html>
  );
}
