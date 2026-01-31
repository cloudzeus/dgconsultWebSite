"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowLeft, CheckCircle2, Globe, Layers, User } from "lucide-react";
import Link from "next/link";
import { caseStudies } from "@/lib/data";
import Header from "@/sections/Header";
import Footer from "@/sections/Footer";
import CTA from "@/sections/CTA";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

interface CaseStudyClientProps {
    study: typeof caseStudies[0];
}

export default function CaseStudyClient({ study }: CaseStudyClientProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const heroRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Hero animation
            gsap.fromTo(
                ".hero-content > *",
                { y: 30, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.2,
                    ease: "power3.out",
                }
            );

            // Scroll animations
            gsap.fromTo(
                ".animate-on-scroll",
                { y: 40, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.2,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: ".animate-on-scroll",
                        start: "top 85%",
                        toggleActions: "play none none none",
                    },
                }
            );

            // Section animations
            const sections = document.querySelectorAll(".content-section");
            sections.forEach((section) => {
                gsap.fromTo(
                    section.querySelectorAll(".animate-item"),
                    { y: 30, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 0.6,
                        stagger: 0.1,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: section,
                            start: "top 80%",
                            toggleActions: "play none none none",
                        },
                    }
                );
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <main ref={containerRef} className="min-h-screen bg-white">
            <Header />

            {/* Hero Section */}
            <section
                ref={heroRef}
                className="relative pt-32 pb-20 md:pt-44 md:pb-32 bg-[#1A1A1A] overflow-hidden"
            >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#D32F2F] via-transparent to-transparent" />
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                </div>

                <div className="max-w-[1280px] mx-auto px-6 relative z-10">
                    <div className="hero-content max-w-4xl">
                        <Link
                            href="/#case-studies"
                            className="inline-flex items-center text-[#D32F2F] font-semibold text-sm mb-8 transition-transform hover:-translate-x-1"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Επιστροφή στα Case Studies
                        </Link>
                        <span className="inline-block px-4 py-1 bg-[#D32F2F] text-white text-xs font-bold rounded-full mb-6 uppercase tracking-widest">
                            {study.category}
                        </span>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-8 leading-tight">
                            {study.title}
                        </h1>
                        <p className="text-xl text-gray-400 leading-relaxed mb-10 max-w-3xl">
                            {study.description}
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-10 border-t border-white/10">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                                    <User className="text-[#D32F2F] w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-gray-500 text-xs uppercase tracking-wider font-bold">Πελάτης</p>
                                    <p className="text-white font-medium">{study.clientName || "N/A"}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                                    <Globe className="text-[#D32F2F] w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-gray-500 text-xs uppercase tracking-wider font-bold">Κλάδος</p>
                                    <p className="text-white font-medium">{study.industry || "N/A"}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                                    <Layers className="text-[#D32F2F] w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-gray-500 text-xs uppercase tracking-wider font-bold">Τεχνολογίες</p>
                                    <p className="text-white font-medium">{study.technologies?.join(", ") || "N/A"}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-24 md:py-32">
                <div className="max-w-[1280px] mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                        {/* Left Column: Story */}
                        <div className="lg:col-span-8 space-y-20">
                            {/* Overview */}
                            <div className="content-section">
                                <h2 className="text-3xl font-bold text-[#333333] mb-6 animate-item">Σύνοψη Έργου</h2>
                                <div className="prose prose-lg text-[#666666] animate-item">
                                    <p>{study.content}</p>
                                </div>
                            </div>

                            {/* Challenge */}
                            <div className="content-section p-8 md:p-12 bg-[#F9F9F9] rounded-3xl border border-gray-100">
                                <h3 className="text-2xl font-bold text-[#333333] mb-6 animate-item">Η Πρόκληση</h3>
                                <p className="text-lg text-[#666666] leading-relaxed animate-item">
                                    {study.challenge}
                                </p>
                            </div>

                            {/* Solution */}
                            <div className="content-section">
                                <h3 className="text-2xl font-bold text-[#333333] mb-6 animate-item">Η Λύση μας</h3>
                                <p className="text-lg text-[#666666] leading-relaxed animate-item">
                                    {study.solution}
                                </p>
                            </div>
                        </div>

                        {/* Right Column: Results & Sidebar */}
                        <div className="lg:col-span-4 space-y-12">
                            {/* Results Card */}
                            <div className="bg-[#1A1A1A] rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#D32F2F] opacity-10 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
                                <h3 className="text-2xl font-bold text-white mb-8 relative z-10">Αποτελέσματα</h3>

                                <div className="space-y-6 relative z-10">
                                    {study.results?.split(',').map((result, idx) => (
                                        <div key={idx} className="flex gap-4 items-start">
                                            <div className="w-6 h-6 rounded-full bg-[#D32F2F]/20 flex items-center justify-center flex-shrink-0 mt-1">
                                                <CheckCircle2 className="w-4 h-4 text-[#D32F2F]" />
                                            </div>
                                            <p className="text-gray-300 font-medium leading-snug">
                                                {result.trim()}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Related Case Studies */}
                            <div className="space-y-6">
                                <h4 className="text-xl font-bold text-[#333333]">Άλλα Έργα</h4>
                                <div className="space-y-4">
                                    {caseStudies
                                        .filter((s) => s.id !== study.id)
                                        .slice(0, 2)
                                        .map((other) => (
                                            <Link
                                                key={other.id}
                                                href={`/case-studies/${other.slug}`}
                                                className="group flex gap-4 p-4 rounded-2xl bg-white border border-gray-100 hover:border-[#D32F2F]/20 hover:shadow-lg transition-all"
                                            >
                                                <div className="w-20 h-20 rounded-xl bg-gray-100 flex-shrink-0 overflow-hidden relative">
                                                    <div className="absolute inset-0 bg-gradient-to-br from-[#D32F2F]/10 to-transparent" />
                                                    <div className="flex h-full items-center justify-center text-xs font-bold text-[#D32F2F]">
                                                        IMG
                                                    </div>
                                                </div>
                                                <div className="flex flex-col justify-center">
                                                    <span className="text-[10px] font-bold text-[#D32F2F] uppercase tracking-widest mb-1">
                                                        {other.category}
                                                    </span>
                                                    <h5 className="text-sm font-bold text-[#333333] group-hover:text-[#D32F2F] transition-colors line-clamp-2">
                                                        {other.title}
                                                    </h5>
                                                </div>
                                            </Link>
                                        ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <CTA />
            <Footer />
        </main>
    );
}
