import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
    LayoutDashboard,
    FileText,
    Briefcase,
    Users,
    Settings,
    Mail,
} from "lucide-react";
import { LogoutButton } from "./LogoutButton";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    if (!session) {
        redirect("/admin/login");
    }

    const menuItems = [
        { icon: LayoutDashboard, label: "Επισκόπηση", href: "/admin/dashboard" },
        { icon: FileText, label: "Σελίδες", href: "/admin/pages" },
        { icon: Briefcase, label: "Case Studies", href: "/admin/case-studies" },
        { icon: Users, label: "Ομάδα", href: "/admin/team" },
        { icon: Mail, label: "Μηνύματα Επικοινωνίας", href: "/admin/messages" },
        { icon: Settings, label: "Ρυθμίσεις", href: "/admin/settings" },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 flex flex-col z-50">
                {/* Logo */}
                <div className="p-6 border-b border-gray-200">
                    <Image
                        src="/logo.webp"
                        alt="DGCONSULT"
                        width={150}
                        height={30}
                        className="h-8 w-auto"
                    />
                    <p className="text-xs text-gray-500 mt-2">Πίνακας Διαχείρισης</p>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1">
                    {menuItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-gray-700 hover:bg-gray-100 hover:text-[#D32F2F]"
                        >
                            <item.icon className="w-5 h-5" />
                            <span className="font-medium text-sm">{item.label}</span>
                        </Link>
                    ))}
                </nav>

                {/* User Info & Logout */}
                <div className="p-4 border-t border-gray-200">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-[#D32F2F] flex items-center justify-center text-white font-bold">
                            {session.user?.name?.charAt(0) || "A"}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                                {session.user?.name}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                                {session.user?.email}
                            </p>
                        </div>
                    </div>
                    <LogoutButton />
                </div>
            </aside>

            {/* Main Content */}
            <main className="ml-64 p-8">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
