'use client';
import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import Link from 'next/link';
import { Linkedin01Icon, InstagramIcon, TiktokIcon, Facebook01Icon } from 'hugeicons-react';

const socials = [
  { Icon: InstagramIcon, href: 'https://www.instagram.com/gemabpf/', label: 'Instagram' },
  { Icon: Linkedin01Icon, href: 'https://www.linkedin.com/in/gemabpf/', label: 'LinkedIn' },
  { Icon: Facebook01Icon, href: 'https://www.facebook.com/profile.php?id=61589596612905', label: 'Facebook' },
  { Icon: TiktokIcon, href: 'https://www.tiktok.com/@gemabpf', label: 'TikTok' },
];

export default function BioPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set('.logo-reveal', { opacity: 0, scale: 0.6 });
      gsap.set('.social-btn', { opacity: 0, y: 20 });
      gsap.set('.home-btn', { opacity: 0, y: 20 });

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // PALABRA 1: "Potencia" - entra lanzada desde abajo
      gsap.set('.word-1', { opacity: 0, y: 160, rotate: -6 });
      tl.to('.word-1', {
        opacity: 1, y: 0, rotate: 0, duration: 0.5, ease: 'back.out(1.6)',
      })
      // sale hacia la izquierda, dando entrada a "Orden"
      .to('.word-1', {
        opacity: 0, x: -220, duration: 0.35, ease: 'power2.in',
      }, '+=0.4');

      // PALABRA 2: "Orden" - entra desde la derecha justo cuando "Potencia" termina de
      // salir (mismo eje, sin solaparse) para que parezca que la jaló consigo
      gsap.set('.word-2', { opacity: 0, x: 220 });
      tl.to('.word-2', {
        opacity: 1, x: 0, duration: 0.4, ease: 'power3.out',
      })
      // sale hacia abajo, dando entrada a "Simplicidad"
      .to('.word-2', {
        opacity: 0, y: 180, duration: 0.35, ease: 'power2.in',
      }, '+=0.4');

      // PALABRA 3: "Simplicidad" - entra desde arriba (jalada por "Orden"), sin efectos extra
      gsap.set('.word-3', { opacity: 0, y: -160 });
      tl.to('.word-3', {
        opacity: 1, y: 0, duration: 0.4, ease: 'power3.out',
      })
      .to('.word-3', {
        opacity: 0, duration: 0.35, ease: 'power2.in',
      }, '+=0.35')

      .to('.logo-reveal', { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.7)' })
      .to('.social-btn', { opacity: 1, y: 0, duration: 0.45, stagger: 0.1 }, '+=0.2')
      .to('.home-btn', { opacity: 1, y: 0, duration: 0.45 }, '+=0.1');
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-screen h-screen bg-white overflow-hidden"
    >
      {/* Secuencia de palabras, ancladas al centro exacto de la pantalla.
          Cada palabra vive en su propio contenedor full-screen centrado por
          flexbox (sin transform), para que las animaciones de GSAP -que
          controlan el transform del <h1>- no choquen con el centrado. */}
      <div className="absolute inset-0 z-10 px-6">
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="word-1 text-6xl md:text-8xl lg:text-9xl font-bold uppercase tracking-tight text-center whitespace-nowrap text-gradient">
            Potencia
          </h1>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="word-2 text-6xl md:text-8xl lg:text-9xl font-bold uppercase tracking-tight text-center whitespace-nowrap text-gradient">
            Orden
          </h1>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="word-3 text-5xl md:text-7xl lg:text-8xl font-bold uppercase tracking-tight text-center whitespace-nowrap text-gradient">
            Simplicidad
          </h1>
        </div>
      </div>

      {/* Logo y redes sociales, en el mismo centro exacto de la pantalla que las
          palabras (para entonces ya están invisibles, así que no se pisan) */}
      <div className="absolute inset-0 z-20 flex items-center justify-center px-6">
        <div className="flex flex-col items-center gap-8 md:gap-10">
          <div className="logo-reveal">
            <img src="/Gema.png" alt="Gema" className="w-32 md:w-40 h-auto" />
          </div>

          <div className="flex gap-5">
            {socials.map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="social-btn w-12 h-12 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gema-dark hover:bg-gema-blue hover:text-white hover:border-gema-blue transition-colors"
              >
                <Icon size={20} />
              </a>
            ))}
          </div>

          <Link
            href="/"
            className="home-btn px-8 py-3 rounded-full bg-gema-dark text-white font-bold text-sm uppercase tracking-wide hover:bg-gema-blue transition-colors duration-300 shadow-lg shadow-gema-dark/20"
          >
            Ir al inicio
          </Link>
        </div>
      </div>
    </section>
  );
}
