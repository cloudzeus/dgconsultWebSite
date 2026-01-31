"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const shapesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Scroll-triggered parallax (kept as it is interaction-driven, not load-critical)
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "+=50%",
        scrub: true,
        onUpdate: (self) => {
          const progress = self.progress;
          if (contentRef.current) {
            gsap.set(contentRef.current, { y: -80 * progress });
          }
          if (shapesRef.current) {
            gsap.set(shapesRef.current, { y: -120 * progress });
          }
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center overflow-hidden bg-white"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <svg
          className="w-full h-full"
          viewBox="0 0 1440 900"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="grid"
              width="60"
              height="60"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 60 0 L 0 0 0 60"
                fill="none"
                stroke="#D32F2F"
                strokeWidth="0.5"
                strokeOpacity="0.1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Floating Decorative Shapes */}
      <div ref={shapesRef} className="absolute inset-0 pointer-events-none animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
        {/* Circle 1 */}
        <div
          className="absolute top-[15%] right-[10%] w-32 h-32 rounded-full border-2 border-[#D32F2F]/10 animate-float"
        />
        {/* Circle 2 */}
        <div
          className="absolute top-[60%] right-[25%] w-20 h-20 rounded-full bg-[#D32F2F]/5 animate-float-delayed"
        />
        {/* Square */}
        <div
          className="absolute top-[25%] right-[30%] w-16 h-16 border-2 border-[#333333]/10 rotate-45 animate-float"
          style={{ animationDelay: "0.5s" }}
        />
        {/* Line */}
        <svg
          className="absolute bottom-[20%] right-[15%] w-40 h-40"
          viewBox="0 0 100 100"
        >
          <line
            x1="0"
            y1="50"
            x2="100"
            y2="50"
            stroke="#D32F2F"
            strokeWidth="1"
            strokeOpacity="0.2"
            className="animate-draw"
          />
        </svg>
        {/* Dots */}
        <div className="absolute top-[40%] right-[8%] flex gap-2">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-[#D32F2F]/20"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div
        ref={contentRef}
        className="relative z-10 max-w-[1280px] mx-auto px-6 py-32"
      >
        <div className="max-w-3xl">
          {/* Badge */}
          <div ref={badgeRef} className="mb-6 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            <Badge
              variant="outline"
              className="px-4 py-2 text-sm font-medium border-[#D32F2F]/30 text-[#D32F2F] bg-[#D32F2F]/5"
            >
              Ψηφιακός Μετασχηματισμός & Big Data Analytics
            </Badge>
          </div>

          {/* Title */}
          <h1
            ref={titleRef}
            className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-[#333333] leading-[1.1] mb-6 animate-fade-in-up"
            style={{ perspective: "1000px", animationDelay: "0.2s" }}
          >
            Business Solutions
            <br />
            <span className="text-[#D32F2F]">on</span>{" "}
            <span className="text-[#D32F2F]">Demand</span>
          </h1>

          {/* Subtitle */}
          <p
            ref={subtitleRef}
            className="text-lg md:text-xl text-[#666666] leading-relaxed mb-10 max-w-2xl animate-fade-in-up"
            style={{ animationDelay: "0.3s" }}
          >
            Εξειδικευμένες λύσεις ψηφιακού μετασχηματισμού και ανάλυσης
            δεδομένων για τον αγροδιατροφικό τομέα. Συνδυάζουμε τεχνητή
            νοημοσύνη, IoT και αυτοματοποίηση για να ενισχύσουμε την
            ανταγωνιστικότητα της επιχείρησής σας.
          </p>

          {/* CTAs */}
          <div ref={ctaRef} className="flex flex-wrap gap-4 animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
            <Button
              asChild
              size="lg"
              className="bg-[#D32F2F] hover:bg-[#B71C1C] text-white font-semibold px-8 py-6 text-base rounded-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(211,47,47,0.3)] group"
            >
              <Link href="#services">
                Ανακαλύψτε τις Υπηρεσίες μας
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-2 border-[#333333] text-[#333333] hover:bg-[#333333] hover:text-white font-semibold px-8 py-6 text-base rounded-lg transition-all duration-200"
            >
              <Link href="#contact">
                <Phone className="mr-2 h-5 w-5" />
                Επικοινωνήστε μαζί μας
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}
