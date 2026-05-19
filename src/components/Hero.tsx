'use client';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import Link from 'next/link';

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const textTitleRef = useRef<HTMLHeadingElement>(null);
  const textDescRef = useRef<HTMLParagraphElement>(null);
  const textBtnRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Centrado del núcleo via GSAP para que x/y del parallax no destruya el -50%
      gsap.set(".nucleus-card", { xPercent: -50, yPercent: -50 });

      // 1. INTRO ANIMATION
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(textTitleRef.current, 
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1 }
      )
      .fromTo(textDescRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        "-=0.6"
      )
      .fromTo(textBtnRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        "-=0.6"
      )
      .fromTo(".floating-card",
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, stagger: 0.1, ease: "back.out(1.7)" },
        "-=0.4"
      );

      // 2. MOUSE PARALLAX (Solo Desktop)
      const handleMouseMove = (e: MouseEvent) => {
        if (window.innerWidth < 1024) return;
        const { clientX, clientY } = e;
        const xPos = (clientX / window.innerWidth - 0.5);
        const yPos = (clientY / window.innerHeight - 0.5);

        gsap.to(".floating-card", {
          x: xPos * -40, 
          y: yPos * -40,
          rotationY: xPos * 10,
          rotationX: yPos * -10,
          duration: 1,
          ease: "power2.out"
        });
        
        // Movemos el fondo también para dar profundidad
        gsap.to(".bg-shape", {
            x: xPos * 30,
            y: yPos * 30,
            duration: 2,
            ease: "power2.out"
        });
      };

      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    /* CAMBIO PRINCIPAL: 
      1. h-[100vh] o min-h-screen forzado.
      2. relative para contener los elementos absolutos.
      3. overflow-hidden para que nada se salga.
    */
    <section 
      ref={containerRef} 
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden"
    >
      
      {/* --- CAPA DE FONDO (Absoluta para garantizar cobertura total) --- */}
      {/* Este div llena toda la pantalla detrás del contenido, asegurando que el Navbar tenga fondo */}
      <div className="absolute inset-0 z-0">
          {/* Gradiente base sutil */}
          <div className="absolute inset-0 bg-linear-to-b from-blue-50 via-white to-white"></div>
          
          {/* Blob Decorativo Superior (Detrás del Navbar) */}
          <div className="bg-shape absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] bg-purple-200/20 rounded-full blur-[120px] mix-blend-multiply"></div>
          
          {/* Blob Decorativo Inferior Derecha */}
          <div className="bg-shape absolute top-[20%] -right-[10%] w-[60vw] h-[60vw] bg-blue-200/20 rounded-full blur-[100px] mix-blend-multiply"></div>
      </div>


      {/* --- CONTENIDO PRINCIPAL (Z-Index alto para estar sobre el fondo) --- */}
      <div className="container relative z-10 mx-auto px-6 flex flex-col lg:flex-row items-center gap-12 lg:gap-0 pt-24 lg:pt-0">
        
        {/* COLUMNA IZQUIERDA: TEXTO */}
        <div className="w-full lg:w-1/2 flex flex-col items-start space-y-6 lg:pl-4">
          <div className="inline-block px-3 py-1 rounded-full bg-white border border-blue-100 text-gema-blue text-xs font-bold uppercase tracking-wider mb-2 shadow-sm">
            Gema v1.0
          </div>
          
          <h1 ref={textTitleRef} className="text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.1] text-gema-dark opacity-0">
            Potecia y facilidad, <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-gema-blue to-gema-purple">al servicio de tu compañia.</span>
          </h1>
          
          <p ref={textDescRef} className="text-lg text-gray-600 max-w-lg leading-relaxed opacity-0">
            Infraestructura líquida adaptada a ti. Cambiamos el caos administrativo por orden estratégico.
          </p>
          
          <div ref={textBtnRef} className="flex flex-col sm:flex-row gap-4 pt-4 w-full sm:w-auto opacity-0">
            <Link href="/contacto" className="px-8 py-4 rounded-full bg-gema-dark text-white font-bold text-lg shadow-xl hover:bg-gema-blue transition-all hover:scale-105 active:scale-95 text-center">
              Solicitar Demo
            </Link>
            <Link href="/modulos" className="px-8 py-4 rounded-full border border-gray-200 text-gema-dark font-medium text-lg hover:border-gema-blue hover:text-gema-blue transition-all bg-white text-center">
              Ver Módulos
            </Link>
          </div>
        </div>

        {/* COLUMNA DERECHA: VISUALES */}
        <div className="w-full lg:w-1/2 relative h-125 flex items-center justify-center">
  
  {/* ESCENARIO DESKTOP */}
  <div className="hidden lg:block relative w-full h-full perspective-[1000px]">

      {/* --- ÓRBITAS (Decoración de Fondo) --- */}
      {/* Usamos pointer-events-none para que no interfieran con los clics */}
      <div className="absolute inset-0 flex items-center justify-center ">
      
      {/* Órbita Pequeña */}
      <div className=" floating-card absolute w-70 h-70 rounded-full border-[1.5px] border-dashed border-blue-500 animate-[spin_60s_linear_infinite]"></div>
      
      {/* Órbita Mediana (Gira al revés) */}
      <div className="floating-card absolute w-105 h-105 rounded-full border-[1.5px] border-dashed border-purple-500 animate-[spin_80s_linear_infinite_reverse]"></div>
      
      {/* Órbita Grande */}
      <div className="floating-card absolute w-145 h-145 rounded-full border-[1.5px] border-dashed border-slate-500 animate-[spin_100s_linear_infinite]"></div>
      {/* <div className=" absolute w-[1080px] h-[1080px] rounded-full border-[1.5px] border-dashed border-slate-500 animate-[spin_100s_linear_infinite]"></div>
      <div className=" absolute w-[1580px] h-[1580px] rounded-full border-[1.5px] border-dashed border-slate-500 animate-[spin_100s_linear_infinite]"></div>
      <div className=" absolute w-[2080px] h-[2080px] rounded-full border-[1.5px] border-dashed border-slate-500 animate-[spin_100s_linear_infinite]"></div> */}

    
    </div>

      {/* Núcleo Central */}
     <div className="floating-card nucleus-card absolute top-1/2 left-1/2 z-20">
      <img 
        src="/Gema tittle.png" 
        alt="Gema Logo White" 
        className="w-40 h-auto" 
      />
    </div>

      {/* Satélites */}
      {/* ... (Aquí sigue tu código de satélites igual que antes) ... */}
      <div className="floating-card absolute top-[20%] left-[10%] bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-white/50 flex items-center gap-3 w-48 z-10">
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-gema-blue">📡</div>
        <div>
          <p className="font-bold text-sm text-gray-800">IoT Control</p>
          <p className="text-xs text-green-600">● En línea</p>
        </div>
      </div>

      <div className="floating-card absolute bottom-[25%] right-[5%] bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-white/50 flex items-center gap-3 w-52 z-30">
        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-gema-purple">📦</div>
        <div>
          <p className="font-bold text-sm text-gray-800">Inventario</p>
          <p className="text-xs text-gray-500">Actualizado</p>
        </div>
      </div>

      <div className="floating-card absolute top-[25%] right-[0%] bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-white/50 flex items-center gap-3 w-44 z-10">
        <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-500">⚕️</div>
        <div>
          <p className="font-bold text-sm text-gray-800">Clínica</p>
          <p className="text-xs text-gray-500">Pacientes</p>
        </div>
      </div>

      <div className="floating-card absolute bottom-[20%] left-[15%] bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-white/50 flex items-center gap-3 w-40 z-10">
        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-700">🔐</div>
        <div>
          <p className="font-bold text-sm text-gray-800">Admin</p>
          <p className="text-xs text-gray-500">Seguro</p>
        </div>
      </div>
  </div>


          {/* ESCENARIO MOBILE (Grid simple) */}
          <div className="lg:hidden w-full grid grid-cols-2 gap-3 mt-4">
              <div className="floating-card bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-gema-blue">📡</div>
                  <p className="font-bold text-xs text-gray-800">IoT</p>
              </div>
              <div className="floating-card bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-gema-purple">📦</div>
                  <p className="font-bold text-xs text-gray-800">Stock</p>
              </div>
               <div className="floating-card bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-500">⚕️</div>
                  <p className="font-bold text-xs text-gray-800">Salud</p>
              </div>
               <div className="floating-card bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-700">🔐</div>
                  <p className="font-bold text-xs text-gray-800">Admin</p>
              </div>
          </div>

        </div>
      </div>
    </section>
  );
}