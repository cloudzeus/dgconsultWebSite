"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { processSteps } from "@/lib/data";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Process() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<SVGLineElement>(null);

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

      // Timeline line draw animation
      if (lineRef.current) {
        const lineLength = lineRef.current.getTotalLength();
        gsap.set(lineRef.current, {
          strokeDasharray: lineLength,
          strokeDashoffset: lineLength,
        });

        gsap.to(lineRef.current, {
          strokeDashoffset: 0,
          duration: 1.5,
          ease: "power3.out",
          scrollTrigger: {
            trigger: timelineRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        });
      }

      // Steps animation
      if (timelineRef.current) {
        const steps = timelineRef.current.querySelectorAll(".process-step");
        steps.forEach((step, index) => {
          const number = step.querySelector(".step-number");
          const content = step.querySelector(".step-content");

          // Number scale animation
          gsap.fromTo(
            number,
            { scale: 0, opacity: 0 },
            {
              scale: 1,
              opacity: 1,
              duration: 0.5,
              ease: "back.out(1.7)",
              scrollTrigger: {
                trigger: step,
                start: "top 85%",
                toggleActions: "play none none none",
              },
              delay: index * 0.15,
            }
          );

          // Content fade in
          gsap.fromTo(
            content,
            { y: 20, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.4,
              ease: "power3.out",
              scrollTrigger: {
                trigger: step,
                start: "top 85%",
                toggleActions: "play none none none",
              },
              delay: index * 0.15 + 0.1,
            }
          );
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-24 md:py-32 bg-[#333333] relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" viewBox="0 0 1440 900">
          <defs>
            <pattern
              id="dots"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="2" cy="2" r="2" fill="#fff" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>
      </div>

      <div className="max-w-[1280px] mx-auto px-6 relative z-10">
        {/* Header */}
        <div ref={headerRef} className="text-center max-w-3xl mx-auto mb-20">
          <span
            data-animate
            className="inline-block text-sm font-semibold text-[#D32F2F] uppercase tracking-wider mb-4"
          >
            Η Μεθοδολογία μας
          </span>
          <h2
            data-animate
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6"
          >
            Πώς Δουλεύουμε
          </h2>
          <p data-animate className="text-lg text-gray-400 leading-relaxed">
            Ακολουθούμε μια δομημένη προσέγγιση για να εξασφαλίσουμε την
            επιτυχία κάθε έργου
          </p>
        </div>

        {/* Timeline */}
        <div ref={timelineRef} className="relative">
          {/* Timeline Line - Desktop */}
          <svg
            className="hidden lg:block absolute top-16 left-0 w-full h-2"
            viewBox="0 0 1200 8"
            preserveAspectRatio="none"
          >
            <line
              ref={lineRef}
              x1="100"
              y1="4"
              x2="1100"
              y2="4"
              stroke="#D32F2F"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>

          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            {processSteps.map((step, index) => (
              <div
                key={step.number}
                className="process-step relative flex flex-col items-center text-center"
              >
                {/* Number */}
                <div
                  className="step-number relative z-10 w-20 h-20 rounded-full bg-[#D32F2F] flex items-center justify-center mb-6 animate-pulse-glow"
                >
                  <span className="text-2xl font-bold text-white">
                    {step.number}
                  </span>
                </div>

                {/* Content */}
                <div className="step-content">
                  <h3 className="text-xl font-bold text-white mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Connector - Mobile */}
                {index < processSteps.length - 1 && (
                  <div className="lg:hidden absolute -bottom-4 left-1/2 w-0.5 h-8 bg-[#D32F2F]/30 -translate-x-1/2" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
