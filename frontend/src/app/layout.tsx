import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

import { AppNavbar } from "@/components/AppNavbar";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pulmo AI — Precision Clinical Thoracic Oncology",
  description: "Deep Multi-Backbone Tri-Ensemble (90.16% Accuracy) for Automated Lung Cancer Detection & Histopathological Subtyping",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${jetbrainsMono.variable} ${plusJakartaSans.variable}`}>
        <div className="site-layout">
          <AppNavbar />
          <main className="site-content">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
