import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import EditorsPick from "@/components/EditorsPick";
import AdBanner from "@/components/AdBanner";
import Trending from "@/components/Trending";
import Inspiration from "@/components/Inspiration";
import LatestPosts from "@/components/LatestPosts";
import NewsletterFooter from "@/components/NewsletterFooter";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-brand-bg select-text selection:bg-brand-dark selection:text-white">
      {/* Navigation */}
      <Navbar />

      {/* Main Content Layout */}
      <main className="flex-grow">
        {/* Hero Area */}
        <Hero />

        {/* Editor's Pick Section */}
        <EditorsPick />

        {/* Ad Banner Promo */}
        <AdBanner />

        {/* Trending Section */}
        <Trending />

        {/* Inspiration Section */}
        <Inspiration />

        {/* Latest Posts Row List */}
        <LatestPosts />

        {/* Stacked Newsletter Sign-up */}
        <NewsletterFooter />
      </main>

      {/* Footnote & Instagram block */}
      <Footer />
    </div>
  );
}
