import * as React from 'react';

interface ConfirmationTemplateProps {
  name: string;
}

export const ConfirmationTemplate: React.FC<Readonly<ConfirmationTemplateProps>> = ({
  name,
}) => {
  // Definimos los colores de tu marca basados en tu página web
  const colors = {
    bg: '#f9fafb', // Gris muy suave de fondo
    white: '#ffffff',
    text: '#111827', // Gray-900
    textLight: '#6b7280', // Gray-500
    blue: '#2563EB', // Blue-600
    buttonBg: '#111827', // El mismo negro/gris oscuro de tus botones
  };

  // URL base de tu sitio (cámbiala si usas otro dominio en producción)
  const baseUrl = 'https://gema-page.bpfcompanies.com';
  const logoUrl = 'https://gema-page.bpfcompanies.com/Gema.png'; 

  return (
    <div style={{ backgroundColor: colors.white, padding: '40px 20px', fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: colors.white, borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
        
        {/* Barra decorativa con el gradiente de tu marca (Azul a Morado) */}
        <div style={{ height: '6px', width: '100%', background: 'linear-gradient(to right, #2563EB, #9333EA)' }}></div>

        <div style={{ padding: '40px 32px' }}>
          
          {/* Logo Centrado */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <img 
              src={logoUrl} 
              alt="Gema Logo" 
              width="60" 
              height="60"
              style={{ display: 'inline-block', objectFit: 'contain' }} 
            />
          </div>

          {/* Título */}
          <h1 style={{ color: colors.text, fontSize: '24px', fontWeight: 'bold', margin: '0 0 16px', textAlign: 'center' }}>
            ¡Hemos recibido tu mensaje!
          </h1>

          {/* Saludo y Cuerpo */}
          <p style={{ color: colors.textLight, fontSize: '16px', lineHeight: '1.6', margin: '0 0 24px' }}>
            Hola <strong>{name}</strong>,
          </p>
          
          <p style={{ color: colors.textLight, fontSize: '16px', lineHeight: '1.6', margin: '0 0 24px' }}>
            Gracias por ponerte en contacto con <strong>Gema</strong>. Te confirmamos que tu solicitud ha llegado correctamente a nuestro sistema.
          </p>
          
          <p style={{ color: colors.textLight, fontSize: '16px', lineHeight: '1.6', margin: '0 0 32px' }}>
            Nuestro equipo de ingeniería revisará tu proyecto y uno de nuestros especialistas te contactará en las próximas <strong>24 horas</strong>.
          </p>

          {/* Botón de acción */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <a 
              href={baseUrl}
              style={{ 
                backgroundColor: colors.buttonBg, 
                color: '#ffffff', 
                padding: '14px 28px', 
                borderRadius: '12px', 
                textDecoration: 'none', 
                fontWeight: 'bold',
                fontSize: '16px',
                display: 'inline-block'
              }}
            >
              Volver al sitio web
            </a>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '32px 0' }} />

          {/* Footer */}
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: '#9ca3af', fontSize: '12px', margin: '0' }}>
              © {new Date().getFullYear()} Gema | Gestión Empresarial.
            </p>
            <p style={{ color: '#9ca3af', fontSize: '12px', margin: '4px 0 0' }}>
              Bogotá, Colombia
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};