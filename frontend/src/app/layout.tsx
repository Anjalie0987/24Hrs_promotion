import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import DashboardLayout from "@/components/dashboard-layout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "24H Promotion Admin",
  description: "Next-gen promotion management for businesses",
};

import { AuthProvider } from "@/context/auth-context";
import { NotificationProvider } from "@/context/notification-context";
import { Toaster } from "react-hot-toast";
import { ReactQueryProvider } from "@/providers/react-query-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={inter.className}>
        <ReactQueryProvider>
          <AuthProvider>
            <NotificationProvider>
              <Toaster position="top-center" />
              <DashboardLayout>{children}</DashboardLayout>
            </NotificationProvider>
          </AuthProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
