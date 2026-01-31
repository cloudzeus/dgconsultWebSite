"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import { Linkedin, Twitter, Facebook } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { navItems, services } from "@/lib/data";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const quickLinks = navItems;
const serviceLinks = services.slice(0, 5);

import { GlobalSettings } from "@prisma/client";

interface FooterProps {
  settings?: GlobalSettings | null;
}

export default function Footer({ settings }: FooterProps) {
  const footerRef = useRef<HTMLElement>(null);

  const socialLinks = [
    { icon: Linkedin, href: settings?.linkedin || "#", label: "LinkedIn" },
    { icon: Twitter, href: settings?.twitter || "#", label: "Twitter" },
    { icon: Facebook, href: settings?.facebook || "#", label: "Facebook" },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Footer content animation
      gsap.fromTo(
        footerRef.current?.querySelectorAll("[data-animate]") || [],
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.05,
          ease: "power3.out",
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 90%",
            toggleActions: "play none none none",
          },
        }
      );
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer ref={footerRef} className="bg-[#1A1A1A] text-white pt-20 pb-8">
      <div className="max-w-[1280px] mx-auto px-6">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Column 1: Logo & Description */}
          <div data-animate>
            <div className="mb-6">
              <Image
                src="/logo.webp"
                alt="DGCONSULT"
                width={180}
                height={36}
                className="h-9 w-auto brightness-0 invert"
              />
            </div>
            <p className="text-gray-400 leading-relaxed">
              Εξειδικευμένες λύσεις ψηφιακού μετασχηματισμού και ανάλυσης
              δεδομένων για τον αγροδιατροφικό τομέα.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div data-animate>
            <h4 className="text-lg font-bold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white hover:translate-x-1 inline-block transition-all duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Services */}
          <div data-animate>
            <h4 className="text-lg font-bold mb-6">Υπηρεσίες</h4>
            <ul className="space-y-3">
              {serviceLinks.map((service) => (
                <li key={service.id}>
                  <Link
                    href={`/#${service.slug}`}
                    className="text-gray-400 hover:text-white hover:translate-x-1 inline-block transition-all duration-200"
                  >
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div data-animate>
            <h4 className="text-lg font-bold mb-6">Επικοινωνία</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-[#D32F2F] mt-0.5 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="text-gray-400">
                  {settings?.address || "Λεωφ. Κηφισού 48, Περιστέρι – 121 33"}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <svg
                  className="w-5 h-5 text-[#D32F2F] flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <a
                  href={`tel:${settings?.phone || "2105711581"}`}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {settings?.phone || "210 5711581"}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <svg
                  className="w-5 h-5 text-[#D32F2F] flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <a
                  href={`mailto:${settings?.email || "info@dgconsult.gr"}`}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {settings?.email || "info@dgconsult.gr"}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="bg-white/10 mb-8" />

        {/* Bottom Bar */}
        <div
          data-animate
          className="flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} DGConsult. All rights reserved.
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-3">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-gray-400 hover:bg-[#D32F2F] hover:border-[#D32F2F] hover:text-white hover:scale-110 transition-all duration-200"
              >
                <social.icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
