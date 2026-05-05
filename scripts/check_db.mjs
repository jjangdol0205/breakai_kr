import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import fetch from 'cross-fetch';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').replace(/[^a-zA-Z0-9\-_.://?&=]/g, '');
const supabaseKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').replace(/[^a-zA-Z0-9\-_.]/g, '');
const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false },
    global: { fetch: fetch }
});

async function main() {
    const { data: picks, error } = await supabase.from('oneil_picks').select('id, ticker, ai_report').limit(1);
    console.log(picks[0].ai_report);
}

main();
