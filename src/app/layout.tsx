import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";


export const metadata: Metadata = {
  title: "SEMTEX | CORE",
  description: "Sistema de gestión táctica",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"    >
      <body className="h-screen w-full flex bg-[#000000] text-[#E5E1E4] overflow-hidden">
        <Sidebar />

        <main className="flex-1 h-full overflow-y-auto pl-64">{children}</main>
      </body>
    </html>
  );
}
