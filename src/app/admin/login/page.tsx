"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import Image from "next/image";

export const dynamic = "force-dynamic";

const formSchema = z.object({
    email: z.string().email({
        message: "Παρακαλώ εισάγετε ένα έγκυρο email.",
    }),
    password: z.string().min(1, {
        message: "Ο κωδικός πρόσβασης είναι υποχρεωτικός.",
    }),
});

export default function LoginPage() {
    const router = useRouter();
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setError("");
        setIsLoading(true);

        try {
            const result = await signIn("credentials", {
                email: values.email,
                password: values.password,
                redirect: false,
            });

            if (result?.error) {
                setError("Λάθος email ή κωδικός πρόσβασης");
            } else {
                router.push("/admin/dashboard");
                router.refresh();
            }
        } catch (error) {
            setError("Παρουσιάστηκε σφάλμα. Παρακαλώ δοκιμάστε ξανά.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Image
                        src="/logo.webp"
                        alt="DGCONSULT"
                        width={200}
                        height={40}
                        className="h-10 w-auto mx-auto mb-4"
                    />
                    <h1 className="text-2xl font-bold text-gray-900">
                        Διαχείριση Ιστοσελίδας
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Συνδεθείτε για πρόσβαση στο πίνακα ελέγχου
                    </p>
                </div>

                {/* Login Form */}
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                                    {error}
                                </div>
                            )}

                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-700 font-medium">Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="gkozyris@dgsmart.gr"
                                                className="h-12 border-gray-300 focus:border-[#D32F2F] focus:ring-[#D32F2F]/20"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-700 font-medium">Κωδικός Πρόσβασης</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                placeholder="••••••••"
                                                className="h-12 border-gray-300 focus:border-[#D32F2F] focus:ring-[#D32F2F]/20"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-12 bg-[#D32F2F] hover:bg-[#B71C1C] text-white font-semibold text-base rounded-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                            >
                                {isLoading ? (
                                    <span className="flex items-center justify-center">
                                        <svg
                                            className="animate-spin h-5 w-5 mr-2"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                                fill="none"
                                            />
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            />
                                        </svg>
                                        Σύνδεση...
                                    </span>
                                ) : (
                                    "Σύνδεση"
                                )}
                            </Button>
                        </form>
                    </Form>

                    <div className="mt-6 text-center text-sm text-gray-500">
                        <p>© {new Date().getFullYear()} DGCONSULT</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
