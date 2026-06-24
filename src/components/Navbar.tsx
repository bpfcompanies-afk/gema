'use client';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { usePathname } from 'next/navigation';

// --- SUB-COMPONENTE: BOTÓN (Sin cambios) ---
const AccessBtn = ({ isScrolled, mobile = false }: { isScrolled: boolean; mobile?: boolean }) => {
  const btnRef = useRef<HTMLAnchorElement>(null);

  const handleMouseEnter = () => {
    gsap.to(btnRef.current, { scale: 1.1, duration: 0.8, ease: "elastic.out(1, 0.3)", overwrite: true });
  };

  const handleMouseLeave = () => {
    gsap.to(btnRef.current, { scale: 1, duration: 0.3, ease: "power2.out", overwrite: true });
  };

  return (
    <Link 
      ref={btnRef}
      href="https://gema.bpfcompanies.com/" 
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`
        rounded-full font-bold flex items-center justify-center leading-none transition-all duration-300
        ${mobile 
          ? 'bg-gema-blue text-white w-full py-5 text-xl shadow-xl' 
          : isScrolled 
            ? 'bg-gema-blue text-white px-8 h-10 text-sm shadow-lg shadow-gema-blue/20' 
            : 'bg-white text-gema-dark px-10 h-12 text-base shadow-xl hover:bg-gema-gradient hover:text-white text-center border border-blue-500'
        }
      `}
    >
      <span className="-translate-y-px">Acceso</span>
    </Link>
  );
};
export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState(false);
  
  const navRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(navRef.current, 
        { y: -100, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1.2, ease: 'power4.out' }
      );

      tl.current = gsap.timeline({ paused: true })
        .to(menuRef.current, {
          autoAlpha: 1,
          clipPath: 'circle(150% at 100% 0%)',
          duration: 0.8,
          ease: 'power4.inOut'
        })
        .from(".mobile-link", {
          y: 40,
          opacity: 0,
          stagger: 0.1,
          duration: 0.5,
          ease: 'power3.out'
        }, "-=0.4");
    });
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (isOpen) {
      tl.current?.play();
      document.body.style.overflow = 'hidden';
    } else {
      tl.current?.reverse();
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  useEffect(() => setIsOpen(false), [pathname]);

  const navLinks = [
    { name: 'Inicio', path: '/' },
    { name: 'Módulos', path: '/modulos' },
    { name: 'Precios', path: '/precios' },
    { name: 'Contáctanos', path: '/contacto' },
  ];

  if (pathname === '/bio') return null;

  return (
    <>
      {/* EL AJUSTE: He separado el nav del overlay. 
        El nav ahora es solo la barra superior (z-index 200).
        El overlay es un div independiente (z-index 150).
      */}
      <nav ref={navRef} className="fixed top-0 left-0 w-full z-200 flex justify-center pointer-events-none">
        <div 
          className={`
            flex items-center justify-between pointer-events-auto
            transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]
            ${isOpen 
              ? 'mt-0 w-full px-6 py-6 bg-transparent border-transparent shadow-none' 
              : isScrolled 
                ? 'mt-4 md:mt-6 w-[95%] max-w-5xl py-3 px-6 md:px-12 bg-white/70 md:bg-white/90 backdrop-blur-xl rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-white/40' 
                : 'mt-0 w-full max-w-full py-4 md:py-6 px-6 md:px-10 bg-transparent rounded-none border-transparent'
            }
          `}
        >
          <Link href="/" className="relative z-210 flex items-center gap-3 shrink-0 h-full">
            <img 
              src="/Gema.png" 
              alt="Gema Logo" 
              className={`transition-all duration-500 object-contain ${isScrolled ? 'h-6 md:h-8' : 'h-9 md:h-14'}`}
            />
          </Link>

          <div className={`hidden md:flex items-center h-full transition-all duration-700 ${isScrolled ? 'gap-1' : 'gap-4'}`}>
            <div className={`flex items-center p-1.5 rounded-full transition-all duration-700 ${isScrolled ? 'bg-gray-100/60 border border-gray-200/50' : 'bg-transparent border-transparent'}`}>
              {navLinks.map((link) => (
                <Link key={link.name} href={link.path} className={`relative px-6 py-2 text-xs font-bold uppercase tracking-widest transition-all duration-500 rounded-full flex items-center justify-center leading-none ${pathname === link.path ? 'text-white' : 'text-gray-500 hover:text-gema-blue'}`}>
                  {pathname === link.path && <div className="absolute inset-0 bg-gema-gradient rounded-full -z-10 shadow-md" />}
                  <span className="relative z-10 -translate-y-px">{link.name}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="shrink-0 h-full flex items-center gap-4">
            <div className="hidden md:block">
              <AccessBtn isScrolled={isScrolled} />
            </div>

            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="relative z-210 md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 focus:outline-none pointer-events-auto"
            >
              <span className={`w-6 h-0.5 bg-black transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`w-6 h-0.5 bg-black transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`} />
              <span className={`w-6 h-0.5 bg-black transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </button>
          </div>
        </div>
      </nav>

      {/* --- OVERLAY MÓVIL: Movido fuera del NAV para romper el contexto de apilamiento --- */}
      <div 
        ref={menuRef}
        className="fixed inset-0 bg-white z-150 md:hidden flex flex-col items-center justify-center px-8 invisible"
        style={{ clipPath: 'circle(0% at 100% 0%)' }}
      >
        <div className="flex flex-col gap-6 w-full max-w-sm text-center">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.path}
              className={`mobile-link text-3xl font-bold transition-colors pb-4 border-b border-gray-100
                ${pathname === link.path && <div className="absolute inset-0 bg-gema-gradient rounded-full -z-10 shadow-md" />}
              `}
            >
              {link.name}
            </Link>
          ))}
          <div className="mobile-link pt-2 w-full">
            <AccessBtn isScrolled={true} mobile={true} />
          </div>
        </div>
      </div>
    </>
  );
}