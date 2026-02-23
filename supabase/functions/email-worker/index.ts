import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  try {
    // 1. Get PENDING emails from the queue
    const { data: queue } = await supabase
      .from('email_queue')
      .select('*')
      .eq('status', 'PENDING')
      .limit(10);

    if (!queue || queue.length === 0) {
      return new Response(JSON.stringify({ message: "No pending emails" }), { headers: corsHeaders })
    }

    const processed = []

    for (const email of queue) {
      // 2. Simulate sending (or use Resend/SendGrid here)
      console.log(`[EMAIL WORKER] Sending email to: ${email.to_email} | Subject: ${email.subject}`);
      
      // 3. Mark as SENT
      await supabase
        .from('email_queue')
        .update({ status: 'SENT', sent_at: new Date().toISOString() })
        .eq('id', email.id);

      processed.push(email.id);
    }

    return new Response(JSON.stringify({ processed }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: corsHeaders })
  }
})
