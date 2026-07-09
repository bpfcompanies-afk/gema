'use client';
import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import {
  BookOpen01Icon,
  Download01Icon,
  ArrowUpRight01Icon,
} from 'hugeicons-react';

const BROCHURE_URL = '/docs/brochure.pdf';

export default function BrochurePage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set('.page-fade', { opacity: 0, y: 24 });
      gsap.to('.page-fade', { opacity: 1, y: 0, stagger: 0.1, duration: 0.7, ease: 'power3.out', delay: 0.1 });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <main ref={containerRef} className="bg-white min-h-screen relative">
      <div className="absolute top-0 left-0 w-full h-125 bg-linear-to-b from-slate-50 to-white -z-10" />

      {/* HEADER */}
      <section className="pt-40 pb-10 px-6 text-center relative z-10 page-fade">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[11px] font-bold uppercase tracking-widest mb-6 border border-blue-100">
          <BookOpen01Icon size={12} /> Recurso descargable
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
          Nuestro <span className="text-gradient">Brochure</span>
        </h1>
        <p className="text-gray-500 max-w-xl mx-auto text-lg leading-relaxed">
          Conoce a fondo qué es Gema, sus módulos y cómo puede transformar la gestión de tu fundación.
        </p>
      </section>

      {/* ACCIONES */}
      <section className="px-6 pb-8 flex flex-wrap items-center justify-center gap-3 relative z-10 page-fade">
        <a
          href={BROCHURE_URL}
          download
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-gema-gradient text-white font-bold text-sm shadow-lg shadow-blue-200 hover:opacity-90 hover:shadow-xl hover:shadow-blue-300/50 transition-all"
        >
          <Download01Icon size={16} />
          Descargar PDF
        </a>
        <a
          href={BROCHURE_URL}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 px-6 py-3 rounded-full border-2 border-gray-200 text-gray-600 font-bold text-sm hover:border-gray-300 hover:text-gray-900 transition-all bg-white"
        >
          Abrir en pestaña nueva
          <ArrowUpRight01Icon size={16} />
        </a>
      </section>

      {/* VISOR PDF */}
      <section className="container mx-auto max-w-5xl px-4 md:px-8 pb-32 relative z-10 page-fade">
        <div className="rounded-3xl border border-gray-200 shadow-xl shadow-gray-100/60 overflow-hidden bg-gray-50">
          <iframe
            src={`${BROCHURE_URL}#toolbar=0`}
            title="Brochure Gema"
            className="w-full h-[75vh] block"
          />
        </div>
        <p className="text-center text-xs text-gray-400 mt-4">
          ¿No se ve el documento? <a href={BROCHURE_URL} download className="text-gema-blue font-semibold hover:underline">Descárgalo directamente aquí</a>.
        </p>
      </section>
    </main>
  );
}
