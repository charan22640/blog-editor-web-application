import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import ProtectedLayout from "@/components/ProtectedLayout";
import { ThemeProvider } from "@/components/ThemeProvider";
import { themeScript } from "./theme-script";

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
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider>
          <ProtectedLayout>
            {children}
          </ProtectedLayout>
          <Toaster position="bottom-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
