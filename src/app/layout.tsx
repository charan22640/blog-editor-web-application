import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import ProtectedLayout from "@/components/ProtectedLayout";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Blog Editor",
  description: "A full-stack blog editor application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ProtectedLayout>
          {children}
        </ProtectedLayout>
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
