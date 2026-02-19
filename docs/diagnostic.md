# Diagnostic - AdWorks Flicker
Date: 2026-02-19

## Environment
- Supabase URL: `https://nskecgwpdprzrowwawwb.supabase.co` (Corrected from .env)
- Environment: `development`
- Auth Mode: `oauth` (mazzuks@gmail.com)

## DB Smoke Test Result
- **Status:** Connectivity OK, but tables are empty or inaccessible due to RLS.
- **companies:** null (no data/denied)
- **deals:** null
- **deal_checklist_items:** null
- **deal_docs:** null
- **messages_threads:** null
- **messages:** null

## Root Cause
The app was pointing to a different Supabase URL in my previous internal state. The `.env` confirms the real project is `nskecgwpdprzrowwawwb`. The tables exist but have 0 records or are being blocked by RLS policies.
