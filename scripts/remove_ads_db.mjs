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
    console.log("Fetching all records...");
    const { data: picks, error } = await supabase.from('oneil_picks').select('*');
    if (error) { console.error(error); return; }

    for (const pick of picks) {
        if (pick.ai_report && pick.ai_report.includes('💡 애널리스트의 픽')) {
            // Remove the line with 💡 애널리스트의 픽 and anything after it up to the end of the line
            const newReport = pick.ai_report.replace(/💡 애널리스트의 픽.*(\n|$)/g, '');
            const { error: updateError } = await supabase
                .from('oneil_picks')
                .update({ ai_report: newReport })
                .eq('id', pick.id);
            
            if (updateError) {
                console.error("Failed to update", pick.id);
            } else {
                console.log("Updated", pick.ticker);
            }
        }
    }
    console.log("Done");
}

main();
