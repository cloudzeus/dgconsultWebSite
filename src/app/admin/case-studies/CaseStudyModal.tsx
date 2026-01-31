"use client";

import { useState, useRef } from "react";
import { CaseStudy } from "@prisma/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { createCaseStudy, updateCaseStudy } from "./actions";
import { toast } from "sonner";
import { Loader2, X, Upload } from "lucide-react";
import Image from "next/image";

interface CaseStudyModalProps {
    isOpen: boolean;
    onClose: () => void;
    caseStudy: CaseStudy | null;
    onSuccess: () => void;
}

export function CaseStudyModal({ isOpen, onClose, caseStudy, onSuccess }: CaseStudyModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [images, setImages] = useState<string[]>(caseStudy?.images ? JSON.parse(caseStudy.images) : []);
    const [featuredImage, setFeaturedImage] = useState<string | null>(caseStudy?.featuredImage || null);
    const [logo, setLogo] = useState<string | null>(caseStudy?.logo || null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'gallery' | 'featured' | 'logo') => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setIsLoading(true);
        try {
            const uploadPromises = Array.from(files).map(async (file) => {
                const formData = new FormData();
                formData.append("file", file);
                formData.append("folder", "case-studies");

                const res = await fetch("/api/upload", {
                    method: "POST",
                    body: formData,
                });

                if (!res.ok) throw new Error("Upload failed");
                const data = await res.json();
                return data.url;
            });

            const urls = await Promise.all(uploadPromises);

            if (type === 'gallery') {
                setImages(prev => [...prev, ...urls]);
            } else if (type === 'featured') {
                setFeaturedImage(urls[0]);
            } else if (type === 'logo') {
                setLogo(urls[0]);
            }

            toast.success("Images uploaded successfully");
        } catch (error) {
            toast.error("Failed to upload images");
            console.error(error);
        } finally {
            setIsLoading(false);
            // Reset input
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);
        formData.append("images", JSON.stringify(images));
        if (featuredImage) formData.append("featuredImage", featuredImage);
        if (logo) formData.append("logo", logo);

        // Ensure boolean check works
        if (!formData.get("isPublished")) {
            // It's handled by default false, but good to be explicit for unchecked checkboxes in some parsing logic
        }

        try {
            const res = caseStudy
                ? await updateCaseStudy(caseStudy.id, null, formData)
                : await createCaseStudy(null, formData);

            if (res.success) {
                toast.success(caseStudy ? "Updated successfully" : "Created successfully");
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
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{caseStudy ? "Edit Case Study" : "New Case Study"}</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input id="title" name="title" required defaultValue={caseStudy?.title} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="slug">Slug</Label>
                            <Input id="slug" name="slug" required defaultValue={caseStudy?.slug} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <Input id="category" name="category" defaultValue={caseStudy?.category || ""} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="clientName">Client Name</Label>
                            <Input id="clientName" name="clientName" defaultValue={caseStudy?.clientName || ""} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description (Short)</Label>
                        <Textarea id="description" name="description" required defaultValue={caseStudy?.description} />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label>Featured Image</Label>
                            <div className="border-2 border-dashed rounded-lg p-4 text-center hover:bg-gray-50 transition-colors relative h-40 flex items-center justify-center">
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
                                                <input id="featured-upload" type="file" className="sr-only" onChange={(e) => handleFileUpload(e, 'featured')} accept="image/*" />
                                            </label>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Client Logo</Label>
                            <div className="border-2 border-dashed rounded-lg p-4 text-center hover:bg-gray-50 transition-colors relative h-40 flex items-center justify-center">
                                {logo ? (
                                    <>
                                        <Image src={logo} alt="Logo" layout="fill" objectFit="contain" className="p-2" />
                                        <button
                                            type="button"
                                            onClick={() => setLogo(null)}
                                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full z-10"
                                        >
                                            <X size={16} />
                                        </button>
                                    </>
                                ) : (
                                    <div className="space-y-2">
                                        <Upload className="mx-auto h-8 w-8 text-gray-400" />
                                        <div className="text-sm text-gray-500">
                                            <label htmlFor="logo-upload" className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary/90">
                                                <span>Upload a file</span>
                                                <input id="logo-upload" type="file" className="sr-only" onChange={(e) => handleFileUpload(e, 'logo')} accept="image/*" />
                                            </label>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>


                    <div className="space-y-2">
                        <Label>Project Gallery</Label>
                        <div className="grid grid-cols-4 gap-4 mb-4">
                            {images.map((img, idx) => (
                                <div key={idx} className="relative aspect-video rounded-md overflow-hidden bg-gray-100 group">
                                    <Image src={img} alt={`Gallery ${idx}`} layout="fill" objectFit="cover" />
                                    <button
                                        type="button"
                                        onClick={() => setImages(prev => prev.filter((_, i) => i !== idx))}
                                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X size={12} />
                                    </button>
                                </div>
                            ))}
                            <div className="border-2 border-dashed rounded-lg flex items-center justify-center h-full aspect-video hover:bg-gray-50">
                                <label htmlFor="gallery-upload" className="cursor-pointer flex flex-col items-center">
                                    <Upload className="h-6 w-6 text-gray-400 mb-1" />
                                    <span className="text-xs text-gray-500">Add Images</span>
                                    <input id="gallery-upload" type="file" multiple className="sr-only" onChange={(e) => handleFileUpload(e, 'gallery')} accept="image/*" />
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="industry">Industry</Label>
                            <Input id="industry" name="industry" defaultValue={caseStudy?.industry || ""} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="technologies">Technologies</Label>
                            <Input id="technologies" name="technologies" defaultValue={caseStudy?.technologies || ""} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="challenge">Challenge</Label>
                        <Textarea id="challenge" name="challenge" defaultValue={caseStudy?.challenge || ""} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="solution">Solution</Label>
                        <Textarea id="solution" name="solution" defaultValue={caseStudy?.solution || ""} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="results">Results</Label>
                        <Textarea id="results" name="results" defaultValue={caseStudy?.results || ""} />
                    </div>

                    <div className="flex items-center space-x-2">
                        <Checkbox id="isPublished" name="isPublished" defaultChecked={caseStudy?.isPublished} />
                        <Label htmlFor="isPublished">Published</Label>
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
                                "Save Case Study"
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
