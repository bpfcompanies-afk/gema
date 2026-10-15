import React from 'react';
import { EmailTemplate } from '../../../components/EmailTemplate';
import { ConfirmationTemplate } from '../../../components/ConfirmationTemplate';
import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { parsePlanSelection, buildPricedQuoteSummary } from '../../../lib/pricing';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, company } = body;
    let { message } = body;

    // La calculadora envía solo la selección (sin precios); los valores se
    // calculan aquí para que nunca lleguen al navegador.
    if (body.plan !== undefined) {
      const plan = parsePlanSelection(body.plan);
      if (!plan) return NextResponse.json({ error: 'Selección de plan inválida' }, { status: 400 });
      message = [typeof message === 'string' ? message.trim() : '', buildPricedQuoteSummary(plan)]
        .filter(Boolean).join('\n\n');
    }

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