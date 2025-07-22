import Hero from '@/components/shared/Hero';
import MarketHighlights from '@/components/market/MarketHighlights';
import HowItWorks from '@/components/shared/HowItWorks';
import FeaturedProducts from '@/components/product/FeaturedProducts';
import TestimonialsSection from '@/components/shared/TestimonialsSection';

export default function HomePage() {
  return (
    <div className="container mx-auto px-4">
      <Hero />
      <MarketHighlights />
      <HowItWorks />
      <FeaturedProducts />
      <TestimonialsSection />
    </div>
  );
}