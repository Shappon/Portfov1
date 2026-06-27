import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ResponsiveGuard } from "@/components/ResponsiveGuard";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Shuan Huynh — Développeur full-stack autodidacte",
    template: "%s | Shuan Huynh — Portfolio",
  },
  description:
    "Développeur full-stack autodidacte. Je conçois des applications web utiles : SaaS, outils métiers, dashboards et assistants IA.",
  openGraph: {
    title: "Shuan Huynh — Développeur full-stack autodidacte",
    description:
      "Je conçois des applications web utiles : SaaS, outils métiers, dashboards et assistants IA.",
    type: "website",
    siteName: "Shuan Huynh — Portfolio",
    locale: "fr_FR",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover" as const,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ResponsiveGuard>{children}</ResponsiveGuard>
      </body>
    </html>
  );
}
