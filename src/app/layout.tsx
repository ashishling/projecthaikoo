import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth/auth-context";
import { LayoutProvider } from "@/components/layout/layout-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Haikoo - AI Pet Portrait Generator",
  description: "Generate beautiful AI portraits of your pets",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <LayoutProvider>
            {children}
          </LayoutProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
