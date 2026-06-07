import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./tailwind.css";
import "./app.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Store Location Analyzer | Retail Site Selection Tool",
    template: "%s | Store Location Analyzer",
  },
  description:
    "Lightweight store location analyzer powered by Google Maps. Score retail site selection with competitor density, foot traffic proxies, and visibility.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Google Analytics */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-C3DLQX1GQR"
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-C3DLQX1GQR');
            `,
          }}
        />
      </head>

      <body className={inter.className}>{children}</body>
    </html>
  );
}
