import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "EngineerVerse — The All-in-One Platform for Engineering Students",
  description:
    "Learn skills, build projects, track progress, create portfolios, find teammates, prepare for interviews, and join hackathons — all in one place.",
  keywords: [
    "engineering",
    "students",
    "projects",
    "portfolio",
    "skills",
    "hackathons",
    "interviews",
    "learning",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full`}
    >
      <body className="min-h-full flex flex-col antialiased">
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "var(--bg-secondary)",
              color: "var(--text-primary)",
              border: "1px solid var(--border-default)",
              borderRadius: "var(--radius-md)",
              fontSize: "0.875rem",
            },
            success: {
              iconTheme: {
                primary: "var(--success)",
                secondary: "var(--bg-secondary)",
              },
            },
            error: {
              iconTheme: {
                primary: "var(--error)",
                secondary: "var(--bg-secondary)",
              },
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}
