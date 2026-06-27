
import Hero from "@/components/Hero";
import CuratedPicks from "@/components/CuratedPicks";
import OpenThisMonth from "@/components/OpenThisMonth";
import AdBanner from "@/components/AdBanner";
import Trending from "@/components/Trending";
import Inspiration from "@/components/Inspiration";
import NewsletterFooter from "@/components/NewsletterFooter";
import Footer from "@/components/Footer";
import { BASE_URL } from "@/lib/scholarships";

export default function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${BASE_URL}/#website`,
        "url": BASE_URL,
        "name": "ScholarHub",
        "description": "Your go-to destination for discovering scholarships worldwide.",
        "publisher": {
          "@id": `${BASE_URL}/#organization`
        },
        "potentialAction": [
          {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": `${BASE_URL}/scholarships?q={search_term_string}`
            },
            "query-input": "required name=search_term_string"
          }
        ]
      },
      {
        "@type": "Organization",
        "@id": `${BASE_URL}/#organization`,
        "name": "ScholarHub",
        "url": BASE_URL,
        "logo": {
          "@type": "ImageObject",
          "@id": `${BASE_URL}/#logo`,
          "url": `${BASE_URL}/images/logos/Scholarhub_logo.png`,
          "caption": "ScholarHub Logo"
        },
        "image": {
          "@id": `${BASE_URL}/#logo`
        }
      }
    ]
  };

  return (
    <div className="flex flex-col min-h-screen bg-brand-bg select-text selection:bg-brand-dark selection:text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />


      {/* Main Content Layout */}
      <main className="flex-grow">
        {/* Hero Area */}
        <Hero />

        {/* Handpicked Curated Picks */}
        <CuratedPicks />

        {/* Featured Scholarships Section */}
        <OpenThisMonth />

        {/* Ad Banner Promo */}
        <AdBanner />

        {/* Trending Section */}
        <Trending />

        {/* Inspiration Section */}
        <Inspiration />

        {/* Stacked Newsletter Sign-up */}
        <NewsletterFooter />
      </main>

      {/* Footnote & Instagram block */}
      <Footer />
    </div>
  );
}
