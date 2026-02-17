'use client';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  TwitterIcon, 
  Linkedin01Icon, 
  InstagramIcon, 
  ArrowRight01Icon 
} from 'hugeicons-react';

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const bgTextRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. ANIMACIÓN DE ENTRADA (Columnas subiendo)
      gsap.fromTo(".footer-col",
        { y: 50, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power2.out",
          scrollTrigger: { trigger: footerRef.current, start: "top 90%" }
        }
      );

      // 2. ANIMACIÓN DE LA MARCA DE AGUA (Parallax suave)
      gsap.to(bgTextRef.current, {
        y: -50,
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top bottom",
          end: "bottom bottom",
          scrub: 1
        }
      });

      // 3. ANIMACIÓN DE LAS OLAS (Marea suave)
      // gsap.to(".wave-layer", {
      //   x: "10px",      // ANTES: -20px (Ahora se mueve mucho más lateralmente)
      //   // y: "-15px",       // NUEVO: Añadimos movimiento vertical (arriba/abajo)
      //   duration: 4,    // ANTES: 4 (Un poco más rápido)
      //   repeat: -10,
      //   yoyo: true,
      //   ease: "sine.inOut" // Mantiene el movimiento fluido y natural
      // });

    }, footerRef);

    return () => ctx.revert();
  }, []);

  // Efecto Magnético simple para iconos
  const handleMagnet = (e: React.MouseEvent<HTMLDivElement>) => {
    const item = e.currentTarget;
    const bound = item.getBoundingClientRect();
    const x = e.clientX - (bound.left + bound.width / 2);
    const y = e.clientY - (bound.top + bound.height / 2);
    
    gsap.to(item, { x: x * 0.3, y: y * 0.3, duration: 0.3, ease: 'power2.out' });
  };

  const resetMagnet = (e: React.MouseEvent<HTMLDivElement>) => {
    gsap.to(e.currentTarget, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)' });
  };

  return (
    <footer ref={footerRef} className="relative bg-gema-dark text-white pt-32 pb-10 overflow-hidden">
      
      {/* --- FONDO DECORATIVO --- */}
      {/* Marca de agua gigante */}
      <div 
        ref={bgTextRef} 
        className="absolute bottom-0 left-1/2 -translate-x-1/2 text-[15vw] font-bold text-white/[0.03] whitespace-nowrap pointer-events-none select-none leading-none z-0"
      >
        GEMA
      </div>
      
      {/* Blob de luz azul para dar profundidad */}
       {/* <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gema-blue/10 rounded-full blur-[120px] pointer-events-none z-0"></div> */}

      {/* --- SEPARADOR ONDULADO (Wave) --- */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0] z-10">
        
        {/* Onda Trasera (Efecto de profundidad, más lenta) */}
        <svg className=" relative block w-[110%] h-[60px] md:h-[100px] opacity-30 -ml-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
             <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="#fafafa"></path>
        </svg>

        {/* Onda Principal (La que corta) */}
        <svg className=" absolute top-0 left-0 block w-full h-[60px] md:h-[100px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
             <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="#fafafa"></path>
        </svg>

      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          
          {/* Columna 1: Brand & Newsletter (Ocupa 4 columnas) */}
          <div className="col-span-1 md:col-span-5 footer-col">
            <Link href="/" className="text-2xl font-bold tracking-tighter flex items-center gap-2 mb-6 group">
              <div className="w-10 h-auto rounded-xl group-hover:rotate-12 transition-transform duration-500">
                <img src="/Gema tittle.png" alt="Gema Logo" className="w-full h-full object-contain" />
              </div>
              <span className='text-4xl'>Gema</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-sm">
              La plataforma modular que democratiza la gestión empresarial. Potencia de SAP, simplicidad de Canva.
            </p>
            
            {/* Newsletter Input */}
            <div className="max-w-sm relative group">
               <input 
                  type="email" 
                  placeholder="Tu correo corporativo" 
                  className="w-full bg-white/5 border border-white/10 rounded-full py-3 px-5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-gema-blue transition-colors"
               />
               <button className="absolute right-1.5 top-1.5 w-9 h-9 bg-gema-blue rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform">
                  <ArrowRight01Icon size={16} />
               </button>
            </div>
          </div>

          {/* Spacer (1 columna) */}
          <div className="hidden md:block col-span-1"></div>

          {/* Columna 2: Producto */}
          <div className="col-span-1 md:col-span-2 footer-col">
            <h4 className="text-lg font-bold mb-6 text-white">Producto</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><Link href="/modulos#inventario" className="hover:text-white hover:translate-x-1 transition-all inline-block">Inventario</Link></li>
              <li><Link href="/modulos#iot" className="hover:text-white hover:translate-x-1 transition-all inline-block">IoT & Sensores</Link></li>
              <li><Link href="/modulos#medica" className="hover:text-white hover:translate-x-1 transition-all inline-block">Gestión Médica</Link></li>
              <li><Link href="/modulos#compras" className="hover:text-white hover:translate-x-1 transition-all inline-block">Compras</Link></li>
              <li><Link href="/modulos#consumibles" className="hover:text-white hover:translate-x-1 transition-all inline-block">Consumibles</Link></li>
              <li><Link href="/modulos#seguridad" className="hover:text-white hover:translate-x-1 transition-all inline-block">Seguridad</Link></li>


            </ul>
          </div>

          {/* Columna 3: Compañía */}
          <div className="col-span-1 md:col-span-2 footer-col">
            <h4 className="text-lg font-bold mb-6 text-white">Compañía</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><Link href="/nosotros" className="hover:text-white hover:translate-x-1 transition-all inline-block">Sobre Nosotros</Link></li>
              <li><Link href="/precios" className="hover:text-white hover:translate-x-1 transition-all inline-block">Precios</Link></li>
              <li><Link href="/contacto" className="hover:text-white hover:translate-x-1 transition-all inline-block">Soporte</Link></li>
              <li><Link href="/contacto" className="hover:text-white hover:translate-x-1 transition-all inline-block">Partners</Link></li>
            </ul>
          </div>

          {/* Columna 4: Legal */}
          <div className="col-span-1 md:col-span-2 footer-col">
            <h4 className="text-lg font-bold mb-6 text-white">Legal</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><Link href="/legales" className="hover:text-white hover:translate-x-1 transition-all inline-block">Privacidad</Link></li>
              <li><Link href="/legales" className="hover:text-white hover:translate-x-1 transition-all inline-block">Términos</Link></li>
              <li><Link href="/legales" className="hover:text-white hover:translate-x-1 transition-all inline-block">Seguridad</Link></li>
            </ul>
          </div>
        </div>

        {/* Línea divisoria */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center footer-col">
          <p className="text-gray-600 text-sm">
            © {new Date().getFullYear()} Gema App Inc.
          </p>
          
          {/* Socials Magnéticos */}
          <div className="flex gap-4 mt-4 md:mt-0">
            {[<TwitterIcon key="tw"/>, <Linkedin01Icon key="li"/>, <InstagramIcon key="ig"/>].map((icon, i) => (
               <div 
                  key={i}
                  onMouseMove={handleMagnet}
                  onMouseLeave={resetMagnet}
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-white hover:text-gema-dark transition-colors cursor-pointer"
               >
                  <div className="pointer-events-none">
                     {icon}
                  </div>
               </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}