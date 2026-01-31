"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import Lenis from "lenis";
import Header from "@/sections/Header";
import Footer from "@/sections/Footer";
import {
    ChevronLeft,
    ArrowRight,
    Target,
    Zap,
    TrendingUp,
    CheckCircle2,
    AlertCircle
} from "lucide-react";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

interface SectorClientProps {
    sector: any;
    settings: any;
}

export default function SectorClient({ sector, settings }: SectorClientProps) {
    const [mounted, setMounted] = useState(false);
    const mainRef = useRef<HTMLElement>(null);
    const heroRef = useRef<HTMLElement>(null);
    const contentRef = useRef<HTMLElement>(null);
    const deepDive = sector.deepDive || null;

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        // Initialize Lenis
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            touchMultiplier: 1.5,
        });

        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        // Update ScrollTrigger on Lenis scroll
        lenis.on('scroll', ScrollTrigger.update);

        const ctx = gsap.context(() => {
            // 1. Individual Card Reveal (Rock Solid approach)
            const cards = gsap.utils.toArray(".benefit-card");
            cards.forEach((card: any, i: number) => {
                gsap.fromTo(card,
                    {
                        opacity: 0,
                        y: 100,
                        scale: 0.9
                    },
                    {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        duration: 1.2,
                        ease: "expo.out",
                        scrollTrigger: {
                            trigger: card,
                            start: "top 92%", // Trigger when individual card hits bottom
                            toggleActions: "play none none none",
                        },
                        delay: i % 2 * 0.15 // Small stagger for side-by-side cards
                    }
                );
            });

            // 2. Section Reveals
            gsap.utils.toArray(".reveal-section").forEach((section: any) => {
                gsap.fromTo(section,
                    { opacity: 0, y: 60 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 1.5,
                        ease: "power4.out",
                        scrollTrigger: {
                            trigger: section,
                            start: "top 90%",
                            toggleActions: "play none none none"
                        }
                    }
                );
            });

            // 3. Text Line Reveals
            gsap.utils.toArray(".reveal-text").forEach((text: any) => {
                gsap.fromTo(text,
                    { opacity: 0, x: -30 },
                    {
                        opacity: 1,
                        x: 0,
                        duration: 1,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: text,
                            start: "top 95%",
                        }
                    }
                );
            });

            // 4. Hero Content (Immediate)
            gsap.fromTo(".hero-content > *",
                { opacity: 0, y: 50 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1.2,
                    stagger: 0.1,
                    ease: "power4.out",
                    delay: 0.3
                }
            );

            // 5. Parallax Image
            gsap.to(".hero-image-inner", {
                yPercent: 20,
                ease: "none",
                scrollTrigger: {
                    trigger: ".hero-image",
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true
                }
            });

            // 6. Summary Highlight
            gsap.to(".summary-text", {
                color: "#111827",
                scale: 1.02,
                scrollTrigger: {
                    trigger: ".summary-text",
                    start: "top 80%",
                    end: "bottom 30%",
                    scrub: true
                }
            });

            // 7. Velocity Skew (Fixed)
            let proxy = { skew: 0 },
                skewSetter = gsap.quickSetter(".benefit-card", "skewY", "deg"),
                clamp = gsap.utils.clamp(-5, 5);

            ScrollTrigger.create({
                onUpdate: (self) => {
                    let skew = clamp(self.getVelocity() / -500);
                    if (Math.abs(skew) > Math.abs(proxy.skew)) {
                        proxy.skew = skew;
                        gsap.to(proxy, {
                            skew: 0,
                            duration: 0.8,
                            ease: "power3",
                            overwrite: true,
                            onUpdate: () => skewSetter(proxy.skew)
                        });
                    }
                }
            });

            // 8. Background Parallax
            gsap.utils.toArray(".parallax-bg").forEach((bg: any, i: number) => {
                gsap.to(bg, {
                    y: i % 2 === 0 ? 150 : -150,
                    rotation: 15,
                    scrollTrigger: {
                        trigger: mainRef.current,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: 1.5
                    }
                });
            });

            // CTA Glow
            gsap.to(".cta-btn", {
                boxShadow: "0 0 40px rgba(211,47,47,0.4)",
                repeat: -1,
                yoyo: true,
                duration: 2,
                ease: "sine.inOut"
            });

            // Crucial: Refresh after all initializations
            ScrollTrigger.refresh();
        }, mainRef);

        return () => {
            ctx.revert();
            lenis.destroy();
        };
    }, [mounted]);

    if (!mounted) return <div className="min-h-screen bg-white" />;

    return (
        <main ref={mainRef} className="min-h-screen bg-white relative selection:bg-[#D32F2F] selection:text-white">
            {/* Scroll Progress Indicator */}
            <div className="scroll-progress fixed top-0 left-0 w-full h-1 bg-[#D32F2F] z-[100] origin-left scale-x-0" />

            {/* Noise Texture Overlay */}
            <div className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.04] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

            <Header settings={settings} />

            {/* Back Button */}
            <div className="absolute top-28 left-4 md:left-10 z-10">
                <Link
                    href="/#sectors"
                    className="group flex items-center gap-2 text-xs md:text-sm font-semibold text-gray-400 hover:text-[#D32F2F] transition-all"
                >
                    <div className="p-2 rounded-full bg-gray-50 group-hover:bg-[#D32F2F]/10 transition-colors">
                        <ChevronLeft className="w-4 h-4" />
                    </div>
                    Πίσω στους Τομείς
                </Link>
            </div>

            {/* Hero Section */}
            <section ref={heroRef} className="pt-32 pb-12 md:pt-48 md:pb-24 bg-[#0a0a0a] text-white overflow-hidden relative">
                {/* Hero Glows */}
                <div className="absolute top-0 left-1/4 w-[800px] h-[600px] bg-[#D32F2F]/15 rounded-full blur-[150px] -mt-[300px]" />
                <div className="absolute bottom-0 right-1/4 w-[600px] h-[400px] bg-blue-500/5 rounded-full blur-[120px] -mb-[200px]" />

                <div className="container mx-auto px-4 md:px-8 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="hero-content space-y-8">
                            <div className="inline-flex items-center gap-3 px-3 py-1 rounded-sm border border-white/10 bg-white/5 text-white/40 text-[9px] md:text-[10px] font-black tracking-[0.4em] uppercase backdrop-blur-md">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#D32F2F] animate-pulse" />
                                Στρατηγικός Τομέας
                            </div>
                            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-[0.9] tracking-tighter">
                                {sector.title}
                            </h1>
                            <p className="text-lg md:text-xl text-white/40 max-w-lg leading-relaxed font-light">
                                {sector.description}
                            </p>
                        </div>

                        {sector.featuredImage && (
                            <div className="hero-image relative aspect-[14/10] rounded-[2.5rem] overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)] border border-white/5">
                                <div className="hero-image-inner absolute -top-20 left-0 w-full h-[130%]">
                                    <Image
                                        src={sector.featuredImage}
                                        alt={sector.title}
                                        layout="fill"
                                        objectFit="cover"
                                        priority
                                    />
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Content Body */}
            <section ref={contentRef} className="py-40 relative overflow-hidden bg-white">
                {/* Parallax Decorative Elements */}
                <div className="parallax-bg absolute top-20 right-0 w-[600px] h-[600px] bg-red-50 rounded-full -mr-64 blur-[130px] opacity-50 pointer-events-none" />
                <div className="parallax-bg absolute top-1/2 left-0 w-[700px] h-[700px] bg-gray-50 rounded-full -ml-80 blur-[160px] opacity-70 pointer-events-none" />

                <div className="container mx-auto px-4 md:px-8">
                    {deepDive ? (
                        <div className="space-y-52 max-w-7xl mx-auto">
                            {/* Executive Summary - 2026 Minimalist Focus */}
                            <div className="reveal-section relative w-full">
                                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
                                <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

                                <div className="py-24 flex flex-col items-center">
                                    <div className="flex items-center gap-10 mb-16 opacity-30">
                                        <div className="w-12 h-px bg-black" />
                                        <span className="text-[9px] font-black text-black tracking-[0.6em] uppercase">ΚΕΝΤΡΙΚΟΣ ΑΞΟΝΑΣ</span>
                                        <div className="w-12 h-px bg-black" />
                                    </div>

                                    <div className="w-full">
                                        <p className="summary-text text-lg md:text-xl lg:text-2xl font-light text-gray-500 leading-[1.8] text-center max-w-5xl mx-auto tracking-tight transition-all duration-1000">
                                            {deepDive.executiveSummary}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Challenges & Solutions - Tech Grid */}
                            <div className="grid lg:grid-cols-12 gap-16 lg:gap-24 items-start">
                                <div className="lg:col-span-5 reveal-section space-y-16">
                                    <div className="flex flex-col gap-6">
                                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-3xl bg-[#0a0a0a] text-white shadow-2xl">
                                            <AlertCircle className="w-7 h-7" />
                                        </div>
                                        <h3 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 tracking-tighter leading-[0.95]">Προκλήσεις <br /> Αγοράς</h3>
                                    </div>
                                    <div className="space-y-12 pl-6 border-l-2 border-gray-100">
                                        {deepDive.challenges?.map((item: any, idx: number) => (
                                            <div key={idx} className="reveal-text group">
                                                <div className="flex items-center gap-4 mb-4">
                                                    <span className="text-[#D32F2F] text-[10px] font-black tracking-widest px-2 py-0.5 border border-[#D32F2F]/20 rounded-sm italic">CH-{idx + 1}</span>
                                                    <div className="h-px flex-grow bg-gray-50 group-hover:bg-[#D32F2F]/20 transition-all duration-500" />
                                                </div>
                                                <h4 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h4>
                                                <p className="text-base text-gray-500 leading-relaxed font-normal">{item.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="lg:col-span-7 reveal-section">
                                    <div className="bg-[#0a0a0a] rounded-[3.5rem] p-10 md:p-16 lg:p-20 space-y-16 relative overflow-hidden shadow-2xl">
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#D32F2F] rounded-full blur-[120px] opacity-10 -mr-32 -mt-32" />

                                        <div className="flex flex-col gap-6 relative z-10">
                                            <div className="flex items-center gap-3 text-[#D32F2F]">
                                                <Target className="w-5 h-5" />
                                                <span className="text-[10px] font-black tracking-[0.4em] uppercase">Στρατηγική Αρχιτεκτονική</span>
                                            </div>
                                            <h3 className="text-3xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter leading-[0.95]">Ολοκληρωμένο <br /> Πλαίσιο</h3>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-10 relative z-10">
                                            {deepDive.solutions?.map((item: any, idx: number) => (
                                                <div key={idx} className="flex flex-col gap-4 group">
                                                    <div className="w-8 h-1 bg-[#D32F2F] opacity-30 group-hover:w-16 transition-all duration-500" />
                                                    <h4 className="text-lg font-bold text-white/90">{item.title}</h4>
                                                    <p className="text-sm text-gray-400 leading-relaxed font-light">{item.description}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Benefits Grid - Large Bento Cards */}
                            <div className="benefits-grid space-y-24 bg-[#0a0a0a] rounded-[4.5rem] p-12 md:p-24 lg:p-32 text-white relative overflow-hidden">
                                <div className="absolute bottom-0 left-0 w-[900px] h-[600px] bg-[#D32F2F] rounded-full filter blur-[200px] opacity-[0.06] -ml-64 -mb-96" />

                                <div className="relative z-10 space-y-8 max-w-4xl text-center md:text-left mx-auto md:mx-0">
                                    <span className="text-[#D32F2F] text-[11px] font-black tracking-[0.5em] uppercase">Παραγωγή Αξίας</span>
                                    <h2 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.85] text-white">Στρατηγικός <br /> Αντίκτυπος</h2>
                                </div>

                                <div className="grid md:grid-cols-2 gap-10 relative z-10">
                                    {deepDive.benefits?.map((benefit: any, idx: number) => (
                                        <div key={idx} className="benefit-card group bg-white/[0.02] backdrop-blur-3xl p-12 md:p-16 rounded-[3rem] border border-white/5 hover:bg-white/[0.04] hover:border-white/10 transition-all duration-700">
                                            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-12 border border-white/10 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                                                <CheckCircle2 className="w-8 h-8 text-[#D32F2F]" />
                                            </div>
                                            <h3 className="text-2xl md:text-4xl font-black mb-8 tracking-tighter text-white">{benefit.title}</h3>
                                            <div className="flex items-center gap-4 mb-8">
                                                <div className="w-12 h-px bg-[#D32F2F]" />
                                                <span className="text-[10px] text-white/20 font-black tracking-[0.2em] uppercase">{idx + 1} / {deepDive.benefits.length}</span>
                                            </div>
                                            <p className="text-gray-400 leading-relaxed text-base md:text-lg font-light">{benefit.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Future Outlook - Cinematic Vision */}
                            <div className="reveal-section max-w-5xl mx-auto py-32 px-8">
                                <div className="flex flex-col items-center gap-16">
                                    <div className="flex items-center gap-8 w-full max-w-xl">
                                        <div className="h-px flex-grow bg-gradient-to-r from-transparent to-gray-200" />
                                        <Zap className="w-6 h-6 text-[#D32F2F] animate-pulse" />
                                        <div className="h-px flex-grow bg-gradient-to-l from-transparent to-gray-200" />
                                    </div>
                                    <h2 className="text-base md:text-lg lg:text-xl font-extralight text-gray-800 italic leading-[1.6] text-center tracking-tight">
                                        “{deepDive.futureOutlook}”
                                    </h2>
                                    <div className="text-[10px] font-black tracking-[0.4em] uppercase text-gray-300">Perspective / 2026</div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="max-w-4xl mx-auto prose prose-xl prose-red text-gray-600 font-light">
                            <div dangerouslySetInnerHTML={{ __html: sector.content || sector.description }} />
                        </div>
                    )}
                </div>
            </section>

            {/* Call to Action - Cinematic Scale */}
            <section className="py-20 md:py-40 bg-white">
                <div className="container mx-auto px-4 md:px-8">
                    <div className="reveal-section bg-[#0a0a0a] rounded-[5rem] p-16 md:p-32 text-white text-center relative overflow-hidden shadow-[0_60px_120px_-20px_rgba(0,0,0,0.4)]">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#D32F2F]/20 via-transparent to-transparent opacity-40" />

                        <div className="relative z-10 space-y-12">
                            <h2 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tighter leading-[0.95]">
                                Κλιμακώστε <br /> το όραμά σας.
                            </h2>
                            <p className="text-base md:text-lg text-white/40 max-w-2xl mx-auto font-light leading-relaxed">
                                Γίνετε μέλος των ηγετών της νέας οικονομίας. Ας σχεδιάσουμε μαζί την στρατηγική σας ψηφιακή κληρονομιά σήμερα.
                            </p>
                            <div className="pt-8">
                                <Link
                                    href="/#contact"
                                    className="cta-btn inline-flex items-center gap-6 bg-white text-black px-14 py-7 rounded-full font-black text-sm md:text-lg hover:bg-gray-100 transition-all transform hover:scale-[1.05] active:scale-95 tracking-[0.2em] uppercase"
                                >
                                    Ξεκινήστε τον Μετασχηματισμό
                                    <ArrowRight className="w-6 h-6 text-[#D32F2F]" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer settings={settings} />
        </main>
    );
}
