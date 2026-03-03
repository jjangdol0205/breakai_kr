import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function clearPicks() {
    console.log("Clearing all picks...");
    const { error } = await supabase.from('oneil_picks').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    if (error) {
        console.error("Error clearing picks:", error.message);
    } else {
        console.log("Successfully cleared picks.");
    }
}
clearPicks();
