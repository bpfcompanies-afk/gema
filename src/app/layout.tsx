import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar"; 
import Footer from "../components/Footer";
import SmoothScroll from "../components/SmoothScroll"; // <--- Importamos aquí

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata = {
  title: "Gema | Gestión Empresarial Modular Avanzada",
  description: "La herramienta definitiva que une la facilidad de uso con la potencia de SAP.",
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
      </body>
    </html>
  );
}