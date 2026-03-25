import type { Metadata, Viewport } from "next";
import { Barlow, Barlow_Condensed, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { DynamicBackground } from "@/components/layout/DynamicBackground";

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-barlow",
});

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["900"],
  variable: "--font-barlow-condensed",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const viewport: Viewport = {
  themeColor: "#060A12",
};

export const metadata: Metadata = {
  title: "PITCH 26 · World Cup Edition",
  description: "La plataforma de colección dinámica del Mundial 2026",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${barlow.variable} ${barlowCondensed.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <div className="bg-mesh" />
        <div className="bg-gradients" />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

