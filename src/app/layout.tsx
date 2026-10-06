import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "GranaBank", template: "%s · GranaBank" },
  description:
    "La billetera de los socios de Club Lanús: tus tarjetas, tu saldo y tus movimientos.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#7a1d2d",
};

/** Root HTML document: language, brand font and global styles. */
export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="es-AR" className={poppins.variable}>
      <body>{children}</body>
    </html>
  );
}
