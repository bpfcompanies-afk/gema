'use client';
import React from 'react';
import Link from 'next/link';
import { 
  FileValidationIcon, 
  Shield02Icon, 
  CopyrightIcon, 
  Gps01Icon, 
  Download01Icon,
  ArrowLeft01Icon
} from 'hugeicons-react';

const legalDocs = [
  {
    id: 'terminos',
    title: 'Términos y Condiciones',
    description: 'Reglas generales de uso, derechos y responsabilidades al utilizar nuestra plataforma.',
    fileUrl: '/docs/TÉRMINOS Y CONDICIONES DE USO - GEMA.pdf', // Ruta a tu archivo real
    icon: FileValidationIcon,
    color: 'text-blue-500',
    bg: 'bg-blue-50'
  },
  {
    id: 'privacidad',
    title: 'Política de Privacidad',
    description: 'Cómo recopilamos, usamos y protegemos tus datos personales según la normativa vigente.',
    fileUrl: '/docs/Política de Privacidad - GEMA.pdf',
    icon: Shield02Icon,
    color: 'text-emerald-500',
    bg: 'bg-emerald-50'
  },
  {
    id: 'cookies',
    title: 'Política de Cookies',
    description: 'Detalle sobre las cookies que utilizamos para mejorar tu experiencia de navegación.',
    fileUrl: '/docs/POLÍTICA DE COOKIES - GEMA.pdf',
    icon: Gps01Icon,
    color: 'text-amber-500',
    bg: 'bg-amber-50'
  },
  {
    id: 'DPA',
    title: 'Acuerdo de Procesamiento de Datos (DPA)',
    description: 'Establece responsabilidades sobre el procesamiento seguro de datos.',
    fileUrl: '/docs/ACUERDO DE ENCARGADO DE TRATAMIENTO DE DATOS PERSONALES - GEMA.pdf',
    icon: CopyrightIcon,
    color: 'text-purple-500',
    bg: 'bg-purple-50'
  }
];

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-gray-50/50 py-20 px-4 md:px-8 font-sans">
      
      {/* --- HEADER --- */}
      <div className="max-w-5xl mx-auto mb-16 text-center">
        <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
          Centro Legal y <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Transparencia</span>
        </h1>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto">
          Accede y descarga toda la documentación legal relacionada con el uso de nuestros servicios.
        </p>
      </div>

      {/* --- GRID DE TARJETAS --- */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {legalDocs.map((doc) => (
          <div 
            key={doc.id}
            className="group bg-white rounded-2xl border border-gray-100 p-6 md:p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
          >
            {/* Decoración de fondo sutil */}
            <div className={`absolute top-0 right-0 w-24 h-24 rounded-bl-full opacity-10 ${doc.bg} transition-transform group-hover:scale-150 duration-500`} />

            <div className="relative z-10 flex flex-col h-full">
              {/* Icono */}
              <div className={`w-14 h-14 rounded-xl ${doc.bg} ${doc.color} flex items-center justify-center mb-6 shadow-sm group-hover:shadow-md transition-shadow`}>
                <doc.icon size={28} strokeWidth={1.5} />
              </div>

              {/* Contenido */}
              <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                {doc.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-8 flex-grow">
                {doc.description}
              </p>

              {/* Botón de Descarga */}
              <a 
                href={doc.fileUrl} 
                download 
                className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700 bg-gray-50 border border-gray-200 px-4 py-3 rounded-lg hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all w-full justify-center md:w-auto md:justify-start group/btn"
              >
                <Download01Icon size={18} />
                <span>Descargar PDF</span>
                <span className="opacity-0 -translate-x-2 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all text-xs text-gray-400 group-hover/btn:text-white/70 ml-1">
                   (2.4 MB)
                </span>
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* --- FOOTER DE AYUDA --- */}
      <div className="max-w-3xl mx-auto mt-20 text-center border-t border-gray-200 pt-10">
        <p className="text-gray-500 text-sm">
          ¿Tienes dudas sobre alguno de estos documentos? <br className="md:hidden"/>
          <a href="/contacto" className="text-blue-600 font-semibold hover:underline ml-1">
            Contacta a nuestro equipo legal
          </a>
        </p>
        <p className="text-gray-300 text-xs mt-4">
          Última actualización: Febrero 2026
        </p>
      </div>

    </div>
  );
}