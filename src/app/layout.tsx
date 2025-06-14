import type { Metadata } from "next";
import { Poppins } from "next/font/google"; // Import Poppins
import "./globals.css";
import ReduxProvider from '@/components/ReduxProvider';
// Remove the direct import of SessionProvider
// import { SessionProvider } from "next-auth/react"; // Import SessionProvider

// Import the new SessionWrapper component
import SessionWrapper from "@/components/SessionWrapper";

// Configure Poppins font
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Bakso Muncul Pak Mul",
  description: "Since MMIX, Bakso has been a staple in Indonesian cuisine.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} antialiased`}>
        <ReduxProvider>
          <SessionWrapper>
            <main className="bg-amber-50 min-h-full border p-4"> 
              {children}
            </main>
          </SessionWrapper>
        </ReduxProvider>
      </body>
    </html>
  );
}
