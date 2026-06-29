import type { Metadata } from "next";
import "./globals.css";
import { Shell } from "@/components/layout/Shell";


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
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
