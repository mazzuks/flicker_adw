import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { to, subject, title, body, link_url } = await req.json()

    // --- HTML TEMPLATE (Absolute Fidelity) ---
    const htmlBody = `
      <!DOCTYPE html>
      <html>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap" rel="stylesheet">
        <style>
          body { font-family: 'Inter', sans-serif; background-color: #F8FAFC; padding: 40px; color: #0F172A; }
          .container { max-width: 600px; background: white; border-radius: 32px; padding: 48px; border: 1px solid #E2E8F0; box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1); }
          .logo { background: #2563EB; width: 48px; height: 48px; border-radius: 12px; margin-bottom: 32px; display: flex; align-items: center; justify-content: center; color: white; font-weight: 900; }
          h2 { text-transform: uppercase; font-style: italic; font-weight: 900; letter-spacing: -0.05em; font-size: 24px; margin-bottom: 16px; }
          p { color: #64748B; line-height: 1.6; font-size: 16px; }
          .btn { display: inline-block; background: #0F172A; color: white !important; text-decoration: none; padding: 16px 32px; border-radius: 16px; font-weight: 900; text-transform: uppercase; font-size: 12px; letter-spacing: 0.2em; margin-top: 32px; }
          .footer { margin-top: 48px; border-top: 1px solid #F1F5F9; padding-top: 24px; font-size: 10px; font-weight: 700; color: #CBD5E1; text-transform: uppercase; letter-spacing: 0.4em; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">A</div>
          <h2>${title || subject}</h2>
          <p>${body}</p>
          ${link_url ? `<a href="${link_url}" class="btn">Acessar Painel</a>` : ''}
          <div class="footer">Adworks Empresa Pronta • Engine v1.0</div>
        </div>
      </body>
      </html>
    `

    // --- PROVIDER SELECTION (Default: Console log for MVP) ---
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
    
    if (RESEND_API_KEY) {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: 'Adworks <noreply@adworks.app>',
          to: [to],
          subject: subject,
          html: htmlBody
        })
      })
      const result = await res.json()
      return new Response(JSON.stringify(result), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    console.log(`[SIMULACAO EMAIL PRO] Para: ${to} | Assunto: ${subject}`);
    return new Response(JSON.stringify({ message: "Simulation success" }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400, headers: corsHeaders })
  }
})
