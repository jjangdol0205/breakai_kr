import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function debugReport() {
    const { data: picks, error } = await supabase
        .from('oneil_picks')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1);

    if (error) {
        console.error("Error fetching picks:", error);
    } else if (picks && picks.length > 0) {
        console.log("----- AI REPORT BEGIN -----");
        console.log(picks[0].ai_report);
        console.log("----- AI REPORT END -----");
    } else {
        console.log("No picks found.");
    }
}
debugReport();
