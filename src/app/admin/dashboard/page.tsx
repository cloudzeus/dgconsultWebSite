import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
    FileText,
    Briefcase,
    Users,
    Mail,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
    const session = await auth();

    if (!session) {
        redirect("/admin/login");
    }

    return (
        <>
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Καλώς ήρθατε, {session.user?.name}!
                </h1>
                <p className="text-gray-600">
                    Διαχειριστείτε το περιεχόμενο της ιστοσελίδας σας
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                            <FileText className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">12</h3>
                    <p className="text-sm text-gray-600">Σελίδες</p>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                            <Briefcase className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">3</h3>
                    <p className="text-sm text-gray-600">Case Studies</p>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                            <Users className="w-6 h-6 text-purple-600" />
                        </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">5</h3>
                    <p className="text-sm text-gray-600">Μέλη Ομάδας</p>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center">
                            <Mail className="w-6 h-6 text-red-600" />
                        </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">24</h3>
                    <p className="text-sm text-gray-600">Νέα Μηνύματα</p>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                    Γρήγορες Ενέργειες
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Link
                        href="/admin/pages/new"
                        className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#D32F2F] hover:bg-red-50 transition-all text-center"
                    >
                        <FileText className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                        <p className="font-medium text-gray-700">Νέα Σελίδα</p>
                    </Link>
                    <Link
                        href="/admin/case-studies/new"
                        className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#D32F2F] hover:bg-red-50 transition-all text-center"
                    >
                        <Briefcase className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                        <p className="font-medium text-gray-700">Νέο Case Study</p>
                    </Link>
                    <Link
                        href="/admin/messages"
                        className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#D32F2F] hover:bg-red-50 transition-all text-center"
                    >
                        <Mail className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                        <p className="font-medium text-gray-700">Προβολή Μηνυμάτων</p>
                    </Link>
                </div>
            </div>
        </>
    );
}
