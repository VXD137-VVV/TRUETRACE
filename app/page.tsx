import React from 'react';
import { Navbar } from '@/components/landing/Navbar';
import { HeroSection } from '@/components/landing/HeroSection';
import { TrustBanner } from '@/components/landing/TrustBanner';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import { LiveVerificationWidget } from '@/components/landing/LiveVerificationWidget';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { Footer } from '@/components/landing/Footer';

export default function LandingPage() {
  return (
    <main className="flex flex-col min-h-screen">
      <Navbar />
      <HeroSection />
      <TrustBanner />
      <HowItWorksSection />
      <LiveVerificationWidget />
      <FeaturesSection />
      <Footer />
    </main>
  );
}
