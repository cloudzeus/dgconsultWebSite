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
import { Loader2, X, Upload } from "lucide-react";
import Image from "next/image";

interface SectorModalProps {
    isOpen: boolean;
    onClose: () => void;
    sector: Sector | null;
    onSuccess: () => void;
}

export function SectorModal({ isOpen, onClose, sector, onSuccess }: SectorModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [featuredImage, setFeaturedImage] = useState<string | null>(sector?.featuredImage || null);

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

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);
        if (featuredImage) formData.append("featuredImage", featuredImage);

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
            <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{sector ? "Edit Sector" : "New Sector"}</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input id="title" name="title" required defaultValue={sector?.title} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="slug">Slug</Label>
                            <Input id="slug" name="slug" required defaultValue={sector?.slug} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Short Description (for Cards)</Label>
                        <Textarea id="description" name="description" required defaultValue={sector?.description} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="content">Full Content</Label>
                        <Textarea
                            id="content"
                            name="content"
                            className="min-h-[200px]"
                            defaultValue={sector?.content || ""}
                            placeholder="# Markdown or HTML content here..."
                        />
                        <p className="text-xs text-gray-500">You can use Markdown for rich text.</p>
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
                            <Checkbox id="isFeatured" name="isFeatured" defaultChecked={sector?.isFeatured} />
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
