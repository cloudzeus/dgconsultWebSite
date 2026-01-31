"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { stats } from "@/lib/data";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const statRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Content animation
      gsap.fromTo(
        contentRef.current?.querySelectorAll("[data-animate]") || [],
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: contentRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      // Stats counter animation
      statRefs.current.forEach((statEl, index) => {
        if (!statEl) return;
        
        const valueEl = statEl.querySelector(".stat-value");
        const endValue = stats[index].value;
        
        ScrollTrigger.create({
          trigger: statEl,
          start: "top 85%",
          onEnter: () => {
            gsap.fromTo(
              { value: 0 },
              { value: endValue },
              {
                duration: 1.5,
                ease: "power2.out",
                onUpdate: function () {
                  if (valueEl) {
                    valueEl.textContent = Math.round(this.targets()[0].value).toString();
                  }
                },
              }
            );
          },
          once: true,
        });
      });

      // Stats fade in
      gsap.fromTo(
        statsRef.current?.querySelectorAll(".stat-item") || [],
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: statsRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="py-24 md:py-32 bg-[#F5F5F5] relative overflow-hidden"
    >
      {/* Background Decorative Shapes */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-[10%] left-[5%] w-64 h-64 rounded-full border border-[#D32F2F]/5"
          style={{ animation: "float 10s ease-in-out infinite" }}
        />
        <div
          className="absolute bottom-[15%] right-[8%] w-48 h-48 rounded-full bg-[#D32F2F]/3"
          style={{ animation: "float 8s ease-in-out infinite", animationDelay: "2s" }}
        />
        <div
          className="absolute top-[40%] right-[15%] w-32 h-32 border-2 border-[#333333]/5 rotate-12"
          style={{ animation: "float 12s ease-in-out infinite", animationDelay: "1s" }}
        />
      </div>

      <div className="max-w-[1280px] mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div ref={contentRef}>
            <span
              data-animate
              className="inline-block text-sm font-semibold text-[#D32F2F] uppercase tracking-wider mb-4"
            >
              Ποιοι Είμαστε
            </span>
            <h2
              data-animate
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#333333] mb-6"
            >
              Η DGConsult
            </h2>
            <p
              data-animate
              className="text-lg text-[#666666] leading-relaxed mb-6"
            >
              Η DGConsult είναι εταιρεία συμβουλευτικών και τεχνολογικών
              υπηρεσιών που εστιάζει στον ψηφιακό μετασχηματισμό και στην
              αξιοποίηση δεδομένων μεγάλου όγκου σε επιχειρήσεις του
              αγροδιατροφικού συμπλέγματος και της βιομηχανίας.
            </p>
            <p
              data-animate
              className="text-lg text-[#666666] leading-relaxed mb-8"
            >
              Συνδυάζουμε τεχνογνωσία σε τεχνητή νοημοσύνη, IoT, ανάλυση
              δεδομένων και αυτοματοποίηση, προσφέροντας λύσεις που ενισχύουν
              την ανταγωνιστικότητα, τη βιωσιμότητα και τη στρατηγική λήψη
              αποφάσεων.
            </p>

            {/* Stats */}
            <div
              ref={statsRef}
              className="grid grid-cols-3 gap-6 pt-8 border-t border-[#E0E0E0]"
            >
              {stats.map((stat, index) => (
                <div
                  key={stat.label}
                  ref={(el) => { statRefs.current[index] = el; }}
                  className="stat-item text-center"
                >
                  <div className="text-3xl md:text-4xl font-extrabold text-[#D32F2F] mb-1">
                    <span className="stat-value">0</span>
                    <span>{stat.suffix}</span>
                  </div>
                  <div className="text-sm text-[#666666]">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Visual */}
          <div className="relative">
            {/* Main Content Box */}
            <div className="relative bg-white rounded-2xl p-8 md:p-12 shadow-[0_20px_60px_rgba(0,0,0,0.1)]">
              {/* Decorative Frame */}
              <div className="absolute -top-4 -left-4 w-24 h-24 border-t-4 border-l-4 border-[#D32F2F] rounded-tl-2xl" />
              <div className="absolute -bottom-4 -right-4 w-24 h-24 border-b-4 border-r-4 border-[#D32F2F] rounded-br-2xl" />

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#D32F2F]/10 flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-6 h-6 text-[#D32F2F]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-[#333333] mb-2">
                      Καινοτομία
                    </h4>
                    <p className="text-[#666666]">
                      Αξιοποιούμε τις πιο σύγχρονες τεχνολογίες για να
                      δημιουργήσουμε λύσεις που ανταποκρίνονται στις ανάγκες
                      του αύριο.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#D32F2F]/10 flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-6 h-6 text-[#D32F2F]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-[#333333] mb-2">
                      Εξειδίκευση
                    </h4>
                    <p className="text-[#666666]">
                      Η ομάδα μας διαθέτει βαθιά γνώση του αγροδιατροφικού
                      τομέα και των τεχνολογικών προκλήσεων που αντιμετωπίζουν
                      οι επιχειρήσεις.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#D32F2F]/10 flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-6 h-6 text-[#D32F2F]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-[#333333] mb-2">
                      Αποτελεσματικότητα
                    </h4>
                    <p className="text-[#666666]">
                      Μετρούμε την επιτυχία μας από τα απτά αποτελέσματα που
                      επιτυγχάνουν οι πελάτες μας.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
