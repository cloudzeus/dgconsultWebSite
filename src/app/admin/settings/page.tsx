import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getSettings } from "./actions";
import { SettingsForm } from "./SettingsForm";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
    const session = await auth();
    if (!session) {
        redirect("/admin/login");
    }

    const settings = await getSettings();

    return (
        <div className="space-y-6 max-w-4xl">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            </div>

            <SettingsForm initialSettings={settings} />
        </div>
    );
}
