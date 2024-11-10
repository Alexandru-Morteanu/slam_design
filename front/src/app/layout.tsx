import type { Metadata } from "next";
import "./globals.css";
import Navigation from "./comp/Navigation";

export const metadata: Metadata = {
  title: "Slam app",
  description: "This is Slam app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Navigation />
        <div className="pt-16">{children}</div>
      </body>
    </html>
  );
}
