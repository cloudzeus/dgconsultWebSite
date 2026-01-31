import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "greek"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "DGCONSULT - Business Solutions on Demand",
  description: "Εξειδικευμένες λύσεις ψηφιακού μετασχηματισμού και ανάλυσης δεδομένων για τον αγροδιατροφικό τομέα. AI, IoT, Big Data Analytics.",
  keywords: ["ψηφιακός μετασχηματισμός", "big data", "αγροδιατροφικός τομέας", "IoT", "τεχνητή νοημοσύνη", "αυτοματοποίηση"],
  authors: [{ name: "DGCONSULT" }],
  openGraph: {
    title: "DGCONSULT - Business Solutions on Demand",
    description: "Εξειδικευμένες λύσεις ψηφιακού μετασχηματισμού και ανάλυσης δεδομένων για τον αγροδιατροφικό τομέα.",
    type: "website",
    locale: "el_GR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="el" className={inter.variable} suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
