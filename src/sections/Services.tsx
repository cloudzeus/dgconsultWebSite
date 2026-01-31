"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Cpu,
  BarChart3,
  Settings,
  Leaf,
  Package,
  Sprout,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { services } from "@/lib/data";
import Link from "next/link";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const iconMap: { [key: string]: React.ElementType } = {
  Cpu,
  BarChart3,
  Settings,
  Leaf,
  Package,
  Sprout,
};

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header animation
      gsap.fromTo(
        headerRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );

      // Cards stagger animation with 3D flip
      if (cardsRef.current) {
        const cards = cardsRef.current.querySelectorAll(".service-card");
        gsap.fromTo(
          cards,
          { rotateY: -90, opacity: 0 },
          {
            rotateY: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: cardsRef.current,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="services"
      ref={sectionRef}
      className="py-24 md:py-32 bg-white relative"
    >
      {/* Decorative Line */}
      <svg
        className="absolute top-0 left-0 w-full h-20 pointer-events-none"
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
      >
        <line
          x1="0"
          y1="40"
          x2="1440"
          y2="40"
          stroke="#D32F2F"
          strokeWidth="1"
          strokeOpacity="0.1"
          className="animate-draw"
        />
      </svg>

      <div className="max-w-[1280px] mx-auto px-6">
        {/* Header */}
        <div ref={headerRef} className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-sm font-semibold text-[#D32F2F] uppercase tracking-wider mb-4">
            Οι Υπηρεσίες μας
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#333333] mb-6">
            Ολοκληρωμένες Λύσεις Ψηφιακού Μετασχηματισμού
          </h2>
          <p className="text-lg text-[#666666] leading-relaxed">
            Αναπτύσσουμε προηγμένα συστήματα και ψηφιακές υποδομές που
            ενισχύουν την ανταγωνιστικότητα και τη βιωσιμότητα των επιχειρήσεων
          </p>
        </div>

        {/* Service Cards */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          style={{ perspective: "1000px" }}
        >
          {services.map((service, index) => {
            const Icon = iconMap[service.icon] || Cpu;
            return (
              <Card
                key={service.id}
                className="service-card group relative bg-white border border-[#E0E0E0] rounded-xl p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:border-[#D32F2F] cursor-pointer"
                style={{
                  transformStyle: "preserve-3d",
                  marginTop: index % 3 === 1 ? "24px" : "0",
                }}
              >
                <CardContent className="p-0">
                  {/* Icon */}
                  <div className="w-14 h-14 rounded-xl bg-[#D32F2F]/10 flex items-center justify-center mb-6 transition-all duration-300 group-hover:bg-[#D32F2F] group-hover:scale-110">
                    <Icon className="w-7 h-7 text-[#D32F2F] transition-colors duration-300 group-hover:text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-[#333333] mb-3 group-hover:text-[#D32F2F] transition-colors duration-300">
                    {service.title}
                  </h3>
                  <p className="text-[#666666] leading-relaxed mb-4">
                    {service.description}
                  </p>

                  {/* Link */}
                  <Link
                    href={`#${service.slug}`}
                    className="inline-flex items-center text-sm font-semibold text-[#D32F2F] opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0"
                  >
                    Μάθετε περισσότερα
                    <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
