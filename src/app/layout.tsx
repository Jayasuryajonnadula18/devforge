import type { Metadata } from "next";
import "./globals.css";
import { Playfair_Display, Montserrat, Cormorant_Garamond, Space_Grotesk } from "next/font/google";
import { cn } from "@/lib/utils";
import { SmoothScroll } from "@/components/SmoothScroll";
import { ThemeProvider } from "@/context/ThemeContext";
import { Toaster } from "sonner";

// Primary Font: Montserrat (Geometric, architectural sans-serif for UI, Headings & Body)
const montserrat = Montserrat({ 
  subsets: ['latin'], 
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-sans',
  display: 'swap',
});

// Secondary Font: Playfair Display (Editorial serif accents & italics for key conceptual highlights)
const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
});

// Anchor Display Font: Rector (Cormorant Garamond as open-source companion)
const cormorantGaramond = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-rector',
  display: 'swap',
});

// Secondary Technical Grotesque: Acma (Space Grotesk as open-source companion)
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-acma',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "DevForge — The Architecture of Real-World Systems",
  description: "Learn programming languages and computer science concepts by building production-grade computational systems from scratch.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn("dark h-full", montserrat.variable, playfairDisplay.variable, cormorantGaramond.variable, spaceGrotesk.variable)}>
      <body className="min-h-full font-sans antialiased selection:bg-white selection:text-black">
        <ThemeProvider>
          <SmoothScroll>
            {children}
          </SmoothScroll>
        </ThemeProvider>
        <Toaster 
          theme="dark" 
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#15171c',
              border: '1px solid rgba(255,255,255,0.08)',
              color: '#f5f4f0',
              fontFamily: 'var(--font-sans)',
              fontSize: '13px',
              borderRadius: '8px',
            }
          }}
        />
      </body>
    </html>
  );
}
