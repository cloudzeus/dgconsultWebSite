"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { DialogTrigger } from "@/components/ui/dialog";
import ContactModal from "@/components/ContactModal";
import { navItems } from "@/lib/data";

import { GlobalSettings } from "@prisma/client";

interface HeaderProps {
  settings?: GlobalSettings | null;
}

export default function Header({ settings }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
        ? "bg-white/95 backdrop-blur-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)]"
        : "bg-transparent"
        }`}
      style={{
        height: isScrolled ? "64px" : "80px",
      }}
    >
      <div className="max-w-[1280px] mx-auto px-6 h-full flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="relative h-10 w-auto">
            <Image
              src="/logo.webp"
              alt="DGCONSULT"
              width={200}
              height={40}
              className="h-10 w-auto object-contain"
              priority
            />
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="relative text-[#333333] font-medium text-sm hover:text-[#D32F2F] transition-colors duration-250 group"
            >
              {item.label}
              <span className="absolute -bottom-1 left-1/2 w-0 h-0.5 bg-[#D32F2F] transition-all duration-250 group-hover:w-full group-hover:left-0" />
            </Link>
          ))}
        </nav>

        {/* CTA Button */}
        <div className="hidden lg:block">
          <ContactModal
            settings={settings}
            trigger={
              <DialogTrigger asChild>
                <Button className="bg-[#D32F2F] hover:bg-[#B71C1C] text-white font-semibold px-6 py-2.5 rounded-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(211,47,47,0.3)]">
                  Ζητήστε Συμβουλευτική
                </Button>
              </DialogTrigger>
            }
          />
        </div>

        {/* Mobile Menu */}
        {mounted && (
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" className="text-[#333333]">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] bg-white p-0 border-l border-gray-100">
              <div className="flex flex-col h-full">
                <SheetHeader className="p-8 border-b border-gray-50 text-left bg-gray-50/50">
                  <div className="relative h-8 w-auto mb-4">
                    <Image
                      src="/logo.webp"
                      alt="DGCONSULT"
                      width={160}
                      height={32}
                      className="h-8 w-auto object-contain"
                    />
                  </div>
                  <SheetTitle className="text-lg font-bold text-[#1A1A1A]">Menu</SheetTitle>
                  <SheetDescription className="text-xs text-gray-500 font-medium">
                    Business Solutions on Demand
                  </SheetDescription>
                </SheetHeader>

                <div className="flex flex-col h-full py-6">
                  <nav className="flex flex-col space-y-1 px-3">
                    {navItems.map((item, index) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className="group flex items-center justify-between px-5 py-4 rounded-2xl text-[#333333] font-semibold text-[17px] hover:bg-gray-50 hover:text-[#D32F2F] transition-all duration-300"
                        style={{
                          animationDelay: `${index * 50}ms`,
                        }}
                      >
                        <span>{item.label}</span>
                        <span className="opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#D32F2F]">
                            <polyline points="9 18 15 12 9 6"></polyline>
                          </svg>
                        </span>
                      </Link>
                    ))}
                  </nav>

                  <div className="mt-auto p-8 space-y-8">
                    <div className="pt-8 border-t border-gray-100">
                      <ContactModal
                        settings={settings}
                        trigger={
                          <DialogTrigger asChild>
                            <Button
                              onClick={() => setIsOpen(false)}
                              className="w-full bg-[#D32F2F] hover:bg-[#B71C1C] text-white font-bold py-7 rounded-2xl shadow-xl shadow-[#D32F2F]/10 transition-all hover:scale-[1.02] active:scale-[0.98]"
                            >
                              Ζητήστε Συμβουλευτική
                            </Button>
                          </DialogTrigger>
                        }
                      />
                    </div>
                    <div className="space-y-2 text-center">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Επικοινωνία</p>
                      <p className="text-sm font-semibold text-gray-700">{settings?.email || "info@dgconsult.gr"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        )}
      </div>
    </header>
  );
}
