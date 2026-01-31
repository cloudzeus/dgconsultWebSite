"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { updateSettings } from "./actions";
import { toast } from "sonner";
import { GlobalSettings } from "@prisma/client";
import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

interface SettingsFormProps {
    initialSettings: GlobalSettings;
}


type State = {
    success: boolean;
    message?: string;
    error?: string;
};

const initialState: State = {
    success: false,
    message: "",
};

export function SettingsForm({ initialSettings }: SettingsFormProps) {
    const [state, formAction] = useActionState<State, FormData>(updateSettings, initialState);

    useEffect(() => {
        if (state?.success) {
            toast.success(state.message);
        } else if (state?.error) {
            toast.error(state.error);
        }
    }, [state]);

    return (
        <form action={formAction}>
            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Contact Information</CardTitle>
                        <CardDescription>
                            These details will be displayed in the header, footer, and contact section.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" type="email" defaultValue={initialSettings.email || ""} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input id="phone" name="phone" defaultValue={initialSettings.phone || ""} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="address">Address</Label>
                            <Input id="address" name="address" defaultValue={initialSettings.address || ""} />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Social Media</CardTitle>
                        <CardDescription>
                            Links to your social media profiles.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="facebook">Facebook</Label>
                            <Input id="facebook" name="facebook" defaultValue={initialSettings.facebook || ""} placeholder="https://facebook.com/..." />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="linkedin">LinkedIn</Label>
                            <Input id="linkedin" name="linkedin" defaultValue={initialSettings.linkedin || ""} placeholder="https://linkedin.com/..." />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="twitter">Twitter / X</Label>
                            <Input id="twitter" name="twitter" defaultValue={initialSettings.twitter || ""} placeholder="https://twitter.com/..." />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="instagram">Instagram</Label>
                            <Input id="instagram" name="instagram" defaultValue={initialSettings.instagram || ""} placeholder="https://instagram.com/..." />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="youtube">YouTube</Label>
                            <Input id="youtube" name="youtube" defaultValue={initialSettings.youtube || ""} placeholder="https://youtube.com/..." />
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end">
                    <SubmitButton />
                </div>
            </div>
        </form>
    );
}

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <Button type="submit" disabled={pending} className="bg-[#D32F2F] hover:bg-[#B71C1C]">
            {pending ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                </>
            ) : (
                "Save Settings"
            )}
        </Button>
    );
}
