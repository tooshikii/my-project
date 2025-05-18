import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/ui/Navigation";
import DatabaseProvider from "@/components/providers/DatabaseProvider";
import StoreProvider from "@/components/providers/StoreProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DevPulse - Personal Developer Dashboard",
  description: "Track your coding activity, learning progress, and development habits",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <DatabaseProvider>
          <StoreProvider>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
              <Navigation />
              <main className="container mx-auto px-4 py-8">
                {children}
              </main>
            </div>
          </StoreProvider>
        </DatabaseProvider>
      </body>
    </html>
  );
}
