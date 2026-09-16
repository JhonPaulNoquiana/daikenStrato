import type { Metadata } from 'next';
import { Manrope, Cormorant_Garamond } from 'next/font/google';
import './globals.css';

const sans = Manrope({ variable: '--font-sans-custom', subsets: ['latin'] });
const serif = Cormorant_Garamond({ variable: '--font-serif-custom', subsets: ['latin'], weight: ['400', '500'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://daikin-strato-builders-opc.yukinowatashiwa.chatgpt.site'),
  title: 'Daikin × Strato Builders OPC — More Cooling for Bigger Spaces',
  description: 'Professional Daikin air-conditioning systems, installation, and service from Strato Builders OPC.',
  openGraph: {
    title: 'Daikin × Strato Builders OPC',
    description: 'More cooling for bigger spaces. Professional systems, installation, and service.',
    images: [{ url: '/og.png', width: 1736, height: 910, alt: 'Daikin and Strato Builders OPC cooling systems' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Daikin × Strato Builders OPC',
    description: 'More cooling for bigger spaces. Professional systems, installation, and service.',
    images: ['/og.png'],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${sans.variable} ${serif.variable}`}>{children}</body></html>;
}
