import React from 'react';
import { EmailTemplate } from '../../../components/EmailTemplate';
import { ConfirmationTemplate } from '../../../components/ConfirmationTemplate';
import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, company, message } = body;

    const data = await resend.batch.send([
      {
        from: 'Gema Web <sistema@gema.bpfcompanies.com>',
        to: ['bpfcompanies@gmail.com'],
        subject: `Nuevo Lead de: ${name}`,
        react: React.createElement(EmailTemplate, { name, email, company, message }),
      },
      
      {
        from: 'Equipo Gema <contacto@gema.bpfcompanies.com>',
        to: [email],
        subject: '¡Recibimos tu mensaje!',
        react: React.createElement(ConfirmationTemplate, { name }),
      }
    ]);

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}