'use client';
import { useState, useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { 
  Mail01Icon as Mail01, 
  WhatsappIcon as Whatsapp, 
  Location01Icon as Location01, 
  SentIcon as Sent,
  Copy01Icon as Copy01,
  CheckmarkCircle01Icon as Checkmark,
  ArrowRight01Icon as ArrowRight01,
  HeadphonesIcon as Headphones,
  BubbleChatIcon
} from 'hugeicons-react';

// --- COMPONENTE REUTILIZABLE: SPOTLIGHT CARD (CORREGIDO) ---
const SpotlightCard = ({ children, className = "", spotlightColor = "rgba(59, 130, 246, 0.15)", onClick }: any) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: -500, y: -500 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      // Agregamos 'h-full' para asegurar que la tarjeta no se colapse
      className={`relative h-full rounded-3xl overflow-hidden bg-white border border-gray-100 transition-all duration-300 ${className}`}
    >
      {/* El brillo */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300 z-10"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 40%)`,
        }}
      />
      {/* Contenido */}
      <div className="relative z-20 h-full">
        {children}
      </div>
    </div>
  );
};

// --- COMPONENTE INPUT ANIMADO ---
const AnimatedInput = ({ label, type = "text", value, onChange, placeholder, required = false }: any) => {
  return (
    <div className="relative group">
      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1 transition-colors group-focus-within:text-blue-600">
        {label}
      </label>
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className="w-full bg-gray-50 text-gray-900 px-5 py-4 rounded-xl border border-gray-200 outline-none focus:bg-white transition-all placeholder:text-gray-400 font-medium"
        />
        {/* Línea animada inferior */}
        <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-blue-600 transition-all duration-500 ease-out group-focus-within:w-full rounded-b-xl" />
      </div>
    </div>
  );
};

