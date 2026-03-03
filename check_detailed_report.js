const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase credentials in .env.local");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkLatestReport() {
    console.log("Fetching latest 5 reports...");
    const { data, error } = await supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

    if (error) {
        console.error("Error fetching report:", error);
        return;
    }

    if (data && data.length > 0) {
        console.log("--- Latest 5 Reports ---");
        data.forEach(report => {
            let analysis = {};
            try {
                if (report.analysis_text) {
                    analysis = JSON.parse(report.analysis_text);
                }
            } catch (e) { }

            console.log(`[${report.ticker}] Created: ${report.created_at}`);
            console.log(`  - Has detailed_report column? ${report.hasOwnProperty('detailed_report')}`);
            console.log(`  - detailed_report len: ${report.detailed_report ? report.detailed_report.length : 0}`);

            // Check inside analysis_text as fallback
            const jsonHasDetailed = analysis && analysis.detailed_report;
            console.log(`  - analysis_text.detailed_report exists? ${!!jsonHasDetailed}`);
            console.log("------------------------------------------------");
        });
    } else {
        console.log("No reports found.");
    }
}

checkLatestReport();
