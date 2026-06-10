import type { Metadata } from "next";
import { Inter, Lora } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const lora = Lora({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ScholarHub - Find Your Scholarship",
  description: "Your go-to destination for discovering scholarships worldwide. Browse DAAD, MEXT, Türkiye Burslari, and more - all in one place.",
  openGraph: {
    siteName: 'ScholarHub',
    type: 'website',
  },
  twitter: {
    card: 'summary',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${lora.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-brand-bg text-brand-dark font-sans flex flex-col selection:bg-brand-dark selection:text-white">
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
