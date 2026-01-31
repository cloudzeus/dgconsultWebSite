"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MapPin, Phone, Mail, Clock, Send, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { contactInfo } from "@/lib/data";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

import { GlobalSettings } from "@prisma/client";

interface ContactProps {
  settings?: GlobalSettings | null;
}

export default function Contact({ settings }: ContactProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const contactDetails = [
    {
      icon: MapPin,
      label: "Διεύθυνση",
      value: settings?.address || contactInfo.address,
      href: null,
    },
    {
      icon: Phone,
      label: "Τηλέφωνο",
      value: settings?.phone || contactInfo.phone,
      href: `tel:${(settings?.phone || contactInfo.phone).replace(/\s/g, "")}`,
    },
    {
      icon: Mail,
      label: "Email",
      value: settings?.email || contactInfo.email,
      href: `mailto:${settings?.email || contactInfo.email}`,
    },
    {
      icon: Clock,
      label: "Ώρες Λειτουργίας",
      value: contactInfo.hours, // Hours still constant or need adding to DB? User asked for mail, phone, address, social media.
      href: null,
    },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Info items animation
      gsap.fromTo(
        infoRef.current?.querySelectorAll(".info-item") || [],
        { x: -30, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.4,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: infoRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      // Form animation
      gsap.fromTo(
        formRef.current,
        { rotateY: -15, opacity: 0 },
        {
          rotateY: 0,
          opacity: 1,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: {
            trigger: formRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      // Form fields stagger
      gsap.fromTo(
        formRef.current?.querySelectorAll(".form-field") || [],
        { y: 15, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.3,
          stagger: 0.05,
          ease: "power3.out",
          scrollTrigger: {
            trigger: formRef.current,
            start: "top 75%",
            toggleActions: "play none none none",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      company: formData.get("company") as string,
      phone: formData.get("phone") as string,
      email: formData.get("email") as string,
      message: formData.get("message") as string,
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to submit form");
      }

      setIsSubmitting(false);
      setIsSubmitted(true);

      // Reset form
      e.currentTarget.reset();

      // Reset success state after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
    } catch (error) {
      console.error("Form submission error:", error);
      setIsSubmitting(false);
      alert("Παρουσιάστηκε σφάλμα. Παρακαλώ δοκιμάστε ξανά.");
    }
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="py-24 md:py-32 bg-white relative"
    >
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
          {/* Contact Info */}
          <div ref={infoRef} className="lg:col-span-2">
            <span className="inline-block text-sm font-semibold text-[#D32F2F] uppercase tracking-wider mb-4">
              Επικοινωνήστε μαζί μας
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#333333] mb-4">
              Ξεκινήστε τη Συνεργασία
            </h2>
            <p className="text-[#666666] leading-relaxed mb-10">
              Συμπληρώστε τη φόρμα και η ομάδα μας θα επικοινωνήσει μαζί σας
              εντός 24 ωρών.
            </p>

            {/* Contact Details */}
            <div className="space-y-6">
              {contactDetails.map((item) => (
                <div key={item.label} className="info-item flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#D32F2F]/10 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 text-[#D32F2F]" />
                  </div>
                  <div>
                    <p className="text-sm text-[#666666] mb-1">{item.label}</p>
                    {item.href ? (
                      <a
                        href={item.href}
                        className="text-[#333333] font-medium hover:text-[#D32F2F] transition-colors"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-[#333333] font-medium">{item.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div
            className="lg:col-span-3"
            style={{ perspective: "1000px" }}
          >
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="bg-white rounded-2xl p-8 md:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.1)] border border-[#E0E0E0]"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First Name */}
                <div className="form-field space-y-2">
                  <Label htmlFor="firstName" className="text-[#333333] font-medium">
                    Όνομα <span className="text-[#D32F2F]">*</span>
                  </Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    required
                    placeholder="Το όνομά σας"
                    className="border-[#E0E0E0] focus:border-[#D32F2F] focus:ring-[#D32F2F]/20 rounded-lg h-12"
                  />
                </div>

                {/* Last Name */}
                <div className="form-field space-y-2">
                  <Label htmlFor="lastName" className="text-[#333333] font-medium">
                    Επώνυμο <span className="text-[#D32F2F]">*</span>
                  </Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    required
                    placeholder="Το επώνυμό σας"
                    className="border-[#E0E0E0] focus:border-[#D32F2F] focus:ring-[#D32F2F]/20 rounded-lg h-12"
                  />
                </div>

                {/* Company */}
                <div className="form-field space-y-2">
                  <Label htmlFor="company" className="text-[#333333] font-medium">
                    Εταιρεία
                  </Label>
                  <Input
                    id="company"
                    name="company"
                    placeholder="Η εταιρεία σας"
                    className="border-[#E0E0E0] focus:border-[#D32F2F] focus:ring-[#D32F2F]/20 rounded-lg h-12"
                  />
                </div>

                {/* Phone */}
                <div className="form-field space-y-2">
                  <Label htmlFor="phone" className="text-[#333333] font-medium">
                    Τηλέφωνο
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="Το τηλέφωνό σας"
                    className="border-[#E0E0E0] focus:border-[#D32F2F] focus:ring-[#D32F2F]/20 rounded-lg h-12"
                  />
                </div>

                {/* Email */}
                <div className="form-field space-y-2 md:col-span-2">
                  <Label htmlFor="email" className="text-[#333333] font-medium">
                    Email <span className="text-[#D32F2F]">*</span>
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="Το email σας"
                    className="border-[#E0E0E0] focus:border-[#D32F2F] focus:ring-[#D32F2F]/20 rounded-lg h-12"
                  />
                </div>

                {/* Message */}
                <div className="form-field space-y-2 md:col-span-2">
                  <Label htmlFor="message" className="text-[#333333] font-medium">
                    Μήνυμα
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Περιγράψτε τις ανάγκες σας..."
                    rows={5}
                    className="border-[#E0E0E0] focus:border-[#D32F2F] focus:ring-[#D32F2F]/20 rounded-lg resize-none"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-8">
                <Button
                  type="submit"
                  disabled={isSubmitting || isSubmitted}
                  className={`w-full h-14 text-base font-semibold rounded-lg transition-all duration-300 ${isSubmitted
                    ? "bg-green-500 hover:bg-green-500"
                    : "bg-[#D32F2F] hover:bg-[#B71C1C]"
                    } text-white hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(211,47,47,0.3)]`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin h-5 w-5 mr-2"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Αποστολή...
                    </span>
                  ) : isSubmitted ? (
                    <span className="flex items-center justify-center">
                      <Check className="h-5 w-5 mr-2" />
                      Απεστάλη με επιτυχία!
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      <Send className="h-5 w-5 mr-2" />
                      Υποβολή
                    </span>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
