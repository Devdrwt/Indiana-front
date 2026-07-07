import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "Drwintech Multi-Agent Platform",
  description: "Dashboard de pilotage de la chaîne d'agents Drwintech",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body>
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 p-8 md:p-10 max-w-[1400px]">{children}</main>
        </div>
      </body>
    </html>
  );
}