export default function ContactPage() {
  const [formState, setFormState] = useState({ name: '', email: '', company: '', message: '' });
  const [isCopied, setIsCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const containerRef = useRef(null);

  // --- ANIMACIONES CORREGIDAS (IGUAL QUE PRICING PAGE) ---
  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      // 1. Configurar estado inicial (invisible pero ocupando espacio)
      gsap.set(".animate-item", { opacity: 0, y: 30 });

      // 2. Animar hacia visible
      gsap.to(".animate-item", {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1, // Efecto cascada entre elementos
        ease: "power3.out",
        clearProps: "all" // Limpia los estilos inline al terminar para evitar conflictos
      });

    }, containerRef);
    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
   e.preventDefault();
   setIsSubmitting(true); // Activa la animación de carga

   try {
      const response = await fetch('/api/send', {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
         },
         body: JSON.stringify(formState),
      });

      if (response.ok) {
         // Éxito
         alert('¡Mensaje enviado correctamente! Nos pondremos en contacto contigo.');
         // Limpiar el formulario
         setFormState({
            name: '',
            email: '',
            company: '',
            message: ''
         });
      } else {
         // Error del servidor
         alert('Hubo un error al enviar el mensaje. Por favor intenta de nuevo.');
      }
   } catch (error) {
      // Error de red
      console.error(error);
      alert('Error de conexión.');
   } finally {
      setIsSubmitting(false); // Desactiva la animación de carga
   }
};

  const copyEmail = () => {
    navigator.clipboard.writeText('hola@gema.co');
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    // Fondo blanco puro sin grids
    <main ref={containerRef} className="bg-white min-h-screen pb-24 relative overflow-hidden selection:bg-blue-100 selection:text-blue-900">
      
      {/* HEADER */}
      <section className="pt-32 pb-16 px-6 md:px-12 w-full relative z-10 animate-item">
        <div className="max-w-[1400px] mx-auto text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[11px] font-bold uppercase tracking-widest mb-6 border border-blue-100">
             <BubbleChatIcon size={12} /> Hablemos de negocios
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight">
            Impulsa tu <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">transformación</span>
          </h1>
          <p className="text-gray-500 text-lg md:text-xl max-w-2xl leading-relaxed">
            Nuestro equipo de ingeniería está listo para escalar tu operación. <br className="hidden md:block" />
            Agenda una demo o resuelve tus dudas técnicas hoy mismo.
          </p>
        </div>
      </section>

      {/* GRID PRINCIPAL */}
      <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">

          {/* --- COLUMNA IZQUIERDA (Info) --- */}
          <div className="lg:col-span-4 flex flex-col gap-5 order-2 lg:order-1 h-full">
            
            {/* CARD 1: WHATSAPP */}
            <div className="animate-item h-auto">
              <SpotlightCard 
                className="group bg-white hover:shadow-xl hover:shadow-green-100/50 hover:-translate-y-1"
                spotlightColor="rgba(34, 197, 94, 0.2)"
              >
                 <a href="https://wa.me/573227405663" target="_blank" rel="noreferrer" className="block p-8 h-full">
                    <div className="flex justify-between items-start mb-8">
                       <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 group-hover:scale-110 transition-transform duration-300">
                          <Whatsapp size={28}  />
                       </div>
                       <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                          </span>
                          Online
                       </span>
                    </div>
                    <div>
                       <p className="text-green-800 font-semibold text-sm flex items-center gap-2 mb-1">
                          <Headphones size={14} /> Soporte Inmediato
                       </p>
                       <div className="flex items-center justify-between">
                          <h3 className="text-2xl font-bold text-gray-900">WhatsApp</h3>
                          <ArrowRight01 className="text-gray-300 group-hover:text-green-600 group-hover:translate-x-2 transition-all" />
                       </div>
                    </div>
                 </a>
              </SpotlightCard>
            </div>

            {/* CARD 2: EMAIL */}
            <div className="animate-item h-auto">
              <SpotlightCard 
                onClick={copyEmail}
                className="group cursor-pointer hover:shadow-xl hover:shadow-blue-100/50 hover:-translate-y-1"
                spotlightColor="rgba(59, 130, 246, 0.2)"
              >
                <div className="p-8 h-full flex flex-col justify-between">
                   <div className="flex justify-between items-start mb-6">
                      <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:rotate-6 transition-transform duration-300">
                         <Mail01 size={28}  />
                      </div>
                      <div className={`
                         transition-all duration-300 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2
                         ${isCopied ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-600'}
                      `}>
                         {isCopied ? (
                            <> <Checkmark size={14} /> Copiado </>
                         ) : (
                            <> <Copy01 size={14} /> Copiar </>
                         )}
                      </div>
                   </div>
                   <div>
                      <p className="text-gray-500 font-medium text-sm mb-1">Correo Corporativo</p>
                      <h3 className="text-xl font-bold text-gray-900 truncate">bpfcompanies@gmail.com</h3>
                   </div>
                </div>
              </SpotlightCard>
            </div>

            {/* CARD 3: OFICINA */}
            <div className="animate-item flex-1">
              <div className="bg-gray-900 text-white p-8 rounded-3xl relative overflow-hidden h-full flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300 shadow-2xl shadow-gray-900/20 min-h-[200px]">
                 {/* Fondo sutil interno */}
                 <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#4b5563 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                 
                 <div className="relative z-10 w-12 h-12 bg-white/10 backdrop-blur rounded-xl flex items-center justify-center border border-white/10 mb-6">
                    <Location01 size={24} />
                 </div>
                 
                 <div className="relative z-10">
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Sede Principal</p>
                    <p className="text-lg font-bold leading-snug"><br />Bogotá, Colombia</p>
                 </div>
              </div>
            </div>

          </div>

          {/* --- COLUMNA DERECHA (Formulario) --- */}
          <div className="lg:col-span-8 order-1 lg:order-2 h-full animate-item">
            <SpotlightCard 
              className="h-full p-1 bg-white shadow-2xl shadow-gray-200/50" 
              spotlightColor="rgba(124, 58, 237, 0.15)"
            >
               <div className="h-full bg-white rounded-[23px] p-8 md:p-12 relative overflow-hidden flex flex-col">
                  
                  {/* Orbe decorativo muy suave (opcional, si no te gusta lo puedes quitar) */}
                  <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-b from-blue-50/50 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                  <div className="relative z-10 mb-10">
                     <h2 className="text-3xl font-bold text-gray-900 mb-3">Envíanos una solicitud</h2>
                     <p className="text-gray-500">Recibe respuesta de un especialista en menos de 24 horas.</p>
                  </div>

                  <form onSubmit={handleSubmit} className="relative z-10 space-y-6 flex-1 flex flex-col">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <AnimatedInput 
                           label="Nombre Completo" 
                           placeholder="Ej. Ana García"
                           value={formState.name}
                           onChange={(e: any) => setFormState({...formState, name: e.target.value})}
                           required
                        />
                        <AnimatedInput 
                           label="Fundacion / Empresa" 
                           placeholder="Ej. Gema Inc."
                           value={formState.company}
                           onChange={(e: any) => setFormState({...formState, company: e.target.value})}
                        />
                     </div>

                     <AnimatedInput 
                        label="Correo Corporativo" 
                        type="email"
                        placeholder="nombre@empresa.com"
                        value={formState.email}
                        onChange={(e: any) => setFormState({...formState, email: e.target.value})}
                        required
                     />

                     <div className="group flex-1 flex flex-col">
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1 transition-colors group-focus-within:text-blue-600">
                           ¿Cómo podemos ayudarte?
                        </label>
                        <div className="relative flex-1">
                           <textarea 
                              rows={5}
                              placeholder="Cuéntanos sobre tu proyecto..."
                              className="w-full bg-gray-50 text-gray-900 px-5 py-4 rounded-xl border border-gray-200 outline-none focus:bg-white transition-all placeholder:text-gray-400 font-medium resize-none h-full min-h-[150px]"
                              required
                              value={formState.message}
                              onChange={(e) => setFormState({...formState, message: e.target.value})}
                           />
                           <div className="absolute bottom-1 left-0 right-0 mx-auto w-0 h-[2px] bg-blue-600 transition-all duration-500 ease-out group-focus-within:w-full" />
                        </div>
                     </div>

                     <div className="pt-4 flex justify-end">
                        <button 
                           type="submit" 
                           disabled={isSubmitting}
                           className={`
                              relative overflow-hidden px-10 py-4 bg-gray-900 text-white rounded-xl font-bold text-lg flex items-center gap-3 transition-all duration-300
                              ${isSubmitting ? 'pl-14 bg-gray-700 cursor-not-allowed' : 'hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-600/30 hover:-translate-y-1'}
                           `}
                        >
                           {isSubmitting && (
                              <span className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                           )}
                           <span>{isSubmitting ? 'Enviando...' : 'Enviar Mensaje'}</span>
                           {!isSubmitting && <Sent size={20} className="group-hover:translate-x-1 transition-transform" />}
                        </button>
                     </div>
                  </form>
               </div>
            </SpotlightCard>
          </div>

        </div>
      </div>
    </main>
  );
}