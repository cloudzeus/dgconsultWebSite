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

export const revalidate = 60; // Revalidate every 60 seconds

export default async function Home() {
  const sectors = await prisma.sector.findMany({
    where: { isFeatured: true, isActive: true },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <main className="min-h-screen">
      <SmoothScroll />
      <Header />
      <Hero />
      <Services />
      <About />
      <Sectors data={sectors} />
      <Process />
      <CaseStudies />
      <CTA />
      <Contact />
      <Footer />
    </main>
  );
}
