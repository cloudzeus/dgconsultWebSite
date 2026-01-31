"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface SeoGeneratorProps {
    title: string;
    description: string;
    content?: string;
    type: string;
    onGenerate: (metaTitle: string, metaDescription: string) => void;
}

export function SeoGenerator({ title, description, content, type, onGenerate }: SeoGeneratorProps) {
    const [loading, setLoading] = useState(false);

    const handleGenerate = async () => {
        console.log("Generating SEO with:", { title, description, type });
        if (!title && !description) {
            toast.error("Please provide Title or Description context first.");
            return;
        }
        setLoading(true);
        try {
            const res = await fetch("/api/generate-seo/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, description, content, type }),
            });

            console.log("API Status:", res.status);

            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.error || "Failed to generate");
            }

            const data = await res.json();
            console.log("API Response:", data);

            if (data.error) throw new Error(data.error);

            onGenerate(data.metaTitle, data.metaDescription);
            toast.success("SEO Meta Tags generated!");
        } catch (error: any) {
            toast.error(error.message || "Error generating SEO tags. Check API Key.");
            console.error("SEO Gen Error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button type="button" onClick={handleGenerate} variant="outline" size="sm" className="gap-2 text-indigo-600 border-indigo-200 bg-indigo-50 hover:bg-indigo-100">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            Generate with AI
        </Button>
    );
}
