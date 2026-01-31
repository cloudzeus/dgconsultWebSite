"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { sectors } from "@/lib/data";
import Link from "next/link";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Sectors() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header animation
      gsap.fromTo(
        headerRef.current?.querySelectorAll("[data-animate]") || [],
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );

      // Cards animation with alternating clip-path
      if (cardsRef.current) {
        const cards = cardsRef.current.querySelectorAll(".sector-card");
        cards.forEach((card, index) => {
          const image = card.querySelector(".card-image");
          const content = card.querySelector(".card-content");
          const isEven = index % 2 === 1;

          // Image clip-path reveal
          gsap.fromTo(
            image,
            { clipPath: isEven ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)" },
            {
              clipPath: "inset(0 0% 0 0%)",
              duration: 0.7,
              ease: "power3.out",
              scrollTrigger: {
                trigger: card,
                start: "top 80%",
                toggleActions: "play none none none",
              },
            }
          );

          // Content slide in
          gsap.fromTo(
            content,
            { x: isEven ? -40 : 40, opacity: 0 },
            {
              x: 0,
              opacity: 1,
              duration: 0.6,
              ease: "power3.out",
              scrollTrigger: {
                trigger: card,
                start: "top 75%",
                toggleActions: "play none none none",
              },
            }
          );
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="sectors"
      ref={sectionRef}
      className="py-24 md:py-32 bg-white relative"
    >
      <div className="max-w-[1280px] mx-auto px-6">
        {/* Header */}
        <div ref={headerRef} className="max-w-3xl mb-16">
          <span
            data-animate
            className="inline-block text-sm font-semibold text-[#D32F2F] uppercase tracking-wider mb-4"
          >
            Τομείς Εφαρμογής
          </span>
          <h2
            data-animate
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#333333] mb-6"
          >
            Εξειδίκευση στον Αγροδιατροφικό Τομέα
          </h2>
          <p data-animate className="text-lg text-[#666666] leading-relaxed">
            Η DGConsult στηρίζει τη μετάβαση του αγροδιατροφικού συμπλέγματος
            στη νέα ψηφιακή εποχή
          </p>
        </div>

        {/* Sector Cards */}
        <div ref={cardsRef} className="space-y-12">
          {sectors.map((sector, index) => {
            const isEven = index % 2 === 1;
            return (
              <div
                key={sector.id}
                className={`sector-card grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-2xl overflow-hidden bg-[#F5F5F5] group hover:shadow-[0_20px_60px_rgba(0,0,0,0.1)] transition-shadow duration-500`}
              >
                {/* Image */}
                <div
                  className={`card-image relative h-64 lg:h-80 overflow-hidden ${isEven ? "lg:order-2" : ""
                    }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#D32F2F]/20 to-[#333333]/20 group-hover:opacity-0 transition-opacity duration-500 z-10" />
                  <Image
                    src={sector.image}
                    alt={sector.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/10 z-[5]" />
                </div>

                {/* Content */}
                <div
                  className={`card-content p-8 lg:p-12 flex flex-col justify-center ${isEven ? "lg:order-1" : ""
                    }`}
                >
                  <h3 className="text-2xl md:text-3xl font-bold text-[#333333] mb-4 group-hover:text-[#D32F2F] transition-colors duration-300">
                    {sector.title}
                  </h3>
                  <p className="text-[#666666] leading-relaxed mb-6">
                    {sector.description}
                  </p>
                  <Link
                    href={`#${sector.slug}`}
                    className="inline-flex items-center text-[#D32F2F] font-semibold group/link"
                  >
                    <span className="relative">
                      Μάθετε περισσότερα
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#D32F2F] transition-all duration-300 group-hover/link:w-full" />
                    </span>
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover/link:translate-x-1" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
