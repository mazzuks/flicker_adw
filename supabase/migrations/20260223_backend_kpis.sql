-- MIGRATION: BACKEND KPI DASHBOARD
-- Purpose: Move complex KPI calculations (SLA, Pipeline) to the database for performance.
-- No emojis.

CREATE OR REPLACE VIEW public.v_dashboard_stats AS
WITH stats AS (
    SELECT 
        account_id,
        COALESCE(SUM(value_cents), 0) as total_pipeline_cents,
        COUNT(*) as total_deals,
        COUNT(*) FILTER (WHERE sla_status = 'breached') as overdue_count,
        -- AVG SLA calculation: difference in days from now to due_at
        AVG(EXTRACT(EPOCH FROM (sla_due_at - now())) / 86400) FILTER (WHERE sla_due_at IS NOT NULL) as avg_sla_days
    FROM public.v_deals_board
    GROUP BY account_id
)
SELECT 
    account_id,
    total_pipeline_cents,
    total_deals as active_deals,
    overdue_count,
    COALESCE(avg_sla_days, 0) as sla_avg_days
FROM stats;

GRANT SELECT ON public.v_dashboard_stats TO authenticated;
