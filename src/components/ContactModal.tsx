"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail } from "lucide-react";

interface ContactModalProps {
    trigger?: React.ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export default function ContactModal({ trigger, open: controlledOpen, onOpenChange }: ContactModalProps) {
    const [internalOpen, setInternalOpen] = useState(false);

    const isControlled = controlledOpen !== undefined;
    const isOpen = isControlled ? controlledOpen : internalOpen;
    const setIsOpen = isControlled ? onOpenChange! : setInternalOpen;

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            {trigger}
            <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-none">
                <div className="bg-gradient-to-br from-[#D32F2F] to-[#B71C1C] p-8 text-white">
                    <DialogHeader className="text-left">
                        <DialogTitle className="text-3xl font-extrabold text-white mb-2">
                            Επικοινωνήστε Μαζί Μας
                        </DialogTitle>
                        <DialogDescription className="text-white/90 text-base">
                            Είμαστε εδώ για να σας βοηθήσουμε με τις επιχειρηματικές σας ανάγκες
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <div className="p-8 space-y-6">
                    {/* Address */}
                    <div className="flex items-start gap-4 group">
                        <div className="w-12 h-12 rounded-xl bg-[#D32F2F]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#D32F2F]/20 transition-colors">
                            <MapPin className="w-6 h-6 text-[#D32F2F]" />
                        </div>
                        <div>
                            <h3 className="font-bold text-[#1A1A1A] mb-1 text-sm uppercase tracking-wider">Διεύθυνση</h3>
                            <p className="text-[#333333] font-medium leading-relaxed">
                                Λεωφ. Κηφισού 48<br />
                                Περιστέρι – 121 33
                            </p>
                        </div>
                    </div>

                    {/* Phone */}
                    <div className="flex items-start gap-4 group">
                        <div className="w-12 h-12 rounded-xl bg-[#D32F2F]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#D32F2F]/20 transition-colors">
                            <Phone className="w-6 h-6 text-[#D32F2F]" />
                        </div>
                        <div>
                            <h3 className="font-bold text-[#1A1A1A] mb-1 text-sm uppercase tracking-wider">Τηλέφωνο</h3>
                            <a
                                href="tel:2105711581"
                                className="text-[#333333] font-semibold text-lg hover:text-[#D32F2F] transition-colors"
                            >
                                210 5711581
                            </a>
                        </div>
                    </div>

                    {/* Email */}
                    <div className="flex items-start gap-4 group">
                        <div className="w-12 h-12 rounded-xl bg-[#D32F2F]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#D32F2F]/20 transition-colors">
                            <Mail className="w-6 h-6 text-[#D32F2F]" />
                        </div>
                        <div>
                            <h3 className="font-bold text-[#1A1A1A] mb-1 text-sm uppercase tracking-wider">Email</h3>
                            <a
                                href="mailto:info@dgconsult.gr"
                                className="text-[#333333] font-semibold hover:text-[#D32F2F] transition-colors"
                            >
                                info@dgconsult.gr
                            </a>
                        </div>
                    </div>

                    {/* CTA Buttons */}
                    <div className="pt-6 border-t border-gray-100 space-y-3">
                        <Button
                            asChild
                            className="w-full bg-[#D32F2F] hover:bg-[#B71C1C] text-white font-bold py-6 rounded-xl shadow-lg shadow-[#D32F2F]/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                        >
                            <a href="tel:2105711581">
                                Καλέστε Τώρα
                            </a>
                        </Button>
                        <Button
                            asChild
                            variant="outline"
                            className="w-full border-2 border-[#D32F2F] text-[#D32F2F] hover:bg-[#D32F2F] hover:text-white font-bold py-6 rounded-xl transition-all"
                        >
                            <a href="mailto:info@dgconsult.gr">
                                Στείλτε Email
                            </a>
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
