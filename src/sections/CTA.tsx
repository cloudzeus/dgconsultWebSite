"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function CTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const shapesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Content animation
      gsap.fromTo(
        contentRef.current?.querySelectorAll("[data-animate]") || [],
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: contentRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      // Floating shapes parallax
      if (shapesRef.current) {
        const shapes = shapesRef.current.querySelectorAll(".floating-shape");
        shapes.forEach((shape, index) => {
          gsap.to(shape, {
            y: -50,
            rotation: 20,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          });
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-24 md:py-32 relative overflow-hidden"
    >
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#D32F2F] to-[#B71C1C] animate-gradient" />

      {/* Floating Shapes */}
      <div ref={shapesRef} className="absolute inset-0 pointer-events-none">
        <div
          className="floating-shape absolute top-[10%] left-[5%] w-32 h-32 rounded-full bg-white/10"
          style={{ animation: "float 8s ease-in-out infinite" }}
        />
        <div
          className="floating-shape absolute top-[60%] left-[15%] w-20 h-20 border-2 border-white/10 rotate-45"
          style={{ animation: "float 10s ease-in-out infinite", animationDelay: "1s" }}
        />
        <div
          className="floating-shape absolute top-[20%] right-[10%] w-40 h-40 rounded-full bg-white/5"
          style={{ animation: "float 12s ease-in-out infinite", animationDelay: "2s" }}
        />
        <div
          className="floating-shape absolute bottom-[20%] right-[20%] w-24 h-24 border border-white/10"
          style={{ animation: "float 9s ease-in-out infinite", animationDelay: "0.5s" }}
        />
        <div
          className="floating-shape absolute top-[40%] right-[30%] w-16 h-16 rounded-full bg-white/10"
          style={{ animation: "float 11s ease-in-out infinite", animationDelay: "1.5s" }}
        />
      </div>

      {/* Content */}
      <div
        ref={contentRef}
        className="max-w-[800px] mx-auto px-6 text-center relative z-10"
      >
        <h2
          data-animate
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6"
        >
          Έτοιμοι να Μετασχηματίσετε την Επιχείρησή σας;
        </h2>
        <p
          data-animate
          className="text-lg md:text-xl text-white/90 leading-relaxed mb-10"
        >
          Επικοινωνήστε μαζί μας σήμερα για να συζητήσουμε πώς οι λύσεις μας
          μπορούν να ενισχύσουν την ανταγωνιστικότητα και τη βιωσιμότητα της
          επιχείρησής σας.
        </p>

        <div
          data-animate
          className="flex flex-wrap justify-center gap-4 mb-8"
        >
          <Button
            asChild
            size="lg"
            className="bg-white text-[#D32F2F] hover:bg-white/90 font-semibold px-8 py-6 text-base rounded-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(0,0,0,0.2)] group"
          >
            <Link href="/#contact">
              Ζητήστε Δωρεάν Συμβουλευτική
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>

        <p data-animate className="text-white/80">
          Ή καλέστε μας στο{" "}
          <a
            href="tel:+302101234567"
            className="text-white font-semibold hover:underline inline-flex items-center"
          >
            <Phone className="mr-2 h-4 w-4" />
            +30 210 1234567
          </a>
        </p>
      </div>
    </section>
  );
}
