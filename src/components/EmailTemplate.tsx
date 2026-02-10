import * as React from 'react';

interface EmailTemplateProps {
  name: string;
  email: string;
  message: string;
  company?: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  name,
  email,
  message,
  company,
}) => (
  <div style={{ fontFamily: 'sans-serif', padding: '20px', color: '#333' }}>
    <h1>Nuevo mensaje de contacto</h1>
    <p><strong>De:</strong> {name}</p>
    <p><strong>Email:</strong> {email}</p>
    {company && <p><strong>Empresa:</strong> {company}</p>}
    <hr />
    <h3>Mensaje:</h3>
    <p style={{ whiteSpace: 'pre-wrap' }}>{message}</p>
  </div>
);