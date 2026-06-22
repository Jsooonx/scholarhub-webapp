import type { Metadata } from "next";
import { Inter, Lora } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import { ShortlistProvider } from "@/components/ShortlistProvider";
import { BASE_URL } from "@/lib/scholarships";

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
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'ScholarHub - Find Your Scholarship',
    template: '%s - ScholarHub',
  },
  description: 'Your go-to destination for discovering scholarships worldwide. Browse DAAD, MEXT, Türkiye Burslari, Chevening, and more - all in one place.',
  openGraph: {
    siteName: 'ScholarHub',
    type: 'website',
    url: BASE_URL,
    title: 'ScholarHub - Find Your Scholarship',
    description: 'Your go-to destination for discovering scholarships worldwide. Browse DAAD, MEXT, Türkiye Burslari, Chevening, and more - all in one place.',
    images: [{ url: '/images/og-image.png', width: 1200, height: 630, alt: 'ScholarHub' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ScholarHub - Find Your Scholarship',
    description: 'Your go-to destination for discovering scholarships worldwide.',
    images: ['/images/og-image.png'],
  },
  alternates: {
    canonical: BASE_URL,
  },
  robots: {
    index: true,
    follow: true,
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
        <Suspense>
          <ShortlistProvider>
            <SmoothScroll>
              {children}
            </SmoothScroll>
          </ShortlistProvider>
        </Suspense>
      </body>
    </html>
  );
}
