import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        console.log("Admin triggering Daily Market Briefing...");

        // Ensure we hit the absolute URL for the cron 
        const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
        const host = req.headers.get("host") || "localhost:3000";
        const cronUrl = `${protocol}://${host}/api/cron/daily-summary`;

        console.log(`[Admin Proxy] Fetching ${cronUrl} with Cron Secret...`);

        const res = await fetch(cronUrl, {
            headers: {
                'Authorization': `Bearer ${process.env.CRON_SECRET}`
            },
            // High timeout configuration just in case Vercel limits us
            cache: 'no-store'
        });

        const data = await res.json();

        // Return exactly what the cron job responds with
        return NextResponse.json(data, { status: res.status });

    } catch (error) {
        console.error("Failed to run briefing from admin:", error);
        return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
    }
}
