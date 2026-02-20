import type { Metadata } from "next";
import { authOptions } from "@/lib/config/auth";
import { Geist, Geist_Mono } from "next/font/google";
import AppSidebar from "@/components/layout/app-sidebar";
import { notebookService } from "@/lib/services/notebookService";
import { SidebarInset, SidebarProvider, SidebarRail, SidebarTrigger } from "@/components/ui/sidebar";
import { getServerSession } from "next-auth";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Easy Notebooks",
  description: "Notebook app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>{children}</body>
      </html>
    );
  }

  const notebooks = await notebookService.index(session.user.id).catch(() => []);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SidebarProvider>
          <AppSidebar notebooks={notebooks} />
          <SidebarRail />
          <SidebarInset>
            <header className="bg-background/95 border-border sticky top-0 z-30 flex items-center gap-3 border-b px-6 py-4 backdrop-blur">
              <SidebarTrigger />
            </header>
            <main className="mx-auto w-full max-w-7xl px-6 py-6">{children}</main>
          </SidebarInset>
        </SidebarProvider>
      </body>
    </html>
  );
}
