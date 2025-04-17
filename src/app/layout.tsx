import type { Metadata } from "next";
import { Work_Sans } from "next/font/google";
import "./globals.css";

const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
});



export const metadata: Metadata = {
  title: "Weather (Or Not)",
  description: "And now for something completely different.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${workSans.variable} antialiased bg-[image:var(--background-02d)]`}
      >
        {children}
      </body>
    </html>
  );
}
