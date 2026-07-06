import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SmoothScroll from "../components/SmoothScroll"; // <--- Importamos aquí
import { Analytics } from "@vercel/analytics/next";
import { GoogleAnalytics } from "@next/third-parties/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata = {
  title: "Gema | Software de Gestión para Fundaciones y ONG",
  description: "Software de gestión para fundaciones y ONG. Optimiza tus procesos, presupuestos y proyectos en tiempo real con Gema. ¡Lleva el control absoluto hoy!",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${inter.variable} antialiased`}>
        {/* Envolvemos todo el contenido visible dentro de SmoothScroll */}
        <SmoothScroll>
            <Navbar />
            <main className="w-full">
              {children}
            </main>
            <Footer />
        </SmoothScroll>
        <Analytics />
        <GoogleAnalytics gaId="G-E7K0643F6F" />
      </body>
    </html>
  );
}