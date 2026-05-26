import type { Metadata } from 'next';
import './globals.css';
import { Inter, Cinzel } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const cinzel = Cinzel({
  subsets: ['latin'],
  variable: '--font-cinzel',
  display: 'swap',
  weight: ['400', '600', '700'],
});

export const metadata: Metadata = {
  title: 'partyhat — Higher or Lower with OSRS items',
  description:
    'A Higher or Lower game built on live Old School RuneScape Grand Exchange prices. Guess which item trades for more gp.',
  metadataBase: new URL('https://partyhat-orpin.vercel.app'),
  openGraph: {
    title: 'partyhat — Higher or Lower with OSRS items',
    description: 'Guess which OSRS item trades for more gp. Live Grand Exchange prices.',
    type: 'website',
    locale: 'en_US',
    url: 'https://partyhat-orpin.vercel.app',
    siteName: 'partyhat',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'partyhat — Higher or Lower with OSRS items',
    description: 'Guess which OSRS item trades for more gp. Live Grand Exchange prices.',
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${cinzel.variable}`} suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
