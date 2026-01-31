import { prisma } from "@/lib/db";
import Header from "@/sections/Header";
import Hero from "@/sections/Hero";
import Services from "@/sections/Services";
import About from "@/sections/About";
import Sectors from "@/sections/Sectors";
import Process from "@/sections/Process";
import CaseStudies from "@/sections/CaseStudies";
import CTA from "@/sections/CTA";
import Contact from "@/sections/Contact";
import Footer from "@/sections/Footer";
import SmoothScroll from "@/components/SmoothScroll";

import { Metadata } from "next";

export const revalidate = 60; // Revalidate every 60 seconds

export async function generateMetadata(): Promise<Metadata> {
  const settings = await prisma.globalSettings.findFirst();

  const title = settings?.defaultMetaTitle || "DGCONSULT - Business Solutions on Demand";
  const description = settings?.defaultMetaDescription || "Εξειδικευμένες λύσεις ψηφιακού μετασχηματισμού και ανάλυσης δεδομένων για τον αγροδιατροφικό τομέα. AI, IoT, Big Data Analytics.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'el_GR',
      images: ['/og-image.jpg'], // Fallback or dynamic
    }
  };
}

export default async function Home() {
  const [sectors, settings] = await Promise.all([
    prisma.sector.findMany({
      where: { isFeatured: true, isActive: true },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.globalSettings.findFirst()
  ]);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'DGCONSULT',
    url: 'https://dgconsult.gr',
    description: 'Business Solutions on Demand - Digital Transformation Consultancy',
    publisher: {
      '@type': 'Organization',
      name: 'DGCONSULT',
      logo: 'https://dgconsult.gr/logo.png'
    }
  };

  return (
    <>
      <SmoothScroll />
      <Header settings={settings} />
      <main className="min-h-screen">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Hero />
        <Services />
        <About />
        <Sectors data={sectors} />
        <Process />
        <CaseStudies />
        <CTA />
        <Contact settings={settings} />
      </main>
      <Footer settings={settings} />
    </>
  );
}
