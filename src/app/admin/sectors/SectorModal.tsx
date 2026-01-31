"use client";

import { useState } from "react";
import { Sector } from "@prisma/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { createSector, updateSector } from "./actions";
import { toast } from "sonner";
import { Loader2, X, Upload, Sparkles } from "lucide-react";
import Image from "next/image";
import { SeoGenerator } from "@/components/admin/SeoGenerator";

interface SectorModalProps {
    isOpen: boolean;
    onClose: () => void;
    sector: Sector | null;
    onSuccess: () => void;
}

export function SectorModal({ isOpen, onClose, sector, onSuccess }: SectorModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [featuredImage, setFeaturedImage] = useState<string | null>(sector?.featuredImage || null);

    const [sourceData, setSourceData] = useState({
        title: sector?.title || "",
        description: sector?.description || "",
        content: sector?.content || ""
    });
    const [seoData, setSeoData] = useState({
        metaTitle: (sector as any)?.metaTitle || "",
        metaDescription: (sector as any)?.metaDescription || ""
    });
    const [deepDive, setDeepDive] = useState<any>((sector as any)?.deepDive || null);
    const [isGeneratingDeepDive, setIsGeneratingDeepDive] = useState(false);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append("file", files[0]);
            formData.append("folder", "sectors");

            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) throw new Error("Upload failed");
            const data = await res.json();
            setFeaturedImage(data.url);
            toast.success("Image uploaded successfully");
        } catch (error) {
            toast.error("Failed to upload image");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeepDiveGenerate = async () => {
        if (!sourceData.title || !sourceData.description) {
            toast.error("Please provide Title and Description context first.");
            return;
        }
        setIsGeneratingDeepDive(true);
        try {
            const res = await fetch("/api/generate-sector-content/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: sourceData.title,
                    description: sourceData.description
                }),
            });

            if (!res.ok) throw new Error("Generation failed");
            const data = await res.json();
            setDeepDive(data);
            toast.success("Professional content generated!");
        } catch (error) {
            toast.error("Failed to generate professional content");
            console.error(error);
        } finally {
            setIsGeneratingDeepDive(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);
        if (featuredImage) formData.append("featuredImage", featuredImage);
        if (deepDive) formData.append("deepDive", JSON.stringify(deepDive));

        try {
            const res = sector
                ? await updateSector(sector.id, null, formData)
                : await createSector(null, formData);

            if (res.success) {
                toast.success(sector ? "Updated successfully" : "Created successfully");
                onSuccess();
                onClose();
            } else {
                toast.error(res.error);
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent size="large">
                <DialogHeader>
                    <DialogTitle>{sector ? "Edit Sector" : "New Sector"}</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                name="title"
                                required
                                defaultValue={sector?.title}
                                onChange={(e) => setSourceData(prev => ({ ...prev, title: e.target.value }))}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="slug">Slug</Label>
                            <Input id="slug" name="slug" required defaultValue={sector?.slug} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Short Description (for Cards)</Label>
                        <Textarea
                            id="description"
                            name="description"
                            required
                            defaultValue={sector?.description}
                            onChange={(e) => setSourceData(prev => ({ ...prev, description: e.target.value }))}
                        />
                    </div>

                    <div className="space-y-4 border rounded-md p-4 bg-indigo-50/30 border-indigo-100">
                        <div className="flex justify-between items-center">
                            <div className="space-y-0.5">
                                <h3 className="font-semibold text-sm text-indigo-900">Deep-Dive Content</h3>
                                <p className="text-xs text-indigo-700">Detailed professional strategy content.</p>
                            </div>
                            <Button
                                type="button"
                                onClick={handleDeepDiveGenerate}
                                disabled={isGeneratingDeepDive}
                                variant="outline"
                                className="bg-white border-indigo-200 text-indigo-600 hover:bg-indigo-50 gap-2"
                            >
                                {isGeneratingDeepDive ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                                Generate Professional Structure
                            </Button>
                        </div>

                        {deepDive && (
                            <div className="space-y-6 mt-4 p-4 bg-white rounded-lg border border-indigo-100 shadow-sm">
                                <div className="space-y-2">
                                    <Label className="text-[#4338ca] font-bold">Executive Summary</Label>
                                    <Textarea
                                        value={deepDive.executiveSummary || ""}
                                        onChange={(e) => setDeepDive({ ...deepDive, executiveSummary: e.target.value })}
                                        className="bg-indigo-50/20 border-indigo-100 min-h-[80px] w-full"
                                    />
                                </div>

                                <div className="grid md:grid-cols-2 gap-6 w-full">
                                    <div className="space-y-4">
                                        <Label className="text-[#4338ca] font-bold">Challenges</Label>
                                        {deepDive.challenges?.map((c: any, i: number) => (
                                            <div key={i} className="space-y-1">
                                                <Input
                                                    value={c.title}
                                                    placeholder="Challenge Title"
                                                    onChange={(e) => {
                                                        const newChallenges = [...deepDive.challenges];
                                                        newChallenges[i].title = e.target.value;
                                                        setDeepDive({ ...deepDive, challenges: newChallenges });
                                                    }}
                                                    className="font-semibold"
                                                />
                                                <Textarea
                                                    value={c.description}
                                                    placeholder="Description"
                                                    onChange={(e) => {
                                                        const newChallenges = [...deepDive.challenges];
                                                        newChallenges[i].description = e.target.value;
                                                        setDeepDive({ ...deepDive, challenges: newChallenges });
                                                    }}
                                                    className="text-xs min-h-[60px]"
                                                />
                                            </div>
                                        ))}
                                    </div>

                                    <div className="space-y-4">
                                        <Label className="text-[#4338ca] font-bold">Solutions</Label>
                                        {deepDive.solutions?.map((s: any, i: number) => (
                                            <div key={i} className="space-y-1">
                                                <Input
                                                    value={s.title}
                                                    placeholder="Solution Title"
                                                    onChange={(e) => {
                                                        const newSolutions = [...deepDive.solutions];
                                                        newSolutions[i].title = e.target.value;
                                                        setDeepDive({ ...deepDive, solutions: newSolutions });
                                                    }}
                                                    className="font-semibold"
                                                />
                                                <Textarea
                                                    value={s.description}
                                                    placeholder="Description"
                                                    onChange={(e) => {
                                                        const newSolutions = [...deepDive.solutions];
                                                        newSolutions[i].description = e.target.value;
                                                        setDeepDive({ ...deepDive, solutions: newSolutions });
                                                    }}
                                                    className="text-xs min-h-[60px]"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-[#4338ca] font-bold">Future Outlook</Label>
                                    <Textarea
                                        value={deepDive.futureOutlook || ""}
                                        onChange={(e) => setDeepDive({ ...deepDive, futureOutlook: e.target.value })}
                                        className="bg-indigo-50/20 border-indigo-100 italic"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="content">Custom Footer / Extra Content (Markdown)</Label>
                        <Textarea
                            id="content"
                            name="content"
                            className="min-h-[100px]"
                            defaultValue={sector?.content || ""}
                            placeholder="# Markdown or HTML content here..."
                            onChange={(e) => setSourceData(prev => ({ ...prev, content: e.target.value }))}
                        />
                    </div>

                    <div className="space-y-4 border rounded-md p-4 bg-gray-50/50">
                        <div className="flex justify-between items-center">
                            <h3 className="font-semibold text-sm">SEO Configuration</h3>
                            <SeoGenerator
                                type="Sector"
                                title={sourceData.title}
                                description={sourceData.description}
                                content={sourceData.content}
                                onGenerate={(t, d) => setSeoData({ metaTitle: t, metaDescription: d })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="metaTitle">Meta Title</Label>
                            <Input
                                id="metaTitle"
                                name="metaTitle"
                                placeholder="Custom SEO Title"
                                value={seoData.metaTitle}
                                onChange={(e) => setSeoData({ ...seoData, metaTitle: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="metaDescription">Meta Description</Label>
                            <Textarea
                                id="metaDescription"
                                name="metaDescription"
                                placeholder="Custom SEO Description"
                                value={seoData.metaDescription}
                                onChange={(e) => setSeoData({ ...seoData, metaDescription: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Featured Image</Label>
                        <div className="border-2 border-dashed rounded-lg p-4 text-center hover:bg-gray-50 transition-colors relative h-48 flex items-center justify-center">
                            {featuredImage ? (
                                <>
                                    <Image src={featuredImage} alt="Featured" layout="fill" objectFit="cover" className="rounded-md" />
                                    <button
                                        type="button"
                                        onClick={() => setFeaturedImage(null)}
                                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full z-10"
                                    >
                                        <X size={16} />
                                    </button>
                                </>
                            ) : (
                                <div className="space-y-2">
                                    <Upload className="mx-auto h-8 w-8 text-gray-400" />
                                    <div className="text-sm text-gray-500">
                                        <label htmlFor="featured-upload" className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary/90">
                                            <span>Upload a file</span>
                                            <input id="featured-upload" type="file" className="sr-only" onChange={handleFileUpload} accept="image/*" />
                                        </label>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-6">
                        <div className="flex items-center space-x-2">
                            <Checkbox id="isActive" name="isActive" defaultChecked={sector?.isActive !== false} />
                            <Label htmlFor="isActive">Active (Visible)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="isFeatured" name="isFeatured" defaultChecked={(sector as any)?.isFeatured} />
                            <Label htmlFor="isFeatured">Featured on Homepage</Label>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading} className="bg-[#D32F2F] hover:bg-[#B71C1C]">
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                "Save Sector"
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
