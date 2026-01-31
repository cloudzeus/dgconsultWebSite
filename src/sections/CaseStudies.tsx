"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";
import { caseStudies as staticCaseStudies } from "@/lib/data";
import { CaseStudy } from "@prisma/client";
import Link from "next/link";
import Image from "next/image";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface CaseStudiesProps {
  data?: CaseStudy[];
}

export default function CaseStudies({ data }: CaseStudiesProps) {
  const displayStudies = data && data.length > 0 ? data : (staticCaseStudies as any);
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

      // Cards animation
      if (cardsRef.current) {
        const cards = cardsRef.current.querySelectorAll(".case-card");
        cards.forEach((card, index) => {
          const image = card.querySelector(".card-image-inner");

          gsap.fromTo(
            card,
            { y: 60, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.7,
              ease: "power3.out",
              scrollTrigger: {
                trigger: card,
                start: "top 85%",
                toggleActions: "play none none none",
              },
              delay: index * 0.15,
            }
          );

          // Parallax on image
          if (image) {
            gsap.fromTo(
              image,
              { scale: 1.1, y: 30 },
              {
                scale: 1,
                y: -30,
                ease: "none",
                scrollTrigger: {
                  trigger: card,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: true,
                },
              }
            );
          }
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-24 md:py-32 bg-white relative"
    >
      <div className="max-w-[1280px] mx-auto px-6">
        {/* Header */}
        <div ref={headerRef} className="text-center max-w-3xl mx-auto mb-16">
          <span
            data-animate
            className="inline-block text-sm font-semibold text-[#D32F2F] uppercase tracking-wider mb-4"
          >
            Επιτυχημένα Έργα
          </span>
          <h2
            data-animate
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#333333] mb-6"
          >
            Case Studies
          </h2>
          <p data-animate className="text-lg text-[#666666] leading-relaxed">
            Ανακαλύψτε πώς οι λύσεις μας μετασχημάτισαν επιχειρήσεις του
            αγροδιατροφικού τομέα
          </p>
        </div>

        {/* Case Study Cards */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {displayStudies.map((study: any, index: number) => (
            <Link
              key={study.id}
              href={`/case-studies/${study.slug}`}
              className="case-card group relative rounded-2xl overflow-hidden bg-[#F5F5F5] aspect-[4/5] block"
            >
              {/* Image Container */}
              <div className="card-image absolute inset-0 overflow-hidden">
                <div className="card-image-inner w-full h-full relative">
                  <Image
                    src={study.featuredImage}
                    alt={study.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/20" />
                </div>
              </div>

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/90 via-[#1A1A1A]/40 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-400" />

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 transform group-hover:-translate-y-2 transition-transform duration-400">
                {/* Category Badge */}
                <span className="inline-block px-3 py-1 bg-[#D32F2F] text-white text-xs font-semibold rounded-full mb-4">
                  {study.category}
                </span>

                {/* Title */}
                <h3 className="text-xl md:text-2xl font-bold text-white mb-3 line-clamp-2">
                  {study.title}
                </h3>

                {/* Description */}
                <p className="text-gray-300 text-sm leading-relaxed mb-4 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-400">
                  {study.description}
                </p>

                {/* Link */}
                <span className="inline-flex items-center text-[#D32F2F] font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-400">
                  Διαβάστε περισσότερα
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
