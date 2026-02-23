import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // 1. Setup Supabase Client
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  try {
    const today = new Date().toISOString().split('T')[0]
    const in3Days = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    const yesterday = new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

    // 2. Fetch Pending Events for critical dates
    const { data: events } = await supabase
      .from('fiscal_events')
      .select('*, accounts(name)')
      .eq('status', 'pending')
      .or(`due_date.eq.${today},due_date.eq.${in3Days},due_date.eq.${yesterday}`)

    if (!events || events.length === 0) {
      return new Response(JSON.stringify({ message: "No pending events to alert" }), { headers: corsHeaders })
    }

    const notificationsSent = []

    for (const event of events) {
      let type: 'before_3d' | 'due_today' | 'overdue_1d' | null = null
      
      if (event.due_date === in3Days) type = 'before_3d'
      else if (event.due_date === today) type = 'due_today'
      else if (event.due_date === yesterday) type = 'overdue_1d'

      if (!type) continue

      // 3. Check for duplicates
      const { data: existing } = await supabase
        .from('fiscal_event_notifications')
        .select('*')
        .eq('event_id', event.id)
        .eq('notification_type', type)
        .maybeSingle()

      if (existing) continue

      // 4. Send Email (Mock for now, would use an email provider API)
      console.log(`[FISCAL ALERT] Sending ${type} for ${event.title} to account ${event.account_id}`)
      
      // 5. Log Notification
      await supabase.from('fiscal_event_notifications').insert({
        event_id: event.id,
        account_id: event.account_id,
        notification_type: type
      })

      notificationsSent.push({ id: event.id, type })
    }

    return new Response(JSON.stringify({ sent: notificationsSent }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: corsHeaders })
  }
})
