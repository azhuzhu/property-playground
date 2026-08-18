import type { Metadata } from "next";
import { Navigation } from "@/components/navigation";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Property Playground", template: "%s · Property Playground" },
  description: "Unified U.S. suburban property valuation and market intelligence portal.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Navigation />
        <main className="min-h-screen md:ml-72">{children}</main>
      </body>
    </html>
  );
}
