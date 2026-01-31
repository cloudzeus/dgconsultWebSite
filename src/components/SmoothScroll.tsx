"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export default function SmoothScroll() {
    useEffect(() => {
        // Initialize smooth scroll behavior
        document.documentElement.style.scrollBehavior = "smooth";

        // Refresh ScrollTrigger on load
        ScrollTrigger.refresh();

        // Cleanup
        return () => {
            ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
        };
    }, []);

    return null;
}
